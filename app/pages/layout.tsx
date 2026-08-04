import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

// WordPress "pages" routes render inside the Chronilogix site chrome (the root
// layout no longer injects a global Nav/Footer).
export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  );
}
