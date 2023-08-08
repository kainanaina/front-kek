import { Texterino } from 'src/components';

const { HL } = Texterino;

const sequenceCode = `
// this is our single source of truth for chain of animations timings, values are in seconds
const animations = [
  { name: 'elon-waiting', duration: 0.5 },
  { name: 'elon-appearance', duration: 1 },
  { name: 'twitter-reaction-waiting', duration: 0.3 },
  { name: 'twitter-reaction', duration: 0.7 },
  { name: 'twitter-shaking', duration: 1.4 },
  { name: 'logo-fill-waiting', duration: 0 },
  { name: 'logo-fill', duration: 0.1 },
  { name: 'logo-morphing', duration: 0.2 }, // this step combines black background circle expansion and twitter logo morphing with stroke color change
  { name: 'x-part-2', duration: 0.6 },
  { name: 'doge-appearance', duration: 0.3 },
  { name: 'reset-appearance', duration: 0.3 },
];

// this map also contains delays for each animation, which makes our css transitions code very trivial
const { acc: animationsWithDelaysMap } = animations.reduce(
  ({ acc, delay }, anim) => {
    acc[anim.name] = anim.duration;
    acc[\`\${anim.name}-delay\`] = delay;
    return {
      acc, // accumulates animation durations and their respective delays
      delay: delay + anim.duration, // accumulates total delay
    };
  },
  { acc: {} as Record<string, number>, delay: 0 }
);
`;

const styleObjCode = `
const styleObj = {
  '--logo-size': \`\${logoSize}px\`,
  ...Object.entries(animationsWithDelaysMap).reduce(
    (acc, [name, duration]) => {
      // the final result is something like { '--doge-appearance-at': '0.3s', '--doge-appearance-delay': '1.5s' }
      acc[\`--\${name}\${name.endsWith('delay') ? '' : '-at'}\`] = \`\${duration}s\`;
      return acc;
    },
    {} as Record<string, string>
  ),
} as React.CSSProperties;

// main container in JSX
<div className="...classnames" style={styleObj}>
`;

const jsxCode = `
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
`;

const elonCode = `
.twitter-x__elon {
  // other styles
  opacity: 0;
  will-change: opacity;

  @include isMorphing {
    transition: opacity var(--elon-appearance-at) var(--elon-appearance-delay);
    opacity: 1;
  }
}
`;

const sweatCode = `
.twitter-x__sweat {
  --timing: var(--twitter-reaction-at) var(--twitter-reaction-delay);
  // other styles
  transform: translateY(-10px);
  opacity: 0;
  will-change: opacity, transform;

  @include isMorphing {
    transition: opacity var(--timing), transform var(--timing);
    transform: translateY(0);
    opacity: 1;
  }
}
`;

const shakingCode = `
// scss generates random values on compilation which are allowing us to make it look like a random shaking,
// by rapidly shifting element vertically and horizontally
@keyframes shaking {
  @for $i from 0 through 50 {
    #{$i * 2%} { // interpolated results are 0%, 2%, ... 98%, 100%
      // (random(20) - 10) * 1px is a random value between -10px and 10px
      transform: translate((random(20) - 10) * 1px, (random(20) - 10) * 1px);
    } 
  }
}

.twitter-x__logo {
  // other styles

  @include isMorphing {
    animation: shaking var(--twitter-shaking-at) var(--twitter-shaking-delay);
  }
}
`;

const blackBgCode = `
.twitter-x__black-bg {
  position: absolute;
  left: 50%;
  top: 50%;
  // 150vmax ensures that this element will cover the entire screen no matter what
  // (assuming that parent container doesn't have it's own overflow: hidden)
  width: 150vmax;
  height: 150vmax;
  margin-left: -75vmax;
  margin-top: -75vmax;
  border-radius: 50%;
  background: #000;
  transform: scale(0);
  will-change: transform;

  @include isMorphing {
    transition: transform var(--logo-morphing-at) var(--logo-morphing-delay);
    transform: scale(1);
  }
}
`;

const useEffectCode = `
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
`;

