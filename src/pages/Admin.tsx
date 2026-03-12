import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LogOut, Mail, FileText, Settings, User, Briefcase, Zap } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AboutEditor } from "@/components/admin/AboutEditor";
import { TimelineEditor } from "@/components/admin/TimelineEditor";
import { SkillsEditor } from "@/components/admin/SkillsEditor";
import type { Session } from "@supabase/supabase-js";

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSigningIn(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) toast.error(error.message);
    setSigningIn(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-foreground">Loading...</div>;

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <form onSubmit={handleLogin} className="glass rounded-xl p-8 w-full max-w-sm space-y-4">
          <h1 className="font-display text-2xl font-bold text-foreground text-center">Admin Login</h1>
          <div className="space-y-2">
            <Label htmlFor="admin-email">Email</Label>
            <Input id="admin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input id="admin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" disabled={signingIn} className="w-full">{signingIn ? "Signing in..." : "Sign In"}</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut size={16} /> Logout
          </Button>
        </div>

        <Tabs defaultValue="messages">
          <TabsList className="mb-6 flex-wrap h-auto gap-1">
            <TabsTrigger value="messages" className="gap-2"><Mail size={14} /> Messages </TabsTrigger>
            <TabsTrigger value="resumes" className="gap-2"><FileText size={14} /> Resumes</TabsTrigger>
            <TabsTrigger value="about" className="gap-2"><User size={14} /> About</TabsTrigger>
            <TabsTrigger value="timeline" className="gap-2"><Briefcase size={14} /> Experience & Education</TabsTrigger>
            <TabsTrigger value="skills" className="gap-2"><Zap size={14} /> Skills</TabsTrigger>
          </TabsList>

          <TabsContent value="messages"><MessagesTab /></TabsContent>
          <TabsContent value="resumes"><ResumesTab /></TabsContent>
          <TabsContent value="about"><AboutEditor /></TabsContent>
          <TabsContent value="timeline"><TimelineEditor /></TabsContent>
          <TabsContent value="skills"><SkillsEditor /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function MessagesTab() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("messages" as any).select("*").order("created_at", { ascending: false });
      if (error) toast.error("Failed to load messages");
      else setMessages((data as any[]) || []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <p className="text-muted-foreground">Loading messages...</p>;
  if (!messages.length) return <p className="text-muted-foreground">No messages yet.</p>;

  return (
    <div className="glass rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((m: any) => (
            <TableRow key={m.id}>
              <TableCell className="font-medium">{m.name}</TableCell>
              <TableCell>{m.email}</TableCell>
              <TableCell className="max-w-xs truncate">{m.message}</TableCell>
              <TableCell className="text-muted-foreground text-sm">{new Date(m.created_at).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ResumesTab() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.storage.from("resumes").list("", { limit: 100, sortBy: { column: "created_at", order: "desc" } });
      if (error) toast.error("Failed to load resumes");
      else setFiles(data || []);
      setLoading(false);
    })();
  }, []);

  const getUrl = (name: string) => {
    const { data } = supabase.storage.from("resumes").getPublicUrl(name);
    return data.publicUrl;
  };

  if (loading) return <p className="text-muted-foreground">Loading resumes...</p>;
  if (!files.length) return <p className="text-muted-foreground">No resumes uploaded yet.</p>;

  return (
    <div className="glass rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>File Name</TableHead>
            <TableHead>Uploaded</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((f) => (
            <TableRow key={f.name}>
              <TableCell className="font-medium">{f.name}</TableCell>
              <TableCell className="text-muted-foreground text-sm">{new Date(f.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" asChild>
                  <a href={getUrl(f.name)} target="_blank" rel="noopener noreferrer">Download</a>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

