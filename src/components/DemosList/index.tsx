import Link from 'next/link';
import { DEMOS } from 'src/constants';
import s from './styles.module.scss';

export default function DemosList() {
  return (
    <div className="container">
      <h1 className={s.heading}>Demos</h1>
      <div className={s.demos}>
        {DEMOS.map((demo) => {
          return (
            <Link href={`/demos/${demo.slug}`} key={demo.slug}>
              <div className={s.demo}>
                <div className={s.demoPreview}>
                  <div className="animated-border" />
                  <video autoPlay loop muted playsInline>
                    <source src={demo.preview} type="video/mp4" />
                  </video>
                </div>
                <h2>{demo.title}</h2>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
