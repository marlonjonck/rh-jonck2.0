import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { GitHubRepository } from "@/types/github";

export const useGitHubRepos = (owner: string) => {
  return useQuery({
    queryKey: ["github-repos", owner],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("github-repos", {
        body: { owner },
      });

      if (error) {
        throw new Error(error.message || "Erro ao buscar repositórios");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      return data as GitHubRepository[];
    },
    enabled: !!owner,
  });
};
