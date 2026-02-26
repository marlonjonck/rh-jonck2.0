import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { GitHubRelease } from "@/types/github";

export const useGitHubReleases = (owner: string, repo: string) => {
  return useQuery({
    queryKey: ["github-releases", owner, repo],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("github-releases", {
        body: { owner, repo },
      });

      if (error) {
        throw new Error(error.message || "Erro ao buscar releases");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      return data as GitHubRelease[];
    },
    enabled: !!repo && !!owner,
  });
};
