import { motion } from "framer-motion";
import { Briefcase, GraduationCap } from "lucide-react";

const experiences = [
  {
    type: "work" as const,
    title: "Developer",
    company: "NEPA Works",
    period: "Current",
    description: "Working on modern web applications and contributing to full-stack development projects.",
  },
  {
    type: "work" as const,
    title: "Frontend Developer",
    company: "VoxCrow Pvt. Ltd.",
    period: "Apr 2020 – Jun 2023",
    description: "Built and maintained responsive web applications using React, JavaScript, and modern frontend tooling.",
  },
  {
    type: "work" as const,
    title: "SEO Intern",
    company: "BlendWit International",
    period: "Sep 2019 – Jan 2020",
    description: "Assisted in SEO strategy, keyword research, and on-page optimization for client websites.",
  },
];

const education = [
  {
    type: "education" as const,
    title: "MSc. IT",
    company: "Islington College",
    period: "2023 – Present",
    description: "Master of Science in Information Technology.",
  },
  {
    type: "education" as const,
    title: "BSc. CSIT",
    company: "Academia International College",
    period: "2016 – 2021",
    description: "Bachelor of Science in Computer Science and Information Technology.",
  },
  {
    type: "education" as const,
    title: "+2 Science",
    company: "Kathmandu Model Secondary School",
    period: "2014 – 2016",
    description: "Higher secondary education in Science.",
  },
];

const allItems = [...experiences, ...education];

export function Timeline() {
  return (
    <section id="experience" className="py-24">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-3xl md:text-4xl font-bold text-foreground mb-16 text-center"
        >
          Experience & Education
        </motion.h2>

        <div className="relative max-w-3xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

          {allItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative flex items-start mb-12 ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Icon dot */}
              <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full glass flex items-center justify-center z-10 border border-border">
                {item.type === "work" ? (
                  <Briefcase size={16} className="text-primary" />
                ) : (
                  <GraduationCap size={16} className="text-accent" />
                )}
              </div>

              {/* Card */}
              <div
                className={`ml-16 md:ml-0 md:w-[calc(50%-2rem)] glass rounded-xl p-5 ${
                  index % 2 === 0 ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"
                }`}
              >
                <span className="text-xs font-medium text-primary">{item.period}</span>
                <h3 className="font-display text-lg font-semibold text-foreground mt-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground font-medium">{item.company}</p>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
