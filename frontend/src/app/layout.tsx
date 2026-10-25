import type { Metadata, Viewport } from "next";
import { Anek_Devanagari, Anek_Tamil, DM_Serif_Display, Fraunces, Geist, IBM_Plex_Mono } from "next/font/google";
import { LocaleProvider } from "@/components/locale-provider";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const plexMono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500"] });
// Display serif, reserved for the two headline names (wordmark + "Rooted to Rise").
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], display: "swap" });
// Simpler display serif for the hero wordmark: elegant, but easy to read at a glance.
const titleSerif = DM_Serif_Display({ variable: "--font-title-serif", subsets: ["latin"], weight: "400", display: "swap" });
// Indian scripts load only when a page actually renders Tamil / Devanagari text.
const anekTamil = Anek_Tamil({ variable: "--font-anek-tamil", subsets: ["tamil"], preload: false });
const anekDeva = Anek_Devanagari({ variable: "--font-anek-deva", subsets: ["devanagari"], preload: false });

export const metadata: Metadata = {
  title: "Kalpavriksha — One app for every learner",
  description:
    "Digital learning, holistic growth, GK and patriotic songs in one app for Kalpavriksha Seva Trust students. Tamil, English and Hindi.",
  applicationName: "Kalpavriksha",
};

export const viewport: Viewport = {
  themeColor: "#050507",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${plexMono.variable} ${fraunces.variable} ${titleSerif.variable} ${anekTamil.variable} ${anekDeva.variable}`}
    >
      <body className="min-h-svh">
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
