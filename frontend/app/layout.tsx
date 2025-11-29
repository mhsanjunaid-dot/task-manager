import "./globals.css";
import Navbar from "./components/Navbar";
export const metadata = {
  title: "Task Manager",
  description: "Task management app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