const svg2Code = `
.twitter-x__logo-svg2 {
  overflow: visible;
  position: absolute;
  inset: 0;
  fill: #fff;

  path {
    transform: scale(0);

    // setting custom transform-origin is required to make the animation look like the line is being drawn from the center
    // ideally we would be using % values, but svg got this ancient trouble where transform-origin with % just doesn't works in many browsers
    // libraries like GSAP got their own logic to allow % values, which relies on some internal calculations, but we don't have such luxury here
    &:first-child {
      // keep in mind that this svg got viewBox="0 0 270 270", so px values are relative to these dimensions, unlike with twitter icon which is 24x24
      transform-origin: 100px 160px;
    }

    &:last-child {
      transform-origin: 160px 100px;
    }

    @include isMorphing {
      // cubic-bezier transition-timing-function allows you to create fancier animations, where elements could be bouncing or looking slightly elastic
      // you can check this playground to get the better idea https://cubic-bezier.com/
      transition: transform var(--x-part-2-at) var(--x-part-2-delay) cubic-bezier(0.13, 0.9, 0.3, 1.3);
      transform: scale(1);
    }
  }
}
`;

const resetCode = `
// we are using this wrapper to reset our component state and rerun useEffect by changing the key prop
export default function ResetWrapper() {
  const [refreshMs, setRefreshMs] = useState(0);

  return (
    <TwitterXLogoDemo
      key={refreshMs}
      onReset={() => setRefreshMs(Date.now())} // using timestamp is probably the most braindead and bulletproof way to get new unique key each time
    />
  );
}
`;

interface Props {
  slug: string;
}

