import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";

function SkillList({ title, skills, setSkills, variant }: { title: string; skills: string[]; setSkills: (v: string[]) => void; variant: "secondary" | "outline" }) {
  const [newSkill, setNewSkill] = useState("");

  const add = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkill("");
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <Badge key={skill} variant={variant} className="rounded-lg px-3 py-1 text-sm gap-1">
            {skill}
            <button onClick={() => setSkills(skills.filter((s) => s !== skill))} className="ml-1 hover:text-destructive">
              <X size={12} />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Add a skill..." onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())} />
        <Button variant="outline" size="sm" onClick={add} className="gap-1 shrink-0"><Plus size={14} /> Add</Button>
      </div>
    </div>
  );
}

export function SkillsEditor() {
  const [technical, setTechnical] = useState<string[]>([]);
  const [soft, setSoft] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_content").select("*").eq("section", "skills");
      if (data) {
        for (const row of data) {
          if (row.key === "technical") setTechnical(row.value as unknown as string[]);
          if (row.key === "soft") setSoft(row.value as unknown as string[]);
        }
      }
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    const now = new Date().toISOString();
    const [r1, r2] = await Promise.all([
      supabase.from("site_content").update({ value: technical as any, updated_at: now }).eq("section", "skills").eq("key", "technical"),
      supabase.from("site_content").update({ value: soft as any, updated_at: now }).eq("section", "skills").eq("key", "soft"),
    ]);
    if (r1.error || r2.error) toast.error("Failed to save");
    else toast.success("Skills saved");
    setSaving(false);
  };

  return (
    <div className="space-y-8">
      <div className="glass rounded-xl p-6">
        <SkillList title="Technical Skills" skills={technical} setSkills={setTechnical} variant="secondary" />
      </div>
      <div className="glass rounded-xl p-6">
        <SkillList title="Soft Skills" skills={soft} setSkills={setSoft} variant="outline" />
      </div>
      <Button onClick={save} disabled={saving} className="w-full">{saving ? "Saving..." : "Save Skills"}</Button>
    </div>
  );
}
