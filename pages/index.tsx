import Footer from "@/components/Layout/Footer";
import Header from "@/components/Layout/Header";

export default function Home(): JSX.Element {
  return (
    <div className="relative w-full h-full overflow-x-hidden flex flex-col cursor-pixel h-screen selection:bg-white selection:text-azul" id="grid">
      <Header />
      <Footer />
    </div>
  );
}
