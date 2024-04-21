import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  if (session?.user) {
    redirect("/dashboard");
  }
  //root layout for auth pages sharing a same server-side rendered layout
  return (
    <>
      <section className="flex w-full ">
        <div className="mx-auto hidden flex-1 flex-col items-start justify-center px-2 md:flex ">
          <div className="flex items-center">
            <div className="md:w-15 flex-none sm:w-16 lg:w-24">
              <img
                alt="Tailwind CSS Navbar component"
                src="/navbar-logo.png"
                className="h-auto w-full"
              />
            </div>
            <h1 className="w-full text-2xl font-bold leading-tight tracking-tight text-accent sm:text-4xl md:text-4xl lg:text-6xl">
              Landscape
            </h1>
          </div>
          <p className="mt-2 text-[12px] italic text-gray-600 sm:text-base md:text-sm lg:text-xl">
            {
              '"Landscape, a comprehensive tool for user management, empowers users to create and join organizations with ease. It provides a robust platform for managing user permissions and roles, ensuring secure and efficient collaboration. "'
            }
          </p>
        </div>
        <div className=" mx-auto flex flex-1 flex-col items-center justify-center px-3 py-8 sm:px-12 md:h-screen lg:py-0">
          {children}
        </div>
      </section>
    </>
  );
}
