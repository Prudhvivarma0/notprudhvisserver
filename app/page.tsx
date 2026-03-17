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
} from "@/lib/db";

export default async function Home() {
  const [hero, about, experience, certs, achievements, words, contactLinks] =
    await Promise.all([
      getHero(),
      getAbout(),
      getExperience(),
      getCertifications(),
      getAchievements(),
      getWordScroll(),
      getContactLinks(),
    ]);

  return (
    <main>
      <Hero heroData={hero} />
      <WordScroll words={words} />
      <About paragraphs={about} />
      <Projects />
      <Experience experience={experience} />
      <Achievements certs={certs} achievements={achievements} />
      <Contact links={contactLinks} />
      <Footer />
    </main>
  );
}
