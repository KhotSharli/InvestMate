import type { Metadata } from 'next';
import { Inter } from "next/font/google";

import { Toaster } from '@/components/ui/sonner';
import { QueryProviders } from '@/providers/query-provider';
import { SheetProvider } from '@/providers/sheet-provider';

import {
  ClerkProvider,
} from '@clerk/nextjs'

import './globals.css'

const inter = Inter({ subsets: ["latin" ]});

export const metadata: Metadata = {
  title: "InvestMate",
  description: "Navigate Your Financial Future with Confidence"
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <QueryProviders>
            <SheetProvider />
            <Toaster richColors theme="light"/>
          {children}
          </QueryProviders>
        </body>
      </html>
    </ClerkProvider>
  )
}