import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ForgotPasswordDialog: React.FC<ForgotPasswordDialogProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border-soft bg-surface-card text-foreground">
        <DialogHeader className="space-y-2 text-left">
          <DialogTitle className="text-xl font-bold text-accent">
            Recuperação de Acesso
          </DialogTitle>
          <DialogDescription className="text-sm text-secondary-text leading-relaxed">
            O marketplace GreenMint opera em um ambiente 100% simulado com Mock
            Service Worker. Não enviamos e-mails reais de redefinição de senha.
          </DialogDescription>
        </DialogHeader>

        <div className="my-2 rounded-md border border-border-dark bg-ink p-4 space-y-3 text-xs font-mono">
          <p className="font-bold text-foreground">
            Credenciais de Teste Disponíveis:
          </p>
          <div className="space-y-1 text-secondary-text">
            <div>
              <span className="text-primary font-bold">Alice Vance:</span>{" "}
              alice@greenmint.io
            </div>
            <div>
              <span className="text-foreground">Senha:</span> Senha123!
            </div>
          </div>
          <div className="space-y-1 text-secondary-text pt-1 border-t border-border-dark">
            <div>
              <span className="text-primary font-bold">Bob Martinez:</span>{" "}
              bob@greenmint.io
            </div>
            <div>
              <span className="text-foreground">Senha:</span> Senha456!
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-end">
          <Button
            type="button"
            variant="primary"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Entendido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
