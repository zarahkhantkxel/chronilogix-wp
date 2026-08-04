import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PageLoader } from "@/components/PageLoader";
import { SectionGuide } from "@/components/widget/SectionGuide";
import { CoachLauncher } from "@/components/CoachLauncher";
import { VersionToggle } from "@/components/VersionToggle";
import { HeroV5 } from "@/components/sections/HeroV5";
import { StatementV5 } from "@/components/sections/StatementV5";
import { MIExplainer } from "@/components/sections/MIExplainer";
import { Problem } from "@/components/sections/Problem";
import { Outcome } from "@/components/sections/Outcome";
import { Solution } from "@/components/sections/Solution";
import { WhoWeServe } from "@/components/sections/WhoWeServe";
import { CustomerStories } from "@/components/sections/CustomerStories";
import { Testimonials } from "@/components/sections/Testimonials";

// Home V4 — iteration of V1 that begins shrinking the on-page text load
// by pushing detail into a shared DetailModal system.
//
// This pass only touches the Problem section: the six numeric facts
// collapse to a numbered ChapterRail; each row opens the modal with the
// full fact detail (hero numeral, hook, two short paragraphs, optional
// cascade). Every other section is identical to V1 for now — later
// iterations will convert WhoWeServe, MIExplainer, Solution, and
// CustomerStories to the same pattern.
export default function HomePageV4() {
  return (
    <>
      <PageLoader />
      <Nav />
      <main className="flex flex-col">
        <div className="flex flex-col gap-2 p-2 md:gap-3 md:p-3">
          <div className="flex flex-col">
            <HeroV5 />
            <StatementV5 />
          </div>
          <MIExplainer />
          <Solution />
        </div>
        <div className="flex flex-col">
          <Problem />
          <Outcome />
          <WhoWeServe variant="abstract" />
        </div>
        <div className="flex flex-col gap-2 p-2 md:gap-3 md:p-3">
          <CustomerStories />
          <Testimonials />
        </div>
      </main>
      <Footer />

      <SectionGuide />
      <CoachLauncher />
      <VersionToggle />
    </>
  );
}
