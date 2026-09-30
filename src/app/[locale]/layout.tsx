import type { Metadata } from "next";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { MotionConfig } from "framer-motion";
import { ThemedToaster } from "@/components/shared/ThemedToaster";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { routing } from "@/i18n/routing";
import { LocalePreferenceSync } from "@/components/shared/LocalePreferenceSync";
import "../globals.css";

// Vendored latin variable woff2 (from the cached dev build) so `next build`
// stays hermetic — no Google Fonts network fetch. One variable file covers
// all weights for each family.
const syne = localFont({
  variable: "--font-syne",
  src: "../../../assets/fonts/syne-latin.woff2",
  display: "swap",
});

const inter = localFont({
  variable: "--font-inter",
  src: "../../../assets/fonts/inter-latin.woff2",
  display: "swap",
});

const jetbrainsMono = localFont({
  variable: "--font-jetbrains-mono",
  src: "../../../assets/fonts/jetbrains-mono-latin.woff2",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("title"),
    description: t("description"),
    icons: { icon: "/favicon.png" },
    openGraph: {
      title: t("title"),
      description: t("description"),
      images: [{ url: "/images/sections/og-cover.jpg", width: 1200, height: 630, alt: "Creditax.ai — Tax Smart. Borrow Smart." }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/images/sections/og-cover.jpg"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${syne.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            {/* Global reduced-motion policy: transform/layout animations are
                skipped for users who prefer reduced motion. Static initial
                props on motion components keep SSR/client markup identical. */}
            <MotionConfig reducedMotion="user">
              <LocalePreferenceSync />
              {children}
              <ThemedToaster />
            </MotionConfig>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
