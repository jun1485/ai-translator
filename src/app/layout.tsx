import { Inter } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Translator Example",
  description: "Next.js를 이용한 자동 번역 기능 예시",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        {/* I18nProvider는 클라이언트 컴포넌트이므로 클라이언트 렌더링 시에만 활성화됩니다 */}
        <I18nProvider defaultLocale="ko">
          <div className="min-h-screen">{children}</div>
        </I18nProvider>
      </body>
    </html>
  );
}
