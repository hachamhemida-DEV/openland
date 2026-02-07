import type { Metadata } from "next";
import { Almarai } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

const almarai = Almarai({
    subsets: ["arabic"],
    weight: ["300", "400", "700", "800"],
    variable: "--font-almarai",
});

export const metadata: Metadata = {
    title: "أوبن لاند الجزائر | منصة الأراضي الزراعية",
    description: "أول منصة رقمية جزائرية لبيع، كراء واستثمار الأراضي الزراعية بشفافية وأمان",
    keywords: "أراضي زراعية, استثمار, الجزائر, بيع أراضي, كراء أراضي, أراضي فلاحية",
    openGraph: {
        title: "أوبن لاند الجزائر",
        description: "أول منصة رقمية جزائرية للأراضي الزراعية",
        locale: "ar_DZ",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ar" dir="rtl" className={almarai.variable}>
            <body className={`${almarai.className} antialiased`}>
                <Providers>
                    <Navbar />
                    <main className="min-h-screen">{children}</main>
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
