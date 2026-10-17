import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <Card className="max-w-md w-full text-center border-border-dark bg-surface-card">
        <CardHeader className="space-y-4">
          <span className="font-mono text-5xl md:text-6xl font-bold text-primary tracking-widest">
            404
          </span>
          <CardTitle className="text-xl md:text-2xl text-foreground">
            Obra digital ou página não encontrada
          </CardTitle>
          <CardDescription className="text-sm text-secondary-text">
            O endereço que você tentou acessar não existe, foi movido ou o item
            não está mais disponível no marketplace.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <Button asChild variant="primary" size="lg" className="w-full">
            <Link to="/">Voltar para o Início</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
