import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageLoader } from "@/components/PageLoader";
import { SectionGuide } from "@/components/widget/SectionGuide";
import { Hero } from "@/components/sections/Hero";
import { Statement } from "@/components/sections/Statement";
import { ProblemV2 } from "@/components/sections/ProblemV2";
import { Outcome } from "@/components/sections/Outcome";
import { Solution } from "@/components/sections/Solution";
import { WhoWeServe } from "@/components/sections/WhoWeServe";
import { CustomerStories } from "@/components/sections/CustomerStories";

// V3 — the design that previously lived at "/" (the original V1). After
// the toggle renumbering (V5 → V3 → swapped with V1) it now sits in the
// V3 slot.
export default function HomePageV3() {
  return (
    <>
      <PageLoader />
      <Nav />
      <main className="flex flex-col">
        <div className="flex flex-col gap-2 p-2 md:gap-3 md:p-3">
          <Hero />
          <Statement />
          <Solution />
        </div>
        <div className="flex flex-col">
          <ProblemV2 />
          <Outcome />
          <WhoWeServe />
        </div>
        <div className="flex flex-col gap-2 p-2 md:gap-3 md:p-3">
          <CustomerStories />
        </div>
      </main>
      <Footer />

      <SectionGuide />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/agent.png"
        alt="Roni AI agent"
        className="pointer-events-none fixed bottom-5 right-5 z-50 h-auto w-[180px] select-none drop-shadow-[0_12px_28px_rgba(15,20,25,0.22)] md:bottom-6 md:right-6 md:w-[200px]"
        draggable={false}
      />
    </>
  );
}
