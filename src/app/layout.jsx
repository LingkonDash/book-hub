import Navbar from "@/components/shared/Navbar";
import { poppins } from "./fonts";
import "./globals.css";

export const metadata = {
  title: "BookHub",
  description: "Your Local Library, Delivered",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`h-full ${poppins.className}`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />

        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}