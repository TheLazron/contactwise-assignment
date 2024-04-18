import NavCrumbs from "../components/navCrumbs";
import Navbar from "../components/navbar";
import { getServerSession } from "next-auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  return (
    <>
      <div className="absolute top-5 w-full">
        <Navbar />
        {/* {session && <NavCrumbs />} */}
      </div>
      {children}
    </>
  );
}
