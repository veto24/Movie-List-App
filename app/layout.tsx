import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "./provider";
import { Montserrat } from "@next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Movie List App",
  description: "Movie List App built with Next.js and Prisma",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <Provider>
        <body
          className={`${montserrat.variable} ${geistSans.variable} ${geistMono.variable} antialiased relative bg-darkBlue min-h-screen`}
        >
          <div className="relative z-10">{children}</div>

          {/* Waves */}
          <div className="absolute bottom-0 left-0 w-full z-0">
            <svg
              viewBox="0 0 1440 320"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto"
            >
              <path
                fill="#0A444B"
                fillOpacity="0.5"
                d="M0,224L80,229.3C160,235,320,245,480,224C640,203,800,149,960,144C1120,139,1280,181,1360,202.7L1440,224V320H1360C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320H0Z"
              ></path>
              <path
                fill="#244D5A"
                fillOpacity="0.5"
                d="M0,256L60,245.3C120,235,240,213,360,202.7C480,192,600,192,720,202.7C840,213,960,235,1080,224C1200,213,1320,171,1380,149.3L1440,128V320H1380C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320H0Z"
              ></path>
            </svg>
          </div>
        </body>
      </Provider>
    </html>
  );
}
