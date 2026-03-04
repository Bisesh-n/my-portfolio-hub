import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Trash2, Upload } from "lucide-react";

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

export function AboutEditor() {
  const [profile, setProfile] = useState<Profile>({ name: "", title: "", location: "", description: "" });
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data } = await supabase.from("site_content").select("*").eq("section", "about");
    if (data) {
      for (const row of data) {
        if (row.key === "profile") setProfile(row.value as unknown as Profile);
        if (row.key === "social_links") setSocialLinks(row.value as unknown as SocialLink[]);
        if (row.key === "image_url") setImageUrl((row.value as any)?.url || null);
      }
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("site_content")
      .update({ value: profile as any, updated_at: new Date().toISOString() })
      .eq("section", "about")
      .eq("key", "profile");
    if (error) toast.error("Failed to save profile");
    else toast.success("Profile saved");
    setSaving(false);
  };

  const saveSocialLinks = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("site_content")
      .update({ value: socialLinks as any, updated_at: new Date().toISOString() })
      .eq("section", "about")
      .eq("key", "social_links");
    if (error) toast.error("Failed to save social links");
    else toast.success("Social links saved");
    setSaving(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `profile.${ext}`;

    await supabase.storage.from("site-assets").remove([path]);
    const { error } = await supabase.storage.from("site-assets").upload(path, file, { upsert: true });
    if (error) {
      toast.error("Upload failed: " + error.message);
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("site-assets").getPublicUrl(path);
    const url = urlData.publicUrl;
    setImageUrl(url);

    // Upsert image_url in site_content
    const { data: existing } = await supabase.from("site_content").select("id").eq("section", "about").eq("key", "image_url").maybeSingle();
    if (existing) {
      await supabase.from("site_content").update({ value: { url } as any, updated_at: new Date().toISOString() }).eq("id", existing.id);
    } else {
      await supabase.from("site_content").insert({ section: "about", key: "image_url", value: { url } as any });
    }
    toast.success("Image uploaded");
    setUploading(false);
  };

  const addLink = () => setSocialLinks([...socialLinks, { platform: "", url: "", icon: "" }]);
  const removeLink = (i: number) => setSocialLinks(socialLinks.filter((_, idx) => idx !== i));
  const updateLink = (i: number, field: keyof SocialLink, val: string) => {
    const updated = [...socialLinks];
    updated[i] = { ...updated[i], [field]: val };
    setSocialLinks(updated);
  };

  return (
    <div className="space-y-8">
      {/* Profile Image */}
      <div className="glass rounded-xl p-6 space-y-4">
        <h3 className="font-display text-lg font-semibold text-foreground">Profile Image</h3>
        {imageUrl && <img src={imageUrl} alt="Profile" className="w-32 h-32 rounded-xl object-cover" />}
        <div>
          <Label htmlFor="profile-image" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-foreground hover:bg-secondary/80 transition-colors">
            <Upload size={16} /> {uploading ? "Uploading..." : "Upload New Image"}
          </Label>
          <input id="profile-image" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
        </div>
      </div>

      {/* Profile Info */}
      <div className="glass rounded-xl p-6 space-y-4">
        <h3 className="font-display text-lg font-semibold text-foreground">Profile Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={profile.title} onChange={(e) => setProfile({ ...profile, title: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea value={profile.description} onChange={(e) => setProfile({ ...profile, description: e.target.value })} rows={3} />
        </div>
        <Button onClick={saveProfile} disabled={saving}>{saving ? "Saving..." : "Save Profile"}</Button>
      </div>

      {/* Social Links */}
      <div className="glass rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-foreground">Social Links</h3>
          <Button variant="outline" size="sm" onClick={addLink} className="gap-1"><Plus size={14} /> Add Link</Button>
        </div>
        {socialLinks.map((link, i) => (
          <div key={i} className="flex items-end gap-3">
            <div className="space-y-1 flex-1">
              <Label className="text-xs">Platform</Label>
              <Input value={link.platform} onChange={(e) => updateLink(i, "platform", e.target.value)} placeholder="GitHub" />
            </div>
            <div className="space-y-1 flex-1">
              <Label className="text-xs">URL</Label>
              <Input value={link.url} onChange={(e) => updateLink(i, "url", e.target.value)} placeholder="https://..." />
            </div>
            <div className="space-y-1 w-28">
              <Label className="text-xs">Icon</Label>
              <Input value={link.icon} onChange={(e) => updateLink(i, "icon", e.target.value)} placeholder="github" />
            </div>
            <Button variant="ghost" size="icon" onClick={() => removeLink(i)} className="text-destructive shrink-0"><Trash2 size={16} /></Button>
          </div>
        ))}
        <Button onClick={saveSocialLinks} disabled={saving}>{saving ? "Saving..." : "Save Social Links"}</Button>
      </div>
    </div>
  );
}