export default function Text({ slug }: Props) {
  return (
    <Texterino>
      <Texterino.Disclaimers />
      <h1>Twitter X Logo Transformation Tutorial</h1>
      <h2>What is even happening here?</h2>
      <p>
        So first let&apos;s break down everything that is happening here in this
        chain of animations:
      </p>
      <ol>
        <li>Image of Smoking Elon appears with a short delay.</li>
        <li>Sweat teardrop appears on Twitter logo with a delay.</li>
        <li>Twitter logo is shaking.</li>
        <li>
          Twitter logo svg fill color animated to transparent with a delay.
        </li>
        <li>
          Black background circle is expanding from the center (while covering
          Elon&apos;s image) and Twitter logo is morphing into X left rectangle
          while changing stroke color to white.
        </li>
        <li>The second line in X logo is appearing from the center.</li>
        <li>Doge image appearing.</li>
        <li>Reset button appearing.</li>
      </ol>
      <p>
        Now let&apos;s cover how all of this is done (spoiler - it&apos;s mostly
        just css transitions tied to single class and a little bit of JS to
        morph the logo).
      </p>

      <Texterino.CodeExamples slug={slug} codepenId="RwqYNar" />

      <h2>Initial setup</h2>
      <p>
        One of the most important parts when dealing with sequential animations
        is to keep your sanity intact when trying to define the whole chain of
        events and assigning timings. Because once you&apos;ll start inevitable
        polishing phase, you will need to be able to easily change individual
        timings, without breaking anything and losing your mind.
      </p>

      <p>
        That&apos;s why we gonna define our sequence of animations in javascript
        array and derive map from it with computed delays for each specific
        animation.
      </p>

      <pre>
        <code className="lang-ts">{sequenceCode}</code>
      </pre>

      <p>
        And then we gonna assign these variables to our main container, so that
        CSS could access them:
      </p>

      <pre>
        <code className="lang-ts">{styleObjCode}</code>
      </pre>

      <p>
        After that we&apos;ll need to put all our required elements and assets
        in JSX. Here is how it looks (classnames should be self-explanatory):
      </p>

      <pre>
        <code className="lang-tsx">{jsxCode}</code>
      </pre>

      <p>
        All of our elements are located in <HL>.twitter-x__center</HL> which is
        a centered (duh) 270x270 container. Twitter logo positioned inside and
        takes parent&apos;s dimensions, while other assets are positioned with{' '}
        <HL>position: absolute</HL> somewhere around it.
      </p>

      <p>
        For the full styles and code check the source links above, I will be
        showing only parts of styles for specific elements below.
      </p>

      <h2>Elon and sweating bird</h2>
      <p>
        With Elon everything is simple, I googled{' '}
        {'"elon smoking weed transparent background"'} and got like second
        image, optimized it on{' '}
        <a href="https://tinypng.com/" target="_blank">
          tinypng
        </a>{' '}
        and uploaded it to imgur. It appears with a short delay via basic
        opacity change.
      </p>

      <pre>
        <code className="lang-scss">{elonCode}</code>
      </pre>

      <p>
        It is important to note that in this demo transition and animation rules
        are always defined in state class rule and not on the root level of the
        element. This way transition will be happening only when class is
        applied. This allows us to remove <HL>.s--morphing</HL> class and reset
        the whole state of UI instantly, without looking at reverse transitions.
      </p>

      <p>
        The bird sweat droplet is animated pretty much the same way, the only
        difference is that there is also <HL>translateY</HL> change to make it
        appear from the top. And nesting svg in container allows me to hide it
        later with a separate transition, without using second class.
      </p>

      <pre>
        <code className="lang-scss">{sweatCode}</code>
      </pre>

      <h2>Shaking bird</h2>
      <p>
        For shaking animation we are using SCSS loop to make random values
        (which are generated once during styles compilation) for{' '}
        <HL>transform: translate</HL> (both X and Y values) in keyframes
        animation, which just rapidly shifts element around its original place.
      </p>

      <pre>
        <code className="lang-scss">{shakingCode}</code>
      </pre>

      <h2>Logo morphing and colors change</h2>
      <p>
        So after previous steps are done (including changing bird fill color to
        transparent), it&apos;s time for the main show of this demo.
      </p>

      <p>
        First let&apos;s quickly cover black background expansion. It&apos;s
        done via technique where you are placing large circle in the middle that
        covers the entire container and scaling it to 0 by default, so it&apos;s
        not visible in the initial state. And once it&apos;s a showtime, you are
        just quickly scaling it to 1, which {'"expands"'} it from the center and
        makes it look wayyyyy better than just boring background-color
        transition of the main container. And on top of it we can also cover
        some content with it (assuming proper elements order or z-indexes
        assigned to them), like Elon&apos;s image, without needing to add second
        class or any other annoying stuff.
      </p>

      <pre>
        <code className="lang-scss">{blackBgCode}</code>
      </pre>

      <p>
        As for the logo morphing, that&apos;s where we&apos;ll need some
        javascript. I won&apos;t be able to cover the whole topic of svg
        morphing, because fairly speaking I am a little bit too dumb for it, but
        tldr is that you can use libraries that are doing{' '}
        {'"best-estimate interpolations"'} for figuring out how one svg path
        shape can morph into another, and then providing you with values from 0
        to 1 relative to the progress of the animation (and most of the time
        they are handling animation themselves).
      </p>
      <p>
        In the perfect world I would be using something like{' '}
        <a href="https://greensock.com/morphsvg/" target="_blank">
          GSAP MorphSVGPlugin
        </a>
        , but unfortunately it requires paid membership, which is a no go for my
        demos. After doing a little bit of research with available open-sourced
        libraries, I settled on{' '}
        <a href="https://github.com/veltman/flubber" target="_blank">
          flubber
        </a>{' '}
        which got good amount of weekly downloads, nice api and reasonable size.
      </p>
      <p>
        Hopefully comments in code below are enough to explain what is going on:
      </p>

      <pre>
        <code className="lang-ts">{useEffectCode}</code>
      </pre>

      <p>
        And the last part of this animation step is changing stroke color from
        twitter-blue to white, which is not worth the code-embed.
      </p>

      <h2>Second part of X logo</h2>

      <p>
        Once morphing is done, we need to finish X logo by animating appearance
        of second line (bottom-left to top-right). But in our case it&apos;s
        actually 2 lines, both of which are painted somewhere from the center to
        their respective corners. It&apos;s done this way because I need to keep
        background inside of first X rectangle transparent, to see the black
        background behind (and I definitely don&apos;t want to manually change
        fill of that svg). So for this reason we can&apos;t allow that line
        going through the middle of the X.
      </p>

      <p>
        As for the animation itself we are relying on scaling the lines from 0
        to 1 from transform-origin located in a middle. More info in code
        comments below:
      </p>

      <pre>
        <code className="lang-scss">{svg2Code}</code>
      </pre>

      <p>
        Once line animation is done, we only have left doge and reset
        appearances, which are done the same way as elon.
      </p>

      <h2>How reset works</h2>

      <pre>
        <code className="lang-tsx">{resetCode}</code>
      </pre>

      <h2>Additional notes:</h2>

      <ul>
        <li>
          Unfortunately morphing animation is kinda scuffed at the beginning, it
          just instantly jumps from bird shape to something very weird, which is
          the reason why <HL>logo-morphing</HL> animation step is only{' '}
          <HL>0.2s</HL> long. Making shitty parts of animations very fast is the
          easiest crutch you can use, hoping that majority of people won&apos;t
          notice the poor quality.
        </li>
        <li>
          One of the reasons for making this demo was proving to myself that
          I&apos;m not washed :D I woke up on Monday (with SG time, which is +12
          to US), saw all the memes on twitter about new logo and knew that I
          had to move fast to capitalize on this hot topic. I finalized my idea
          during brunch, and few hours after returning home the demo was done
          and published. This article took me way longer to write than the demo,
          which is normal I guess (writing is fucking hard, jesus christ).
        </li>
      </ul>

      <Texterino.Begging />
    </Texterino>
  );
}
