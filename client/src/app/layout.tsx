import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
// CSS import has no TypeScript declarations in this project setup.
// Using ts-ignore to avoid the module declaration error.
// @ts-ignore
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

export const metadata: Metadata = {
  title: "FocusFlow - Pomodoro Study Timer",
  description: "Aplicação de timer Pomodoro para controle de tempo de estudo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster position="top-right" />
        </QueryClientProvider>
      </body>
    </html>
  );
}
