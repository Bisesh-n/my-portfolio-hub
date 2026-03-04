import { motion } from "framer-motion";
import { Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export function ResumeSection() {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    // TODO: Upload to Supabase Storage once connected
    setTimeout(() => {
      toast.success("Resume uploaded successfully! (Supabase not connected yet)");
      setUploading(false);
    }, 1000);
  };

  return (
    <section id="resume" className="py-24">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-3xl md:text-4xl font-bold text-foreground mb-16 text-center"
        >
          Resume
        </motion.h2>

        <div className="max-w-2xl mx-auto grid gap-8 md:grid-cols-2">
          {/* Download resume */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-xl p-8 text-center"
          >
            <Download size={32} className="mx-auto text-primary mb-4" />
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">My Resume</h3>
            <p className="text-sm text-muted-foreground mb-6">Download my latest resume</p>
            <Button asChild className="rounded-xl">
              <a href="/Bishesh_Nakarmi_Resume.pdf" download>
                Download PDF
              </a>
            </Button>
          </motion.div>

          {/* Upload resume */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass rounded-xl p-8 text-center"
          >
            <Upload size={32} className="mx-auto text-accent mb-4" />
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">Share Your Resume</h3>
            <p className="text-sm text-muted-foreground mb-6">Upload your resume (PDF, max 5MB)</p>
            <label className="cursor-pointer">
              <Button variant="outline" className="rounded-xl pointer-events-none" disabled={uploading}>
                {uploading ? "Uploading..." : "Choose File"}
              </Button>
              <Input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleUpload}
                disabled={uploading}
              />
            </label>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
