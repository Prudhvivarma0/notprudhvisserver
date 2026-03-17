import { SDFBackground  } from "@/components/SDFBackground";
import { Hero           } from "@/components/Hero";
import { WordScroll     } from "@/components/WordScroll";
import { About          } from "@/components/About";
import { Projects       } from "@/components/Projects";
import { Experience     } from "@/components/Experience";
import { Achievements   } from "@/components/Achievements";
import { Contact        } from "@/components/Contact";
import { Footer         } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <SDFBackground />
      <main style={{ position: "relative", zIndex: 1 }}>
        <Hero />
        <WordScroll />
        <About />
        <Projects />
        <Experience />
        <Achievements />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
