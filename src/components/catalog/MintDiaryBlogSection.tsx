import React from "react";
import { Link } from "@tanstack/react-router";

interface BlogPost {
  id: string;
  image: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
}

const POSTS: BlogPost[] = [
  {
    id: "post-1",
    image: "/assets/blog/blog-1.png",
    date: "12 de setembro",
    readTime: "Leitura de 6 min",
    title: "Como funciona a propriedade de NFTs",
    excerpt: "Aprenda a colecionar, negociar e verificar ativos digitais.",
  },
  {
    id: "post-2",
    image: "/assets/blog/blog-2.png",
    date: "13 de setembro",
    readTime: "Leitura de 2 min",
    title: "10 artistas digitais para acompanhar",
    excerpt: "Conheça criadores que moldam a cultura digital.",
  },
  {
    id: "post-3",
    image: "/assets/blog/blog-3.png",
    date: "15 de setembro",
    readTime: "Leitura de 3 min",
    title: "Raridade, atributos e procedência",
    excerpt: "Entenda raridade, procedência, direitos autorais e utilidade.",
  },
  {
    id: "post-4",
    image: "/assets/blog/blog-4.png",
    date: "15 de setembro",
    readTime: "Leitura de 2 min",
    title: "Como proteger sua carteira",
    excerpt: "Proteja sua carteira, seus ativos e sua identidade.",
  },
];

export const MintDiaryBlogSection: React.FC = () => {
  return (
    <section
      aria-label="Diário da Cunhagem"
      className="py-12 lg:py-16 font-mono text-left"
    >
      <div className="container max-w-300 mx-auto px-4 lg:px-0">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-2xl sm:text-[28px] font-bold text-foreground">
            Diário da Cunhagem
          </h2>
          <p className="text-xs sm:text-sm text-secondary-text max-w-xl mx-auto">
            Histórias, guias e insights para colecionadores sobre o universo da
            propriedade digital.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {POSTS.map((post) => (
            <article
              key={post.id}
              className="flex flex-col font-mono text-left group"
            >
              <div className="w-full rounded-xl overflow-hidden bg-surface-card mb-3">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              <p className="text-[12px] text-secondary-text">
                {post.date} &nbsp;|&nbsp; {post.readTime}
              </p>

              <h3 className="mt-2 text-[16px] font-bold text-foreground leading-snug group-hover:text-accent transition-colors">
                {post.title}
              </h3>

              <p className="mt-2 text-xs text-secondary-text leading-relaxed flex-1">
                {post.excerpt}
              </p>

              <div className="mt-4">
                <Link
                  to="/aprenda"
                  className="text-xs text-accent font-bold hover:underline inline-flex items-center gap-1"
                >
                  <span>Ler mais</span>
                  <span>→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
