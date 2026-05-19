import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import { ComingSoonProvider } from "@/components/ui/coming-soon-modal";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const bebasNeue = localFont({
  src: [
    {
      path: "../fonts/BebasNeue-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://batteryswap.ph'),
  title: {
    default: "BatterySwap PH | Swap. Charge. Ride.",
    template: "%s | BatterySwap PH",
  },
  description: "The premier battery swapping platform for e-bikes and EVs in the Philippines. Swap your depleted battery for a fully charged one in under 2 minutes.",
  keywords: ["battery swap", "e-bike", "electric bike", "Philippines", "BGC", "Taguig", "EV charging"],
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: "https://batteryswap.ph",
    siteName: "BatterySwap PH",
    title: "BatterySwap PH | Swap. Charge. Ride.",
    description: "Swap your depleted e-bike battery for a fully charged one in under 2 minutes. No waiting, no range anxiety.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "BatterySwap PH" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BatterySwap PH | Swap. Charge. Ride.",
    description: "Swap your depleted e-bike battery for a fully charged one in under 2 minutes.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "https://batteryswap.ph",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${bebasNeue.variable} font-body antialiased bg-background text-foreground min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
          <ComingSoonProvider>
            {children}
          </ComingSoonProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
