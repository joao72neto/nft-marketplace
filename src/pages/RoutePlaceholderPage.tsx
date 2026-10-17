import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface RoutePlaceholderProps {
  title: string;
  description?: string;
  routePath: string;
}

export function RoutePlaceholderPage({
  title,
  description = "Esta rota faz parte da infraestrutura da Fundação e será implementada com as telas completas de negócio na próxima especificação.",
  routePath,
}: RoutePlaceholderProps) {
  return (
    <div className="container max-w-300 mx-auto px-4 lg:px-0 py-12">
      <Card className="border-border-dark bg-surface-card/60">
        <CardHeader>
          <div className="inline-block text-xs font-mono text-primary uppercase tracking-wider mb-2">
            Rota Base: {routePath}
          </div>
          <CardTitle className="text-2xl md:text-3xl font-mono text-foreground">
            {title}
          </CardTitle>
          <CardDescription className="text-secondary-text max-w-xl">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-md border border-border-dark bg-ink/50 text-xs font-mono text-secondary-text">
            ✓ Shell da aplicação, Header, Footer e Roteador ativos.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
