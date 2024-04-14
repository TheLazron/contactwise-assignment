import Link from "next/link";
import Navbar from "./components/navbar";
import Image from "next/image";

export default function Home() {
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
              <span className="drop-shadow-glow bg-gradient-to-tr  from-accent 	to-secondary bg-clip-text text-transparent">
                {" "}
                management
              </span>{" "}
              made easy.
            </h1>
            <p className="sm:text-md mb-8 text-[12px] leading-relaxed lg:text-lg">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui
              laborum quasi, incidunt dolore iste nostrum cupiditate voluptas?
              Laborum, voluptas natus?
            </p>

            <div className="flex justify-center">
              <Link
                href="/api/auth/signin"
                className="btn btn-outline btn-secondary btn-md sm:btn-lg sm:btn-wide"
              >
                Sign In
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

{
  /* <div className="w-full justify-self-start"><Navbar /></div> */
}
{
  /* <section className="body-font">
          <div className="container mx-auto flex flex-col items-center px-5 py-44 md:flex-row">
            <div className="mb-16 flex flex-col items-center text-center md:mb-0 md:w-2/3 md:items-start md:pr-16 md:text-left lg:flex-grow lg:pr-44">
              <h1
                className="
                base-content secondary mb-4 text-5xl
               font-bold sm:text-7xl
              "
              >
                User
                <span className="drop-shadow-glow bg-gradient-to-tr  from-accent 	to-secondary bg-clip-text text-transparent">
                  {" "}
                  management
                </span>{" "}
                made easy.
              </h1>
              <p className="sm:test-lg mb-8 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui
                laborum quasi, incidunt dolore iste nostrum cupiditate voluptas?
                Laborum, voluptas natus?
              </p>

              <div className="flex justify-center">
                <button className="btn btn-outline btn-secondary btn-lg btn-wide">
                  Sign In
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
                </button>
              </div>
            </div>
            <div className="w-5/6 md:w-1/2 lg:w-full lg:max-w-lg">
              <img
                className="rounded object-cover object-center"
                alt="hero"
                src="/landing-image.png"
              />
            </div>
          </div>
        </section> */
}
