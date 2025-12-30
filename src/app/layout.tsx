import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "arcadmin - Distributed Sysadmin Agent Swarm",
  description: "A lightweight, extensible, and distributed system administration agent. Agentless SSH execution with LLM-ready transcripts.",
  keywords: ["sysadmin", "automation", "ssh", "agent", "distributed", "python", "devops"],
  authors: [{ name: "arcadmin" }],
  openGraph: {
    title: "arcadmin - Distributed Sysadmin Agent Swarm",
    description: "A lightweight, extensible, and distributed system administration agent.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${ibmPlexMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
