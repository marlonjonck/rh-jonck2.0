import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { GitHubTag } from "@/types/github";

export const useGitHubTags = (owner: string, repo: string) => {
  return useQuery({
    queryKey: ["github-tags", owner, repo],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("github-tags", {
        body: { owner, repo },
      });

      if (error) {
        throw new Error(error.message || "Erro ao buscar tags");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      return data as GitHubTag[];
    },
    enabled: !!repo && !!owner,
  });
};
