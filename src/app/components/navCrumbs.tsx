"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type breadcrumbItem = {
  text: string;
  link: string;
};

const NavCrumbs = () => {
  const [crumbs, setCrumbs] = useState<breadcrumbItem[] | []>([]);
  const path = usePathname();

  useEffect(() => {
    if (path === "/") setCrumbs([{ text: "Home", link: "/" }]);
    else if (path === "/dashboard")
      setCrumbs([
        { text: "Home", link: "/" },
        { text: "Dashboard", link: "/dashboard" },
      ]);
    else {
      const p = path.split("/").filter((x) => x);
      const crumbs = p.map((crumb, index) => {
        return {
          text: crumb.charAt(0).toUpperCase() + crumb.slice(1),
          link: `/${crumb}`,
        };
      });
      setCrumbs([
        { text: "Home", link: "/" },
        { text: "Dashboard", link: "/dashboard" },
        {
          text:
            p[p.length - 1]!.charAt(0).toUpperCase() +
            p[p.length - 1]!.slice(1),
          link: path,
        },
      ]);
    }
  }, [path]);

  const paths = path.split("/").filter((x) => x);
  console.log({ paths });
  return (
    <div className="breadcrumbs text-sm">
      <ul>
        {crumbs.map((crumb, index) => {
          return (
            <li key={index}>
              <Link href={crumb.link}>
                <p className="font-semibold italic">{crumb.text}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default NavCrumbs;
