// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getIntegrationSecret } from "../_shared/get-integration-secret.ts";
import { checkRateLimit, getRateLimitKey } from "../_shared/rate-limit.ts";

const FUNCTION_NAME = "github-releases";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Validates user authentication and returns user ID and organization ID
 */
async function validateAuth(req: Request, supabaseAdmin: any): Promise<{ 
  userId: string; 
  orgId: string | null;
  error: Response | null 
}> {
  const authHeader = req.headers.get("Authorization");
  
  if (!authHeader?.startsWith("Bearer ")) {
    return {
      userId: "",
      orgId: null,
      error: new Response(
        JSON.stringify({ error: "Unauthorized", detail: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      ),
    };
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const token = authHeader.replace("Bearer ", "");
  const { data: claims, error: claimsError } = await supabaseClient.auth.getClaims(token);

  if (claimsError || !claims?.claims?.sub) {
    return {
      userId: "",
      orgId: null,
      error: new Response(
        JSON.stringify({ error: "Unauthorized", detail: "Invalid or expired token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      ),
    };
  }

  const userId = claims.claims.sub as string;
  
  // Get user's organization using raw RPC call
  const { data: orgId } = await supabaseAdmin.rpc("get_user_organization", { _user_id: userId }) as { data: string | null };
  
  return { userId, orgId: orgId || null, error: null };
}

serve(async (req) => {
  const requestId = crypto.randomUUID().slice(0, 8);
  
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { userId, orgId, error: authError } = await validateAuth(req, supabaseAdmin);
  if (authError) {
    return authError;
  }

  // === SECURITY: Rate limiting (SEC-007) ===
  const rlKey = getRateLimitKey(req, userId);
  const rl = await checkRateLimit(supabaseAdmin, rlKey, FUNCTION_NAME);
  if (!rl.allowed) return rl.response!;

  try {
    const { owner, repo } = await req.json();

    if (!owner || !repo) {
      return new Response(
        JSON.stringify({ error: "Owner and repo parameters are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Try to get GitHub token from Vault first, then fallback to env
    let githubToken: string | null = null;
    
    if (orgId) {
      githubToken = await getIntegrationSecret(supabaseAdmin, orgId, "github", { updateLastUsed: true });
    }
    
    // Fallback to environment variable (transition period)
    if (!githubToken) {
      githubToken = Deno.env.get("GITHUB_TOKEN") || null;
    }
    
    if (!githubToken) {
      return new Response(
        JSON.stringify({ error: "GitHub não configurado. Configure nas integrações da organização." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[${FUNCTION_NAME}][${requestId}] Fetching releases for ${owner}/${repo}`);

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/releases?per_page=100`,
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return new Response(
        JSON.stringify({ error: `GitHub API error: ${error}` }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    console.log(`[${FUNCTION_NAME}][${requestId}] Returning ${data.length} releases`);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
