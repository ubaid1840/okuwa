import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import Loading from "./loading";
import { Providers } from "./providers";
import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { ColorModeScript } from "@chakra-ui/react";
import DarkModeSwitcher from "@/components/DarkModeSwitcher";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Hospital Management",
  description: "Hospital Management",
};

export const fetchCache = 'force-no-store';

export default async function RootLayout({ children }) {
  const locale = await getLocale();
 
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  return (
    <html lang={locale} className="bg-background">
      <body className={inter.className} suppressHydrationWarning={true}>
      <NextIntlClientProvider messages={messages}>
        <Suspense fallback={<Loading />}>
          <Providers>
          <ColorModeScript initialColorMode={"light"} />
            {children}
            {/* <DarkModeSwitcher /> */}
          </Providers>
        </Suspense>
        </NextIntlClientProvider>

      </body>
    </html>
  );
}
