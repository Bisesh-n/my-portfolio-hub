import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Basic English word check - at least 80% of words should match common patterns
const isLikelyEnglish = (text: string): boolean => {
  const words = text.trim().split(/\s+/);
  const englishPattern = /^[a-zA-Z'-]+$/;
  const englishWords = words.filter((w) => englishPattern.test(w));
  return englishWords.length / words.length >= 0.8;
};

// Check for vulgar/spam content
const vulgarWords = ["fuck", "shit", "ass", "damn", "bitch", "dick", "bastard", "crap"];
const containsVulgar = (text: string): boolean => {
  const lower = text.toLowerCase();
  return vulgarWords.some((w) => lower.includes(w));
};

// Check for nonsensical patterns (repeated chars, random strings)
const isNonsensical = (text: string): boolean => {
  const words = text.trim().split(/\s+/);
  const nonsense = words.filter((w) => /(.)\1{3,}/.test(w) || (/^[^aeiouAEIOU]+$/.test(w) && w.length > 4));
  return nonsense.length / words.length > 0.3;
};

export function Contact() {
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, email, message } = form;

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("All fields are required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    const wordCount = message.trim().split(/\s+/).length;
    if (wordCount < 5) {
      toast.error("Message must be at least 5 words long");
      return;
    }

    if (!isLikelyEnglish(message)) {
      toast.error("Please write your message in English");
      return;
    }

    if (containsVulgar(message)) {
      toast.error("Please keep your message professional");
      return;
    }

    if (isNonsensical(message)) {
      toast.error("Your message appears to contain nonsensical text");
      return;
    }

    setSending(true);
    try {
      // Save to Supabase
      const { error } = await supabase
        .from("messages" as any)
        .insert([{ name: name.trim(), email: email.trim(), message: message.trim() }]);

      if (error) throw error;

      // Send email notification
      const { error: fnError } = await supabase.functions.invoke("send-contact-email", {
        body: { name: name.trim(), email: email.trim(), message: message.trim() },
      });

      if (fnError) {
        console.warn("Email notification failed, but message was saved:", fnError);
      }

      toast.success("Message sent successfully!");
      setForm({ name: "", email: "", message: "" });
    } catch (err: any) {
      console.error("Error sending message:", err);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="py-24">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-3xl md:text-4xl font-bold text-foreground mb-16 text-center"
        >
          Get In Touch
        </motion.h2>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto glass rounded-xl p-8 space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="rounded-lg"
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="rounded-lg"
              maxLength={255}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Write your message here (min. 5 words, English only)"
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              className="rounded-lg min-h-[120px]"
              maxLength={1000}
            />
          </div>
          <Button type="submit" disabled={sending} className="w-full rounded-xl gap-2">
            <Send size={16} />
            {sending ? "Sending..." : "Send Message"}
          </Button>
        </motion.form>
      </div>
    </section>
  );
}
