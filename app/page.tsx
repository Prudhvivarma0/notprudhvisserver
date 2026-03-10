import { Hero         } from "@/components/Hero";
import { About        } from "@/components/About";
import { Projects     } from "@/components/Projects";
import { Experience   } from "@/components/Experience";
import { Achievements } from "@/components/Achievements";
import { Contact      } from "@/components/Contact";
import { Footer       } from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Projects />
      <Experience />
      <Achievements />
      <Contact />
      <Footer />
    </main>
  );
}
