// lib/db.ts
import { getRequestContext } from "@cloudflare/next-on-pages";

export interface HeroData {
  id: number;
  name: string;
  tagline: string;
  typing_words: string;
  cta1_text: string;
  cta1_link: string;
  cta2_text: string;
  cta2_link: string;
}

export interface AboutRow {
  id: number;
  paragraph: string;
  sort_order: number;
  visible: number;
}

export interface ExperienceRow {
  id: number;
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  sort_order: number;
  visible: number;
}

export interface CertRow {
  id: number;
  name: string;
  issuer: string;
  icon: string;
  sort_order: number;
  visible: number;
}

export interface AchievementRow {
  id: number;
  icon: string;
  title: string;
  event: string;
  date: string;
  sort_order: number;
  visible: number;
}

export interface WordRow {
  id: number;
  word: string;
  color_type: string;
  sort_order: number;
  visible: number;
}

export interface ContactRow {
  id: number;
  label: string;
  href: string;
  sort_order: number;
  visible: number;
}

export interface ThemeRow {
  id: number;
  accent_dark: string;
  accent_light: string;
  bg_dark: string;
  bg_light: string;
  fg_dark: string;
  fg_light: string;
}

function getDB(): D1Database | null {
  try {
    const ctx = getRequestContext();
    return (ctx.env as { DB?: D1Database }).DB ?? null;
  } catch {
    return null;
  }
}

export async function getHero(): Promise<HeroData | null> {
  const db = getDB();
  if (!db) return null;
  try {
    return await db.prepare("SELECT * FROM hero WHERE id = 1").first<HeroData>();
  } catch { return null; }
}

export async function getAbout(): Promise<AboutRow[]> {
  const db = getDB();
  if (!db) return [];
  try {
    const { results } = await db.prepare("SELECT * FROM about WHERE visible = 1 ORDER BY sort_order").all<AboutRow>();
    return results;
  } catch { return []; }
}

export async function getExperience(): Promise<ExperienceRow[]> {
  const db = getDB();
  if (!db) return [];
  try {
    const { results } = await db.prepare("SELECT * FROM experience WHERE visible = 1 ORDER BY sort_order").all<ExperienceRow>();
    return results;
  } catch { return []; }
}

export async function getCertifications(): Promise<CertRow[]> {
  const db = getDB();
  if (!db) return [];
  try {
    const { results } = await db.prepare("SELECT * FROM certifications WHERE visible = 1 ORDER BY sort_order").all<CertRow>();
    return results;
  } catch { return []; }
}

export async function getAchievements(): Promise<AchievementRow[]> {
  const db = getDB();
  if (!db) return [];
  try {
    const { results } = await db.prepare("SELECT * FROM achievements WHERE visible = 1 ORDER BY sort_order").all<AchievementRow>();
    return results;
  } catch { return []; }
}

export async function getWordScroll(): Promise<WordRow[]> {
  const db = getDB();
  if (!db) return [];
  try {
    const { results } = await db.prepare("SELECT * FROM word_scroll WHERE visible = 1 ORDER BY sort_order").all<WordRow>();
    return results;
  } catch { return []; }
}

export async function getContactLinks(): Promise<ContactRow[]> {
  const db = getDB();
  if (!db) return [];
  try {
    const { results } = await db.prepare("SELECT * FROM contact_links ORDER BY sort_order").all<ContactRow>();
    return results;
  } catch { return []; }
}

export async function getTheme(): Promise<ThemeRow | null> {
  const db = getDB();
  if (!db) return null;
  try {
    return await db.prepare("SELECT * FROM theme WHERE id = 1").first<ThemeRow>();
  } catch { return null; }
}
