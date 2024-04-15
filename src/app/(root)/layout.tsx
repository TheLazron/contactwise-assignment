import Navbar from "../components/navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="absolute top-5 w-full">
        <Navbar />
      </div>
      {children}
    </>
  );
}
