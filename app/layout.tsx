// Import necessary types
import type { Metadata } from "next";

// Import beautiful modern fonts
import { Poppins, Roboto_Mono } from "next/font/google";

// Import global styles
import "./globals.css";

// Import providers and components
import { ThemeProvider } from "next-themes";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./utils/AuthProvider";

// Initialize Poppins (main stylish font)
const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"], // Use multiple weights
  subsets: ["latin"],
});

// Initialize Roboto Mono (secondary font for code/technical text if needed)
const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

// Define SEO metadata for better Google ranking
export const metadata: Metadata = {
  title: "FocusFlow - Organize Your Mind Effortlessly",
  description:
    "FocusFlow helps you manage notes, tasks, and ideas in a simple and beautiful workspace. Stay organized, stay creative.",
};

// Define the Root Layout for the app
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${poppins.variable} ${robotoMono.variable}`}
      >
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen flex flex-col">
              {/* Top navigation bar */}
              <Navbar />

              {/* Main content area */}
              <main className="flex-grow">{children}</main>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
