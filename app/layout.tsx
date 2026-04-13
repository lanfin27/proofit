import type { Metadata } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ToastProvider } from '@/components/Toast'
import { LoginModalProvider } from '@/components/LoginModalProvider'

export const metadata: Metadata = {
  title: 'Proofit | 이 강사, 진짜 돈 벌어본 사람일까?',
  description:
    '공인회계사 출신 팀이 직접 확인합니다. 비즈니스 강의 강사의 수익확인 현황을 확인하세요.',
  openGraph: {
    title: 'Proofit | 이 강사, 진짜 돈 벌어본 사람일까?',
    description:
      '공인회계사 출신 팀이 직접 확인합니다. 비즈니스 강의 강사의 수익확인 현황을 확인하세요.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%233182F6'/><text x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' font-weight='bold' fill='white'>P</text></svg>",
        type: 'image/svg+xml',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="font-sans antialiased flex flex-col min-h-screen">
        <ToastProvider>
          <LoginModalProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </LoginModalProvider>
        </ToastProvider>
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </html>
  )
}
