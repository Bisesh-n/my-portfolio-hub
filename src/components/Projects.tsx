import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ExternalLink, Star, GitFork } from "lucide-react";

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
}

async function fetchRepos(): Promise<GitHubRepo[]> {
  const res = await fetch("https://api.github.com/users/Bisesh-n/repos?sort=updated&per_page=12");
  if (!res.ok) throw new Error("Failed to fetch repos");
  return res.json();
}

const langColors: Record<string, string> = {
  JavaScript: "bg-yellow-400",
  TypeScript: "bg-blue-500",
  Python: "bg-green-500",
  PHP: "bg-purple-500",
  HTML: "bg-orange-500",
  CSS: "bg-pink-500",
};

export function Projects() {
  const { data: repos, isLoading } = useQuery({ queryKey: ["github-repos"], queryFn: fetchRepos });

  return (
    <section id="projects" className="py-24">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-3xl md:text-4xl font-bold text-foreground mb-16 text-center"
        >
          Projects
        </motion.h2>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass rounded-xl p-5 h-40 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {repos?.map((repo, index) => (
              <motion.a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="glass rounded-xl p-5 hover:border-primary/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors truncate pr-2">
                    {repo.name}
                  </h3>
                  <ExternalLink size={16} className="text-muted-foreground flex-shrink-0 mt-1" />
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {repo.description || "No description"}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {repo.language && (
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${langColors[repo.language] || "bg-muted-foreground"}`} />
                      {repo.language}
                    </span>
                  )}
                  {repo.stargazers_count > 0 && (
                    <span className="flex items-center gap-1">
                      <Star size={12} /> {repo.stargazers_count}
                    </span>
                  )}
                  {repo.forks_count > 0 && (
                    <span className="flex items-center gap-1">
                      <GitFork size={12} /> {repo.forks_count}
                    </span>
                  )}
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
