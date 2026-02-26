import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Tag, ExternalLink, Calendar } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useGitHubTags } from "@/hooks/useGitHubTags";
import { useGitHubReleases } from "@/hooks/useGitHubReleases";
import { useToast } from "@/hooks/use-toast";

const ProjectChangelog = () => {
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: tags, isLoading: tagsLoading } = useGitHubTags(owner || "", repo || "");
  const { data: releases, isLoading: releasesLoading } = useGitHubReleases(owner || "", repo || "");

  const selectedRelease = releases?.find((r) => r.tag_name === selectedTag);

  // Seleciona a primeira tag automaticamente
  if (tags && tags.length > 0 && !selectedTag) {
    setSelectedTag(tags[0].name);
  }

  if (tagsLoading || releasesLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Skeleton className="h-96 w-full" />
            </div>
            <div className="lg:col-span-3">
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/projects">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">
              {owner}/{repo}
            </h1>
            <p className="text-muted-foreground">Changelog de versões</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar com Tags */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  <div className="p-4 space-y-2">
                    {tags?.map((tag) => (
                      <Button
                        key={tag.name}
                        variant={selectedTag === tag.name ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setSelectedTag(tag.name)}
                      >
                        {tag.name}
                      </Button>
                    ))}
                    {tags?.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Nenhuma tag encontrada
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Área de Changelog */}
          <div className="lg:col-span-3">
            {selectedRelease ? (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl mb-2">
                        {selectedRelease.name || selectedRelease.tag_name}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(selectedRelease.published_at).toLocaleDateString("pt-BR")}
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedRelease.prerelease && (
                            <Badge variant="outline">Pre-release</Badge>
                          )}
                          {selectedRelease.draft && (
                            <Badge variant="outline">Draft</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <a
                      href={selectedRelease.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      Ver no GitHub
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert [&>*]:text-foreground [&_p]:text-foreground [&_h1]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_h4]:text-foreground [&_strong]:text-foreground [&_li]:text-foreground [&_ul]:my-2 [&_li]:my-0 [&_a]:text-primary">
                    <ReactMarkdown>{selectedRelease.body}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {selectedTag
                      ? "Nenhum changelog disponível para esta tag"
                      : "Selecione uma tag para ver o changelog"}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectChangelog;
