import { Card, CardContent } from "@/components/ui/card";
import { Package, AlertCircle } from "lucide-react";
import { useCurrentOrganization } from "@/hooks/useCurrentOrganization";

export default function Devices() {
  const { organization } = useCurrentOrganization();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Package className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventário</h1>
          <p className="text-muted-foreground">
            Gerencie os equipamentos de {organization?.name || "sua organização"}
          </p>
        </div>
      </div>

      <Card className="border-yellow-500/40 bg-yellow-50/40 dark:bg-yellow-950/20">
        <CardContent className="flex items-start gap-3 pt-4 pb-4">
          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
              Módulo em desenvolvimento
            </p>
            <p className="text-xs text-yellow-700 dark:text-yellow-400/80 mt-0.5">
              O módulo de Inventário está sendo implementado. Em breve você poderá
              cadastrar e gerenciar equipamentos, notebooks, celulares e outros
              ativos da empresa.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
