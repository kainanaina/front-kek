import { Roboto, Oswald } from 'next/font/google';
import Link from 'next/link';
import Script from 'next/script';
import cn from 'classnames';
import {
  IconBrandTwitterFilled,
  IconBrandGithubFilled,
} from '@tabler/icons-react';
import { generateMetadata } from 'src/utils';
import { GITHUB_REPO, TWITTER } from 'src/constants';
import s from './styles.module.scss';
import 'src/styles/index.scss';

const GA_ID = 'G-0TX0P0DGB7';

export const metadata = generateMetadata({});

const openSans = Roboto({
  weight: ['300', '400', '500', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
});

const oswald = Oswald({
  weight: ['700'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head></head>
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              globalThis.dataLayer = globalThis.dataLayer || [];
              function gtag(){globalThis.dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', '${GA_ID}');
            `}
          </Script>
        </>
      )}
      <body className={openSans.className}>
        <div className={s.layout}>
          <div className={s.layoutHeader}>
            <div className={cn(s.layoutHeaderContent, 'container')}>
              <div className={s.layoutHeaderSide}>
                <Link href="/">
                  <Logo />
                </Link>
                <Link href="/demos">Demos</Link>
                <Link href="/about-me">About Me</Link>
              </div>
              <div className={s.layoutHeaderSide}>
                <a href={GITHUB_REPO} target="_blank">
                  <IconBrandGithubFilled />
                </a>
                <a
                  href={TWITTER}
                  target="_blank"
                  style={{ color: 'rgb(29, 155, 240)' }}
                >
                  <IconBrandTwitterFilled />
                </a>
              </div>
            </div>
          </div>
          <div className={s.layoutContent}>{children}</div>
        </div>
      </body>
    </html>
  );
}

function Logo() {
  return (
    <>
      <svg className={s.logoSvg}>
        <defs>
          <clipPath id="logo">
            <text
              x="0"
              y="34"
              fontWeight="bold"
              fontSize="40px"
              className={oswald.className}
            >
              FRONT-KEK.COM
            </text>
          </clipPath>
        </defs>
      </svg>
      <div className={s.logo}>
        <div />
      </div>
    </>
  );
}
