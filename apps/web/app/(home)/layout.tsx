import { ChevronRight } from "lucide-react";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>{children}</>
  );
}
