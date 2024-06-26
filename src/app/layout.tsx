import "~/styles/globals.css";
import { Noto_Sans } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "sonner";
import { Session, getServerSession } from "next-auth";
import { NextAuthProvider } from "./components/NextAuthSessionProvider";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Landscape",
  description:
    "Landscape: User Management Application submitted to CONTACTWISE",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`bg-base-100 object-cover font-sans ${notoSans.variable}`}
      >
        <NextAuthProvider>
          <TRPCReactProvider>
            <Toaster />
            <div className="bg-polka-pattern ">
              <div className="relative mx-4 flex h-screen max-h-screen flex-col justify-start sm:mx-12 md:mx-16">
                <div className="mt-24 md:my-auto">{children}</div>
              </div>
            </div>
          </TRPCReactProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
