import Link from 'next/link';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { CODEPEN_PROFILE, TWITTER } from 'src/constants';
import PrismHighligher from './PrismHighligher';

function Texterino({ children }: React.PropsWithChildren) {
  return (
    <>
      <PrismHighligher />
      <div className="container texterino">{children}</div>
    </>
  );
}

Texterino.Disclaimers = function Disclaimers() {
  return (
    <Accordion
      sx={{
        backgroundColor: 'var(--color-gray)',
        marginBottom: '20px !important',
      }}
    >
      <AccordionSummary>
        <h2>Disclaimers</h2>
      </AccordionSummary>
      <AccordionDetails>
        <Accordion>
          <AccordionSummary>
            <h3>About CSS</h3>
          </AccordionSummary>
          <AccordionDetails>
            If this was a job project, then I would be using something like
            tailwind, or css-in-js tied to a specific UI library (like Mantine),
            or at the very least SCSS modules. But since it&apos;s a personal
            website, which is also meant to be a source of educational
            tutorials, I decided to go with SCSS BEM classes, since they are
            100% compatible with codepen, which makes changing/copypasting code
            very simple. Also, SCSS got the broadest appeal, since it
            doesn&apos;t require any specific library knowledge to read the
            code. But I am not promising that my styles will be easy to
            understand :)
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary>
            <h3>About responsiveness, a11y and practical usability</h3>
          </AccordionSummary>
          <AccordionDetails>
            This website is meant to showcase various experiments with fun
            animations and relatively new CSS features, but it is not intended
            to be a source of production-ready components with mobile
            responsiveness and proper accessibility. If you can easily
            copy-paste some of these components into your app, then I am happy
            for you, but generally don&apos;t expect same level of DX/UX polish
            similar to popular libraries with huge support behind them.
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary>
            <h3>About code comments</h3>
          </AccordionSummary>
          <AccordionDetails>
            At my job I try to evade heavily commenting my code, but since this
            website is meant to be the source of learning materials about UI
            front-end, I decided to add a variety of comments where it might
            seem useful.
          </AccordionDetails>
        </Accordion>
      </AccordionDetails>
    </Accordion>
  );
};

interface CodeExamplesProps {
  slug: string;
  codepenId?: string;
  links?: { filename: string; label?: string }[];
}

function CodeExamples({ slug, codepenId, links }: CodeExamplesProps) {
  return (
    <>
      <h2>Show me the code</h2>
      <p>
        Tutorials will mostly be covering a general overview of the
        implementation with a few code embeds here and there. Full code with
        comments is always available on github (linked below)
        {codepenId ? ' and codepen' : ''}.
      </p>
      {codepenId && (
        <p>
          Also, if reading SCSS code with parent references nesting is too much
          trouble, you can always check compiled CSS in codepen to see the final
          classes and styles.
        </p>
      )}

      <p>
        <CodeExamples.DemoCodeLink slug={slug}>
          demo.tsx
        </CodeExamples.DemoCodeLink>
      </p>
      <p>
        <CodeExamples.StylesLink slug={slug}>
          styles.scss
        </CodeExamples.StylesLink>
      </p>

      {links?.map(({ filename, label }) => (
        <p key={filename}>
          <a href={`${getRouteBase(slug)}${filename}`} target="_blank">
            {label || filename}
          </a>
        </p>
      ))}

      {codepenId && (
        <iframe
          style={{ width: '100%', height: 600 }}
          title="Demo Codepen Embed"
          src={`${CODEPEN_PROFILE}/embed/${codepenId}`}
          loading="lazy"
          allowFullScreen
        >
          See the Pen
        </iframe>
      )}
    </>
  );
}

function getRouteBase(demoSlug: string) {
  return `https://github.com/kainanaina/front-kek/blob/main/src/app/demos/${demoSlug}/`;
}

CodeExamples.DemoCodeLink = function DemoCodeLink({
  children,
  slug,
}: React.PropsWithChildren<CodeExamplesProps>) {
  return (
    <a href={`${getRouteBase(slug)}demo.tsx`} target="_blank">
      {children}
    </a>
  );
};

CodeExamples.StylesLink = function StylesLink({
  children,
  slug,
}: React.PropsWithChildren<CodeExamplesProps>) {
  return (
    <a href={`${getRouteBase(slug)}styles.scss`} target="_blank">
      {children}
    </a>
  );
};

Texterino.CodeExamples = CodeExamples;

Texterino.Begging = function Begging() {
  return (
    <>
      <p>
        Please{' '}
        <a href={TWITTER} target="_blank">
          follow me on twitter
        </a>{' '}
        for my latest demos, tutorials and cooked takes.
      </p>
    </>
  );
};

Texterino.HL = function HL({ children }: React.PropsWithChildren) {
  return <span className="highlight">{children}</span>;
};

export default Texterino;
