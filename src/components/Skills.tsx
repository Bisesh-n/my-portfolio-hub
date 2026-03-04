import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useSiteContent } from "@/hooks/useSiteContent";

const defaultTechnical = [
  "React", "JavaScript", "TypeScript", "Python", "PHP", "HTML5", "CSS3",
  "Tailwind CSS", "Bootstrap", "jQuery", "Node.js", "MongoDB", "PostgreSQL",
  "MySQL", "Git", "GitHub", "REST APIs", "Firebase", "Redux", "Next.js",
];

const defaultSoft = [
  "Problem Solving", "Team Collaboration", "Communication",
  "Time Management", "Adaptability", "Leadership",
];

export function Skills() {
  const technicalSkills = useSiteContent<string[]>("skills", "technical", defaultTechnical);
  const softSkills = useSiteContent<string[]>("skills", "soft", defaultSoft);

  return (
    <section id="skills" className="py-24">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-3xl md:text-4xl font-bold text-foreground mb-16 text-center"
        >
          Skills
        </motion.h2>

        <div className="max-w-3xl mx-auto space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-xl p-6"
          >
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">Technical</h3>
            <div className="flex flex-wrap gap-2">
              {technicalSkills.map((skill) => (
                <Badge key={skill} variant="secondary" className="rounded-lg px-3 py-1 text-sm font-normal">{skill}</Badge>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-xl p-6"
          >
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">Soft Skills</h3>
            <div className="flex flex-wrap gap-2">
              {softSkills.map((skill) => (
                <Badge key={skill} variant="outline" className="rounded-lg px-3 py-1 text-sm font-normal">{skill}</Badge>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
