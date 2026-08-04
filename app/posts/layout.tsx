import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

// WordPress post/archive routes render inside the Chronilogix site chrome.
// The root layout no longer injects a global Nav/Footer (marketing pages own
// their chrome), so these routes get it here for the whole /posts subtree.
export default function PostsLayout({
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
