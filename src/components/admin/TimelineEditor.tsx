import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Trash2, GripVertical } from "lucide-react";

interface TimelineItem {
  title: string;
  company: string;
  period: string;
  description: string;
}

function ItemEditor({ items, setItems, label }: { items: TimelineItem[]; setItems: (v: TimelineItem[]) => void; label: string }) {
  const add = () => setItems([...items, { title: "", company: "", period: "", description: "" }]);
  const remove = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const update = (i: number, field: keyof TimelineItem, val: string) => {
    const updated = [...items];
    updated[i] = { ...updated[i], [field]: val };
    setItems(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-foreground">{label}</h3>
        <Button variant="outline" size="sm" onClick={add} className="gap-1"><Plus size={14} /> Add</Button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="border border-border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground"><GripVertical size={14} /> <span className="text-sm font-medium">#{i + 1}</span></div>
            <Button variant="ghost" size="icon" onClick={() => remove(i)} className="text-destructive"><Trash2 size={16} /></Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">{label === "Experience" ? "Position" : "Degree"}</Label>
              <Input value={item.title} onChange={(e) => update(i, "title", e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">{label === "Experience" ? "Company" : "Institution"}</Label>
              <Input value={item.company} onChange={(e) => update(i, "company", e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Period</Label>
              <Input value={item.period} onChange={(e) => update(i, "period", e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Description</Label>
            <Textarea value={item.description} onChange={(e) => update(i, "description", e.target.value)} rows={2} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TimelineEditor() {
  const [experience, setExperience] = useState<TimelineItem[]>([]);
  const [education, setEducation] = useState<TimelineItem[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_content").select("*").in("section", ["experience", "education"]);
      if (data) {
        for (const row of data) {
          if (row.section === "experience" && row.key === "items") setExperience(row.value as unknown as TimelineItem[]);
          if (row.section === "education" && row.key === "items") setEducation(row.value as unknown as TimelineItem[]);
        }
      }
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    const now = new Date().toISOString();
    const [r1, r2] = await Promise.all([
      supabase.from("site_content").update({ value: experience as any, updated_at: now }).eq("section", "experience").eq("key", "items"),
      supabase.from("site_content").update({ value: education as any, updated_at: now }).eq("section", "education").eq("key", "items"),
    ]);
    if (r1.error || r2.error) toast.error("Failed to save");
    else toast.success("Timeline saved");
    setSaving(false);
  };

  return (
    <div className="space-y-8">
      <div className="glass rounded-xl p-6">
        <ItemEditor items={experience} setItems={setExperience} label="Experience" />
      </div>
      <div className="glass rounded-xl p-6">
        <ItemEditor items={education} setItems={setEducation} label="Education" />
      </div>
      <Button onClick={save} disabled={saving} className="w-full">{saving ? "Saving..." : "Save All Changes"}</Button>
    </div>
  );
}
