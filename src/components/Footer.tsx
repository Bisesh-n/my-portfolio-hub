import { Github, Linkedin } from "lucide-react";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-6"
        >
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Bisesh-n"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/bisesh-nakarmi/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Linkedin size={20} />
            </a>
          </div>

          <p className="text-sm text-muted-foreground">
            Made by Bishesh Nakarmi
          </p>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
