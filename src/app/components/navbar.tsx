import { getToken } from "next-auth/jwt";
import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropDownMenu";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import ThemeToggler from "./ui/themeToggler";
const Navbar = async () => {
  const session = await getServerAuthSession();

  return (
    <div className="glass navbar w-full justify-self-start rounded-md shadow-lg ">
      <div className="flex flex-1 items-center gap-1">
        <div className="w-6 flex-none sm:w-10">
          <img alt="Tailwind CSS Navbar component" src="/navbar-logo.png" />
        </div>
        <p className="text-lg font-semibold sm:text-2xl">Landscape</p>
      </div>

      <div className="flex gap-2">
        <ThemeToggler />
        {session ? (
          <>
            {authedNavLinks.map((link) => {
              return (
                <Link key={link.href} href={link.href}>
                  <p className="btn btn-ghost btn-sm">{link.title}</p>
                </Link>
              );
            })}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div
                  tabIndex={0}
                  role="button"
                  className="avatar btn btn-circle btn-ghost"
                >
                  <div className="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS Navbar component"
                      src={session.user.image!}
                    />
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-36 bg-base-100">
                <DropdownMenuItem>
                  <Link href="/profile">View Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/api/auth/signout">Logout</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          unAuthedNavLink.map((link) => {
            return (
              <Link key={link.href} href={link.href}>
                <p className="btn btn-ghost btn-sm">{link.title}</p>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};

const unAuthedNavLink = [
  {
    title: "Sign In",
    href: "/api/auth/signin",
  },
];

const authedNavLinks = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Dashboard",
    href: "/dashboard",
  },
];

export default Navbar;
