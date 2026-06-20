import { Raleway } from "next/font/google";
import "./globals.css";

export const raleWay = Raleway({
  subsets: ["latin"],
  weight: [
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
  ],
  display: "swap",
});

export const metadata = {
  title: "BookHub",
  description: "Your Local Library, Delivered",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`h-full ${raleWay.className}`}
    >
      <body className="min-h-full flex flex-col bg-secondary/20 text-foreground"> {children} </body>
    </html>
  );
}