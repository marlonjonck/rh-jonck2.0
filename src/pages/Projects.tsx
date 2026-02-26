import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FolderGit2, Tag, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useGitHubRepos } from "@/hooks/useGitHubRepos";
import { useToast } from "@/hooks/use-toast";

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [owner] = useState("popcodemobile"); // Organização Popcode
  const { toast } = useToast();
  
  const { data: repos, isLoading, error } = useGitHubRepos(owner);

  useEffect(() => {
    if (error) {
      toast({
        title: "Erro ao carregar projetos",
        description: "Não foi possível buscar os repositórios do GitHub.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const filteredRepos = repos?.filter((repo) =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Projetos GitHub</h1>
          <p className="text-muted-foreground">
            Visualize repositórios e suas versões
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar projetos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRepos?.map((repo) => (
              <Card key={repo.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderGit2 className="h-5 w-5" />
                    {repo.name}
                  </CardTitle>
                  <CardDescription>
                    {repo.description || "Sem descrição"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    {repo.language && (
                      <span className="text-sm text-muted-foreground">
                        {repo.language}
                      </span>
                    )}
                    <Link
                      to={`/projects/${owner}/${repo.name}`}
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      <Tag className="h-4 w-4" />
                      Ver Tags
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && filteredRepos?.length === 0 && (
          <div className="text-center py-12">
            <FolderGit2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Nenhum projeto encontrado
            </p>
          </div>
        )}
    </div>
  );
};

export default Projects;
