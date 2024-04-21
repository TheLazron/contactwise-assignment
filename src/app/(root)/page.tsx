import Link from "next/link";
import Navbar from "../components/navbar";
import Image from "next/image";
import { api } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";

export default async function Home() {
  const session = await getServerAuthSession();
  return (
    <>
      <main className="flex flex-col items-center justify-center">
        <div className=" flex w-full flex-col items-center md:flex-row">
          <div className="mb-16 flex flex-col items-center text-center md:mb-0 md:w-2/3 md:items-start md:pr-16 md:text-left lg:flex-grow lg:pr-52">
            <h1
              className="
                mb-4 text-4xl font-bold
               text-base-content sm:text-4xl lg:text-7xl
              "
            >
              User
              <span className="bg-gradient-to-tr from-accent  to-secondary 	bg-clip-text text-transparent drop-shadow-glow">
                {" "}
                management
              </span>{" "}
              made easy.
            </h1>
            <p className="sm:text-md mb-8 text-[12px] font-medium leading-relaxed lg:text-lg">
              Landscape allows users to create organizations and manage users
              within them, while also enabling participation in other
              organizations. With featured roles and a permission management
              system, user management becomes effortless.
            </p>

            <div className="flex justify-center">
              <Link
                href={`${session ? "/dashboard" : "/auth/signin"}`}
                className="btn btn-outline btn-secondary btn-md sm:btn-lg sm:btn-wide"
              >
                {session ? "Dashboard" : "Get Started"}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </Link>
            </div>
          </div>
          <div className="w-4/6 md:w-1/2 lg:w-full lg:max-w-2xl">
            <img className="mx-auto" alt="hero" src="/landing-image.png" />
          </div>
        </div>
      </main>
    </>
  );
}
