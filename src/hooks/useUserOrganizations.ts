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

      // Step 1: get organization_ids for this user
      const { data: members, error: membersError } = await supabase
        .from("organization_members")
        .select("organization_id, is_owner, role")
        .eq("user_id", userId);

      if (membersError) throw membersError;
      if (!members || members.length === 0) return [];

      // Step 2: get organization details
      const orgIds = members.map((m) => m.organization_id);
      const { data: orgs, error: orgsError } = await supabase
        .from("organizations")
        .select("id, name, slug, logo_url")
        .in("id", orgIds);

      if (orgsError) throw orgsError;

      return (orgs || []).map((org) => {
        const member = members.find((m) => m.organization_id === org.id);
        return {
          id: org.id,
          name: org.name,
          slug: org.slug,
          logo_url: org.logo_url,
          role: (member as any)?.role ?? "user",
          is_owner: member?.is_owner || false,
        };
      }) as UserOrganization[];
    },
    enabled: !!userId,
  });
};
