import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

export default function Disclaimers() {
  return (
    <Accordion sx={{ backgroundColor: 'var(--color-gray)' }}>
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
            tailwind, or css-in-js tied to specific UI library (like Mantine),
            or at the very least SCSS modules. But since it&apos;s a personal
            website, which is also meant to be a source of educational
            tutorials, I decided to go with SCSS BEM classes, since they are
            100% compatible with codepen, which makes changing/copypasting code
            very simple. Also SCSS got broadest appeal, since it doesn&apos;t
            requires any specific library knowledge to read the code. But I am
            not promising that my styles will be easy to understand :)
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary>
            <h3>About responsiveness, a11y and practical usability</h3>
          </AccordionSummary>
          <AccordionDetails>
            This website is meant to showcase various experiments with fun
            animations and relatively new CSS features, but it is not intended
            to be a sourse of production-ready components with mobile
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
            front-end, I decided to add variety of comments where it might seem
            useful.
          </AccordionDetails>
        </Accordion>
      </AccordionDetails>
    </Accordion>
  );
}
