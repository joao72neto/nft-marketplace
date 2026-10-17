import { Outlet } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-ink text-foreground selection:bg-primary selection:text-ink">
      <Header cartCount={0} />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
