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
import { DemoContainer } from 'src/components';
import './styles.scss';

const logoSize = 270;
// original tabler twitter icon is contained in viewBox="0 0 24 24" so I'm using the same coordinates system to create that X rectangle shape as target for morphing
const targetPath = 'M0,0 6,0 24,24 18,24Z';

// this is our single source of truth for chain of animations timings, values are in seconds
const animations = [
  { name: 'elon-waiting', duration: 0.5 },
  { name: 'elon-appearence', duration: 1 },
  { name: 'twitter-reaction-waiting', duration: 0.3 },
  { name: 'twitter-reaction', duration: 0.7 },
  { name: 'twitter-shaking', duration: 1.4 },
  { name: 'logo-fill-waiting', duration: 0 },
  { name: 'logo-fill', duration: 0.1 },
  { name: 'logo-morphing', duration: 0.2 }, // this step combines black background circle expansion and twitter logo morphing with stroke color change
  { name: 'x-part-2', duration: 0.6 },
  { name: 'doge-appearence', duration: 0.3 },
  { name: 'reset-appearence', duration: 0.3 },
];

// this map also contains delays for each animation, which makes our css transitions code very trivial
const { acc: animationsWithDelaysMap } = animations.reduce(
  ({ acc, delay }, anim) => {
    acc[anim.name] = anim.duration;
    acc[`${anim.name}-delay`] = delay;
    return {
      acc, // accumulates animation durations and their respective delays
      delay: delay + anim.duration, // accumulates total delay
    };
  },
  { acc: {} as Record<string, number>, delay: 0 }
);

interface Props {
  onReset: () => void;
}

function TwitterXLogoDemo({ onReset }: Props) {
  const [isMorphing, setIsMorphing] = useState(false);

  // this useEffect runs once at the start of component's initialization (which is also being triggered by key prop change)
  useEffect(() => {
    setIsMorphing(true);

    const colorChangeAnim = animationsWithDelaysMap['logo-morphing'] * 1000;
    const colorChangeDelay =
      animationsWithDelaysMap['logo-morphing-delay'] * 1000;

    // using good old dom selector, nothing fancy
    // but in a more serious project I would use useRef hook to get a reference to this element to evade relying on global classes
    const $path = document.querySelector('.twitter-x__logo-svg path');
    const twitterPath = $path?.getAttribute('d') || '';

    // I'm using flubber library (https://github.com/veltman/flubber) to morph twitter svg into X rectangle
    // GSAP MorphSVGPlugin is most likely is a better choice, but it requires paid membership to use it
    const interpolator = interpolate(twitterPath, targetPath);

    // I'm creating startTime variable here and not in timeout because of annoying js closure behavior
    const startTime = Date.now();

    let linejoinChanged = false;

    setTimeout(() => {
      // check mdn https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame for api reference
      // but overall tldr is that rAF runs callback function on next frame, which is usually 60 times per second
      requestAnimationFrame(draw);

      function draw() {
        // since startTime is defined outside of this function, we need to subtract the delay also to get proper elapsed time
        const elapsed = Date.now() - startTime - colorChangeDelay;
        const p = elapsed / colorChangeAnim; // progress of animation, from 0 to 1
        const d = interpolator(p);

        $path?.setAttribute('d', d);

        if (p < 1) {
          // run this function in rAF loop until animation is finished
          requestAnimationFrame(draw);
        }

        if (p >= 0.5 && !linejoinChanged) {
          // twitter icon got round linejoin by default to make it look smoother,
          // but X rectangle requires sharp corners, so this part changes it mid-animation
          linejoinChanged = true;
          $path?.setAttribute('stroke-linejoin', 'miter');
        }
      }
    }, colorChangeDelay);
  }, []); // empty array dependency means that this effect will run only once

  const styleObj = {
    '--logo-size': `${logoSize}px`,
    ...Object.entries(animationsWithDelaysMap).reduce(
      (acc, [name, duration]) => {
        // the final result is something like { '--doge-appearence-at': '0.3s', '--doge-appearence-delay': '1.5s' }
        acc[`--${name}${name.endsWith('delay') ? '' : '-at'}`] = `${duration}s`;
        return acc;
      },
      {} as Record<string, string>
    ),
  } as React.CSSProperties;

  return (
    <div
      className={cn('twitter-x', { 's--morphing': isMorphing })}
      style={styleObj}
    >
      <div className="twitter-x__center">
        <div className="twitter-x__logo">
          {/* I'm using tabler icons which are based on 24x24 viewBox,
          so values for things like stroke are relative to that original size */}
          <IconBrandTwitter
            size={logoSize}
            stroke="1.5"
            className="twitter-x__logo-svg"
          />

          {/* Second part of X logo, the line from bottom-left corner to top-right.
          But actually it's 2 lines in our case. Painted with numbers :) */}
          <svg viewBox="0 0 270 270" className="twitter-x__logo-svg2">
            <path d="M-20,280 0,280 122,153 102,150z" />
            <path d="M250,-10 270,-10 160,115 150,100z" />
          </svg>

          {/* I'm nesting it in a container so that I could hide svg droplet later with separate transition, without using second class */}
          <div className="twitter-x__sweat">
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

// we are using this wrapper to reset our component state and rerun useEffect by changing the key prop
function ResetWrapper() {
  const [refreshMs, setRefreshMs] = useState(0);

  return (
    <TwitterXLogoDemo
      key={refreshMs}
      onReset={() => setRefreshMs(Date.now())} // using timestamp is probably the most braindead and bulletproof way to get new unique key each time
    />
  );
}

export default function Demo() {
  return (
    <DemoContainer
      component={ResetWrapper}
      afterDemo={<DemoContainer.Callout style={{ color: '#fff' }} />}
    />
  );
}
