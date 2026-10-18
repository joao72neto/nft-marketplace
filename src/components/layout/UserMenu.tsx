import React, { useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/features/auth";
import { LogoutIcon } from "@/components/icons";

export const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative font-mono" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 h-10 px-2.5 rounded-md border border-border-dark bg-surface-card hover:border-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Menu do usuário"
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-7 h-7 rounded-full object-cover border border-primary/50"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/60 text-primary flex items-center justify-center text-xs font-bold">
            {initials}
          </div>
        )}
        <span className="text-xs font-bold text-foreground max-w-[120px] truncate">
          {user.name}
        </span>
        <span className="text-[10px] text-secondary-text">▼</span>
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 rounded-lg border border-border-dark bg-surface-card p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="px-3 py-2 border-b border-border-dark">
            <p className="text-xs font-bold text-foreground truncate">
              {user.name}
            </p>
            <p className="text-[11px] text-secondary-text truncate">
              {user.email}
            </p>
          </div>

          <div className="py-1">
            <Link
              to="/perfil"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-3 py-2 text-xs text-foreground hover:text-accent hover:bg-surface-raised rounded transition-colors"
            >
              Meu Perfil
            </Link>

            <Link
              to="/carteiras"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-3 py-2 text-xs text-foreground hover:text-accent hover:bg-surface-raised rounded transition-colors"
            >
              Minhas Carteiras
            </Link>
          </div>

          <div className="pt-1 border-t border-border-dark">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-coral hover:bg-coral/10 rounded transition-colors text-left"
            >
              <LogoutIcon size={14} />
              <span>Sair da conta</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
