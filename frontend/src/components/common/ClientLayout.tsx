import Header from "../Header/Header";
import Footer from "../Footer/Footer";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
