import Header from "@/components/navigations/Header";
import Footer from "@/components/navigations/Footer";

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />

      <div className="min-h-screen">{children}</div>

      <Footer />
    </>
  );
}
