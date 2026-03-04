import { motion } from "framer-motion";
import { Github, Linkedin, MapPin, Twitter, Globe } from "lucide-react";
import biseshImg from "@/assets/bisesh.jpg";
import { useSiteContent } from "@/hooks/useSiteContent";

const iconMap: Record<string, React.ReactNode> = {
  github: <Github size={20} className="text-foreground" />,
  linkedin: <Linkedin size={20} className="text-foreground" />,
  twitter: <Twitter size={20} className="text-foreground" />,
  globe: <Globe size={20} className="text-foreground" />,
};

interface Profile {
  name: string;
  title: string;
  location: string;
  description: string;
}

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

const defaultProfile: Profile = {
  name: "Bishesh Nakarmi",
  title: "Frontend Developer",
  location: "Kathmandu, Nepal",
  description: "Passionate frontend developer with 3+ years of experience building modern web applications using React, JavaScript, and cutting-edge technologies. Currently working at NEPA Works.",
};

const defaultLinks: SocialLink[] = [
  { platform: "GitHub", url: "https://github.com/Bisesh-n", icon: "github" },
  { platform: "LinkedIn", url: "https://www.linkedin.com/in/bisesh-nakarmi/", icon: "linkedin" },
];

export function Hero() {
  const profile = useSiteContent<Profile>("about", "profile", defaultProfile);
  const socialLinks = useSiteContent<SocialLink[]>("about", "social_links", defaultLinks);
  const imageData = useSiteContent<{ url?: string }>("about", "image_url", {});
  const imgSrc = imageData?.url || biseshImg;

  return (
    <section id="about" className="min-h-screen flex items-center pt-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex-shrink-0"
          >
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden glass p-1">
              <img src={imgSrc} alt={profile.name} className="w-full h-full object-cover rounded-xl" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center md:text-left"
          >
            <p className="text-primary font-medium mb-2">Hello, I'm</p>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-3">{profile.name}</h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-display mb-4">{profile.title}</p>
            <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground mb-6">
              <MapPin size={16} />
              <span className="text-sm">{profile.location}</span>
            </div>
            <p className="text-muted-foreground max-w-lg mb-8 leading-relaxed">{profile.description}</p>
            <div className="flex items-center justify-center md:justify-start gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass rounded-full p-3 hover:bg-secondary transition-colors"
                  title={link.platform}
                >
                  {iconMap[link.icon.toLowerCase()] || <Globe size={20} className="text-foreground" />}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
