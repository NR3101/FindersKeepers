import Navbar from "../../components/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-work-sans">
      <Navbar />
      {children}
    </div>
  );
}
