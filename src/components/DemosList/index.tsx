'use client';
import Link from 'next/link';
import { DEMOS } from 'src/constants';
import s from './styles.module.scss';

export default function DemosList() {
  return (
    <div className="container">
      <h1 className={s.heading}>Demos</h1>
      <div className={s.demos}>
        {DEMOS.map((demo) => {
          if (demo.hidden) {
            return null;
          }

          return (
            <Link
              href={`/demos/${demo.slug}`}
              key={demo.slug}
              className={s.demo}
            >
              <div className={s.demoPreview}>
                <div className="animated-border" />
                <div className={s.demoPreviewContent}>
                  <video autoPlay loop muted playsInline>
                    <source src={demo.preview} type="video/mp4" />
                  </video>
                </div>
              </div>
              <h2 className={s.demoTitle}>{demo.title}</h2>
              {!!demo.tags?.length && (
                <div className={s.demoTags}>
                  {demo.tags.map((tag) => (
                    <div key={tag} className={s.demoTag}>
                      {tag}
                    </div>
                  ))}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
