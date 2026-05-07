import { Hero         } from "@/components/Hero";
import { Projects     } from "@/components/Projects";
import { Experience   } from "@/components/Experience";
import { Achievements } from "@/components/Achievements";
import { Contact      } from "@/components/Contact";
import {
  getHero,
  getProjects,
  getExperience,
  getCertifications,
  getAchievements,
  getContactLinks,
} from "@/lib/db";

export default async function Home() {
  const [hero, projects, experience, certs, achievements, contactLinks] =
    await Promise.all([
      getHero(),
      getProjects(),
      getExperience(),
      getCertifications(),
      getAchievements(),
      getContactLinks(),
    ]);

  return (
    <main>
      <Hero heroData={hero} />
      <Projects projects={projects} />
      <Experience experience={experience} />
      <Achievements certs={certs} achievements={achievements} />
      <Contact links={contactLinks} />
    </main>
  );
}
