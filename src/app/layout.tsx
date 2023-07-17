import { Open_Sans } from 'next/font/google';
import s from './styles.module.scss';
import 'src/styles/index.scss';

export const metadata = {
  title: 'Front-Kek - Stupid frontend stuff made by a professional idiot',
  description: 'lose all hope ye who enter here',
};

const openSans = Open_Sans({
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
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
      <body className={openSans.className}>
        <svg>
          <defs>
            <clipPath id="logo">
              <text x="0" y="22" fontWeight="bold" fontSize="30px">
                FRONT-KEK
              </text>
            </clipPath>
          </defs>
        </svg>
        <div className={s.logo}>
          <div />
        </div>
        {children}
      </body>
    </html>
  );
}
