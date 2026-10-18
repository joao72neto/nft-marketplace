import React, { useEffect } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useAuthModal } from "@/features/auth";

export const LoginRedirect: React.FC = () => {
  const { openLoginModal } = useAuthModal();
  const navigate = useNavigate();
  const search = useSearch({ from: "/login" });

  useEffect(() => {
    openLoginModal(search.redirect);
    const target = search.redirect ? decodeURIComponent(search.redirect) : "/";
    navigate({ to: target as "/" });
  }, [openLoginModal, navigate, search.redirect]);

  return null;
};
