'use client';
import { useState, useEffect } from 'react';
import cn from 'classnames';
import {
  IconBrandTwitter,
  IconDropletFilled,
  IconRefresh,
} from '@tabler/icons-react';
//@ts-ignore
import { interpolate } from 'flubber';
import './styles.scss';

const logoSize = 270;
const targetPath = 'M0,0 6,0 24,24 18,24Z';

const animations = [
  { name: 'elon-waiting', duration: 0.5 },
  { name: 'elon-appearence', duration: 1 },
  { name: 'twitter-reaction-waiting', duration: 0.3 },
  { name: 'twitter-reaction', duration: 0.7 },
  { name: 'twitter-shaking', duration: 1.4 },
  { name: 'logo-fill-waiting', duration: 0 },
  { name: 'logo-fill', duration: 0.1 },
  { name: 'color-change', duration: 0.2 },
];

interface Props {
  onReset: () => void;
}

function TwitterXLogoDemo({ onReset }: Props) {
  const [isMorphing, setIsMorphing] = useState(false);

  useEffect(() => {
    setIsMorphing(true);

    const colorChangeAnimIndex = animations.findIndex(
      ({ name }) => name === 'color-change'
    );
    const colorChangeAnim = animations[colorChangeAnimIndex];
    const colorChangeAnimAT = colorChangeAnim.duration * 1000;
    const delay = animations
      .slice(0, colorChangeAnimIndex)
      .reduce((acc, { duration }) => acc + duration * 1000, 0);

    const $path = document.querySelector('.twitter-x__logo-svg path');
    const twitterPath = $path?.getAttribute('d') || '';
    const interpolator = interpolate(twitterPath, targetPath);

    const startTime = Date.now();

    let linejoinChanged = false;

    setTimeout(() => {
      requestAnimationFrame(draw);

      function draw() {
        const elapsed = Date.now() - startTime - delay;
        const p = elapsed / colorChangeAnimAT;
        const d = interpolator(p);

        $path?.setAttribute('d', d);

        if (p < 1) {
          requestAnimationFrame(draw);
        }

        if (p >= 0.5 && !linejoinChanged) {
          linejoinChanged = true;
          $path?.setAttribute('stroke-linejoin', 'miter');
        }
      }
    }, delay);
  }, []);

  return (
    <div
      className={cn('twitter-x', { 's--morphing': isMorphing })}
      style={
        {
          '--logo-size': `${logoSize}px`,
          ...animations.reduce((acc, { name, duration }) => {
            acc[`--${name}-at`] = `${duration}s`;
            return acc;
          }, {} as Record<string, string>),
        } as React.CSSProperties
      }
    >
      <div className="twitter-x__center">
        <div className="twitter-x__logo">
          <IconBrandTwitter
            size={logoSize}
            stroke="1.5"
            className="twitter-x__logo-svg"
          />
          <svg viewBox="0 0 270 270" className="twitter-x__logo-svg2">
            <path d="M-20,280 0,280 122,153 102,150z" />
            <path d="M250,-10 270,-10 160,115 150,100z" />
          </svg>
          <div className="twitter-x__sweat">
            <IconDropletFilled size={24} />
            <IconDropletFilled size={24} />
            <IconDropletFilled size={24} />
          </div>
        </div>
        <img
          src="https://i.imgur.com/97TTsIS.png"
          alt="Elon Smoking"
          className="twitter-x__elon"
        />
        <div className="twitter-x__black-bg" />
        <img
          src="https://i.imgur.com/NP1T6VA.png"
          alt="Doge"
          className="twitter-x__doge"
        />
        <IconRefresh className="twitter-x__reset" onClick={onReset} />
      </div>
    </div>
  );
}

export default function ResetWrapper() {
  const [refreshMs, setRefreshMs] = useState(0);

  return (
    <TwitterXLogoDemo
      key={refreshMs}
      onReset={() => setRefreshMs(Date.now())}
    />
  );
}
