import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useSiteContent<T>(section: string, key: string, fallback: T): T {
  const [value, setValue] = useState<T>(fallback);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("site_content")
        .select("value")
        .eq("section", section)
        .eq("key", key)
        .maybeSingle();
      if (data?.value != null) setValue(data.value as T);
    })();
  }, [section, key]);

  return value;
}
