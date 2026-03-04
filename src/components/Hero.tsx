import { motion } from "framer-motion";
import { Github, Linkedin, MapPin } from "lucide-react";
import biseshImg from "@/assets/bisesh.jpg";

export function Hero() {
  return (
    <section id="about" className="min-h-screen flex items-center pt-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex-shrink-0"
          >
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden glass p-1">
              <img
                src={biseshImg}
                alt="Bishesh Nakarmi"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center md:text-left"
          >
            <p className="text-primary font-medium mb-2">Hello, I'm</p>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-3">
              Bishesh Nakarmi
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-display mb-4">
              Frontend Developer
            </p>
            <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground mb-6">
              <MapPin size={16} />
              <span className="text-sm">Kathmandu, Nepal</span>
            </div>
            <p className="text-muted-foreground max-w-lg mb-8 leading-relaxed">
              Passionate frontend developer with 3+ years of experience building modern web applications
              using React, JavaScript, and cutting-edge technologies. Currently working at NEPA Works.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4">
              <a
                href="https://github.com/Bisesh-n"
                target="_blank"
                rel="noopener noreferrer"
                className="glass rounded-full p-3 hover:bg-secondary transition-colors"
              >
                <Github size={20} className="text-foreground" />
              </a>
              <a
                href="https://www.linkedin.com/in/bisesh-nakarmi/"
                target="_blank"
                rel="noopener noreferrer"
                className="glass rounded-full p-3 hover:bg-secondary transition-colors"
              >
                <Linkedin size={20} className="text-foreground" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
