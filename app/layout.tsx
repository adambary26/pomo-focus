import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/features/themes/theme-provider";
import { AuthProvider } from "@/features/auth/auth-provider";
import { SyncProvider } from "@/features/sync/sync-provider";
import { ToastContainer } from "@/features/notifications/toast-container";

const plusJakarta = Plus_Jakarta_Sans({
  weight: ["700", "800"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pomo — Focus Timer",
  description: "A beautiful Pomodoro focus timer with ambient sounds and task management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakarta.className} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <SyncProvider>
            <ThemeProvider>
              {children}
              <ToastContainer />
            </ThemeProvider>
          </SyncProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
