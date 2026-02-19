'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';

interface SiteContentContextType {
  content: Record<string, string>;
  loading: boolean;
}

const SiteContentContext = createContext<SiteContentContextType>({
  content: {},
  loading: true,
});

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from('site_content').select('key, value');
      if (data) {
        const map: Record<string, string> = {};
        data.forEach((row: { key: string; value: string }) => {
          map[row.key] = row.value;
        });
        setContent(map);
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <SiteContentContext.Provider value={{ content, loading }}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent(key: string, defaultValue: string): string {
  const { content } = useContext(SiteContentContext);
  return content[key] ?? defaultValue;
}

export function useSiteContentJSON<T>(key: string, defaultValue: T): T {
  const { content } = useContext(SiteContentContext);
  const raw = content[key];
  if (!raw) return defaultValue;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

export function useSectionVisible(sectionKey: string): boolean {
  const { content } = useContext(SiteContentContext);
  const val = content[`section_visible_${sectionKey}`];
  return val !== 'false';
}
