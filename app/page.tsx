import { PortfolioPage } from "@/components/PortfolioPage";
import {
  getHero,
  getProjects,
  getExperience,
  getCertifications,
  getAchievements,
  getContactLinks,
} from "@/lib/db";

export default async function Home() {
  const [hero, projects, experience, certs, achievements, contacts] = await Promise.all([
    getHero(),
    getProjects(),
    getExperience(),
    getCertifications(),
    getAchievements(),
    getContactLinks(),
  ]);

  return (
    <PortfolioPage
      hero={hero}
      projects={projects}
      experience={experience}
      certs={certs}
      achievements={achievements}
      contacts={contacts}
    />
  );
}
