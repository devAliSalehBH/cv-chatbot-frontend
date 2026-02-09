import type { Metadata } from "next";
import { Cairo, Outfit } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import GlobalAlert from "@/components/GlobalAlert";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "CV Bot - مساعد ذكي لسيرتك الذاتية",
  description: "أنشئ مساعد ذكي تفاعلي لسيرتك الذاتية وتميز أمام أصحاب العمل",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  // Select font based on locale
  const fontClass = locale === "ar" ? cairo.variable : outfit.variable;
  const fontName = locale === "ar" ? "font-cairo" : "font-outfit";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body
        className={`${fontClass} ${fontName} antialiased`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages}>
          <GlobalAlert />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
