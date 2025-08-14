import { Rubik, Ubuntu } from "next/font/google";
import "./globals.sass";
import { Toaster } from "sonner";
import Authentication from "./Authentication";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  subsets: ['latin'],
  weight: ["300", "400", "500", "700"]
});

export const metadata = {
  title: "Mr Menu",
  description: "Mr Menu lets you instantly turn your restaurant’s menu into a QR code. Customers simply scan to view, while you update items, prices, and specials anytime — no costly reprints required.",
};

export default function RootLayout({ children }) {
  const theme = {
    default: {
      "--base-color": "lch(2.76 0 0)",
      "--text-color": "lch(100 0 0)",
      "--accent-color": "lch(46 32.1 202.83)"
    }
  }
  return (
    <html lang="en">
      <body className={`${rubik.variable} ${ubuntu.variable}`} style={theme.default}>
        <Authentication>
          <Toaster position="top-center" richColors />
          {children}
        </Authentication>
      </body>
    </html>
  );
}
