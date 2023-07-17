import cn from 'classnames';

function Texterino() {
  return (
    <div className="texterino">
      <h1>Form Switch Animation Demo</h1>

      <h2>What, Why, How?</h2>
      <p>
        This demo is a {'"remaster"'} of my <CodepenLink>old demo</CodepenLink>{' '}
        back from 2017. New version is most likely worse from UX and aethestic
        point of views, but this website is not about that. This website is
        about doing excessive stupid stuff with animations and cutting-edge
        tech, so don&apos;t seek any meaning here.
      </p>
      <p>Original demo was based around 2 following animations:</p>
      <ol>
        <li>
          Moving image container (aka <HL>switcher</HL>) from side to side,
          while {'"revealing"'} background behind it.
        </li>
        <li>
          Swapping forms underneath image container, which makes it look like we
          are just replacing form content on the fly.
        </li>
      </ol>
      <p>
        But it had one severe limitation - it required fixed width for main
        container, because it was the only way to know size of the background
        image for nested container. Limitation is tied to the fact that the
        image background is located inside of second-level child relative to
        main container, so we can&apos;t know the relative width of the main
        container, without fixed pixels size.
      </p>
      <p>
        After playing around I finally found the solution - it was{' '}
        <HL>css clip-path</HL>! And using it led me to next idiotic addition -
        now I can use some goofy polygon shapes and animate them, because why
        not?
      </p>
      <p>So let&apos;s dive in!</p>

      <h2>Rough explanation of layout and switch animation</h2>
      <p>Here is the initial view breakdown:</p>
      <img src="https://i.imgur.com/CZTmz6L.png" alt="Initial view breakdown" />
      <p>
        Once <HL>SIGN UP</HL> button is pressed, the state changes and{' '}
        <HL>._switched</HL> class is appended to demo element, which triggers
        following css transitions:
      </p>
      <ol>
        <li>
          Switcher element moves to the left and changes shape accordingly (more
          on that later).
        </li>
        <li>Forms container moves to the right by width of the switcher.</li>
        <li>
          Forms swapping their opacity and pointer-events right in the middle of
          animation with 0s animation duration, when switcher element is fully
          covering the form, which leaves no room for any visual glitches, even
          for few ms.
        </li>
      </ol>
      <p>
        As for reverse animation, everything there works automatically when you
        are removing the class.
      </p>
      <h2>Switcher and clip-path</h2>
      <p>
        In the original <CodepenLink>codepen demo</CodepenLink>, switcher is
        just a normal container with <HL>overflow: hidden</HL>, inside of which
        we can put our content, and background is done via nested element
        (:before) with width equal to fixed demo container width, so that you
        could move it during animation in the opposite direction of switcher
        movement, to create an effect of {'"revealing"'} the background behind
        it. And fluid width container isn&apos;t possible with that
        implementation, since 2-level nested children cannot get relative width
        of top-level parent (unless I am missing something).
      </p>
      <p>
        As you already know, the solution for having fluid width container is{' '}
        <HL>css clip-path</HL>. Please{' '}
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/CSS/clip-path"
          target="_blank"
        >
          check MDN
        </a>{' '}
        for full reference, but here is the quick tldr:
      </p>
      <ul>
        <li>
          CSS clip-path is essentially a more DX friendly version of svg
          clipPath. It supports relative values (which is super amazing in our
          case) and comes with few special predefined shapes, like polygon,
          circle, ellipse (we are gonna use polygon).
        </li>
        <li>
          You can also use <HL>path</HL> version, which works same way as path
          in svg, but it loses ability to use relative values like %.
        </li>
        <li>
          It allows you to {'"clip"'} the content, same way as you would do it
          with <HL>overflow: hidden</HL>, let&apos;s say, but you are not
          limited to basic rectangular shapes of usual html layout.
        </li>
        <li>
          And on top of it, you can change the coordinates for clipping area and
          everything will be automatically animated with css transitions!
        </li>
        <li>
          Somewhere like 5-7 years ago you would need a custom canvas or
          animation library paired with change of svg clipPath to achieve what
          now you can do with just simple clip-path transition and different
          coordinates on a state class.
        </li>
      </ul>
      <p>
        Here is the visual breakdown of <HL>switcher</HL> container:
      </p>
      <img
        src="https://i.imgur.com/1Bj3Jea.png"
        alt="Switcher container visual breakdown"
      />
      <p>The initial x values are following:</p>
      <p>
        <HL code>
          {`--x1: calc(100% - var(--switcher-width));
--x2: calc(100% - var(--arrow-offset)); // arrow-offset is responsible for creating that arrow shape
--x3: 100%;
--x4: calc(100% - var(--arrow-offset));
--x5: calc(100% - var(--switcher-width));
--x6: calc(100% - var(--switcher-width) + var(--arrow-offset));`}
        </HL>
      </p>
      <p>
        And for switched version we just need to mirror these values on the left
        side:
      </p>
      <p>
        <HL code>
          {`@include switched {
  --x1: var(--arrow-offset);
  --x2: var(--switcher-width);
  --x3: calc(var(--switcher-width) - var(--arrow-offset));
  --x4: var(--switcher-width);
  --x5: var(--arrow-offset);
  --x6: 0;
}`}
        </HL>
      </p>
    </div>
  );
}

function HL({ children, code }: React.PropsWithChildren<{ code?: boolean }>) {
  return <span className={cn('highlight', { code })}>{children}</span>;
}

function CodepenLink({ children }: React.PropsWithChildren) {
  return (
    <a href="https://codepen.io/suez/pen/RpNXOR" target="_blank">
      {children}
    </a>
  );
}

export default Texterino;
