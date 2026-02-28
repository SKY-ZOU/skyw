'use client';

import { createContext, useContext, type ReactNode } from 'react';

export interface DivisionItem {
  divisionId: string;
  slug: string;
  icon: string;
  titleZhCN: string;
  titleZhTW: string;
  titleEn: string;
  shortDescZhCN: string;
  shortDescZhTW: string;
  shortDescEn: string;
}

interface SiteData {
  divisions: DivisionItem[];
}

const SiteDataContext = createContext<SiteData>({ divisions: [] });

export function SiteDataProvider({
  divisions,
  children,
}: {
  divisions: DivisionItem[];
  children: ReactNode;
}) {
  return (
    <SiteDataContext.Provider value={{ divisions }}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  return useContext(SiteDataContext);
}
