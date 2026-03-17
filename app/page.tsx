import { Hero         } from "@/components/Hero";
import { WordScroll   } from "@/components/WordScroll";
import { About        } from "@/components/About";
import { Projects     } from "@/components/Projects";
import { Experience   } from "@/components/Experience";
import { Achievements } from "@/components/Achievements";
import { Contact      } from "@/components/Contact";
import { Footer       } from "@/components/Footer";
import {
  getHero,
  getAbout,
  getExperience,
  getCertifications,
  getAchievements,
  getWordScroll,
  getContactLinks,
  getTheme,
} from "@/lib/db";

export default async function Home() {
  // Fetch from D1 if available; components fall back to hardcoded data when null/empty
  await Promise.all([
    getHero(),
    getAbout(),
    getExperience(),
    getCertifications(),
    getAchievements(),
    getWordScroll(),
    getContactLinks(),
    getTheme(),
  ]);

  return (
    <main>
      <Hero />
      <WordScroll />
      <About />
      <Projects />
      <Experience />
      <Achievements />
      <Contact />
      <Footer />
    </main>
  );
}
