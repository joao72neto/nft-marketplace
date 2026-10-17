import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center font-mono transition-colors select-none",
  {
    variants: {
      variant: {
        default:
          "border border-border-dark bg-surface-dark px-2.5 py-0.5 text-xs text-foreground rounded-full",
        counter:
          "h-4 min-w-4 px-1 rounded-full bg-primary text-ink text-[10px] font-bold leading-none",
        edition:
          "border border-border-soft bg-surface-raised px-2.5 py-1 text-xs text-accent rounded-full font-medium",
        status:
          "border border-primary/40 bg-primary/10 px-2 py-0.5 text-[11px] text-accent rounded font-bold uppercase tracking-wider",
        outline:
          "border border-border-dark text-secondary-text px-2 py-0.5 text-xs rounded",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
