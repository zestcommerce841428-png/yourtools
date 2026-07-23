import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";
import MeshGridBackground from "@/components/layouts/MeshGridBackground";
import footerLinks from "@/json-assets/footer-tool-links.json";

const navCategories = footerLinks.map((category) => ({
  name: category.categoryName,
  href: category.categoryHref,
}));

export default function PrimaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <MeshGridBackground />
      <Header categories={navCategories} />
      <main className="relative z-10 flex-1 w-full flex justify-center pb-2 md:pb-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
