import { Texterino } from 'src/components';

interface Props {
  slug: string;
}

export default function Text({ slug }: Props) {
  return (
    <Texterino>
      <Texterino.Disclaimers />
      <h1>Chess Knight Moves Algorithm Animation Tutorial</h1>

      <h2>Algo? How dare you?!</h2>
      <p>
        Generally, I&apos;m not an algos type of guy and dislike leetcode stuff,
        but it was one of the rare interview challenges that seemed useful from
        a frontend perspective. It essentially contained 2 parts:
      </p>
      <ol>
        <li>
          Given x*y size of the board and starting knight position, write an
          algorithm that tries to find all sequential non-repeating moves for
          chess knight on a board, until you&apos;ll traverse the whole board.
        </li>
        <li>
          Visualize and animate the output of the algo with react (sort of).
        </li>
      </ol>
      <p>
        The fun part is that I didn&apos;t managed to solve this problem
        correctly in time during the interview, because I made a critical
        mistake of trying to write the code in a browser console, which led me
        to some really stupid mistakes related to array splice/pop methods (they
        weren&apos;t throwing errors, but doing some silly stuff instead), that
        would be easily highlighted by TS or any linter. And as you can imagine,
        trying to debug algo that may be doing 10000s of iterations in a browser
        console is not a fun experience, especially when a problem is in some
        nested while loop. But I liked the challenge and decided to finish and
        polish it later in my free time, so here we are!
      </p>
      <Texterino.CodeExamples slug={slug} links={[{ filename: 'solver.ts' }]} />
    </Texterino>
  );
}
