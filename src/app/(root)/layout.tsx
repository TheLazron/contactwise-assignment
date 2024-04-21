import NavCrumbs from "../components/navCrumbs";
import Navbar from "../components/navbar";
import { getServerSession } from "next-auth";

//root layout for pages requiring navbar
export default async function DashboardLayout({
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
