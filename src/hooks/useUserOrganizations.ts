import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface UserOrganization {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  role: string;
  is_owner: boolean;
}

export const useUserOrganizations = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["user-organizations", userId],
    queryFn: async () => {
      if (!userId) return [];

      // Step 1: get organization membership via RPC (avoids PostgREST enum serialization issue)
      const { data: members, error: membersError } = await supabase
        .rpc("get_user_organizations", { p_user_id: userId });

      if (membersError) throw membersError;
      if (!members || members.length === 0) return [];

      // Step 2: get organization details
      const orgIds = members.map((m: any) => m.organization_id);
      const { data: orgs, error: orgsError } = await supabase
        .from("organizations")
        .select("id, name, slug, logo_url")
        .in("id", orgIds);

      if (orgsError) throw orgsError;

      return (orgs || []).map((org) => {
        const member = members.find((m: any) => m.organization_id === org.id);
        return {
          id: org.id,
          name: org.name,
          slug: org.slug,
          logo_url: org.logo_url,
          role: (member as any)?.role ?? "user",
          is_owner: (member as any)?.is_owner || false,
        };
      }) as UserOrganization[];
    },
    enabled: !!userId,
  });
};
