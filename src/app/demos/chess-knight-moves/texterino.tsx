import { Texterino } from 'src/components';

const { HL } = Texterino;

interface Props {
  slug: string;
}

const solverHelpersCode = `
type PossibleMoves = number[][];

// gets all possible moves for a given cell while considering the board constraints
function getPossibleMoves(
  h: number,
  v: number,
  x: number,
  y: number,
): PossibleMoves {
  const result = [];

  const left = x - 2;
  const right = x + 2;
  const top = y - 2;
  const bottom = y + 2;

  if (left >= 0) {
    if (y - 1 >= 0) {
      result.push([left, y - 1]);
    }
    if (y + 1 <= v - 1) {
      result.push([left, y + 1]);
    }
  }

  if (right <= h - 1) {
    if (y - 1 >= 0) {
      result.push([right, y - 1]);
    }
    if (y + 1 <= v - 1) {
      result.push([right, y + 1]);
    }
  }

  if (top >= 0) {
    if (x - 1 >= 0) {
      result.push([x - 1, top]);
    }
    if (x + 1 <= h - 1) {
      result.push([x + 1, top]);
    }
  }

  if (bottom <= v - 1) {
    if (x - 1 >= 0) {
      result.push([x - 1, bottom]);
    }
    if (x + 1 <= h - 1) {
      result.push([x + 1, bottom]);
    }
  }

  return result;
};

/* given possible moves for a particular cell, it filters out moves that are already taken
and sorts in ascending order the remaining moves by the number of possible moves each target cell has
this allows us to minimize the amount of possible "ophan cells" when we are running the solver
without it solver pretty much dies on 8x8 board most of the time, with it we can do 10x10 and even more sometimes
*/
function getFilteredMoves(
  moves: PossibleMoves,
  takenMovesPositions: string[],
  cellsMoves: Record<string, PossibleMoves>,
) {
  return moves.filter((m) => {
    return !takenMovesPositions.includes(stringifyPosition(m[0], m[1]));
  }).sort((a, b) => {
    return cellsMoves[stringifyPosition(a[0], a[1])]?.length - cellsMoves[stringifyPosition(b[0], b[1])]?.length;
  });
};

// creates mapping of all possible moves for each cell
const getCellsMoves = (h: number, v: number) => {
  return rangeFromZero(h * v).reduce((acc, cellIndex) => {
    const cellX = cellIndex % h;
    const cellY = Math.floor(cellIndex / h);
    const position = stringifyPosition(cellX, cellY);

    acc[position] = getPossibleMoves(h, v, cellX, cellY);

    return acc;
  }, {} as Record<string, PossibleMoves>);
};

// this simplifies usage of object mapping, where every cell can be represented as x-y string
export function stringifyPosition(x: number, y: number) {
  return \`$\{x}-$\{y}\`;
}
`;

const solverCode = `
export type Solution = string[];

export function solveMoves(
  h: number, // horizontal size of the board
  v: number, // vertical size
  initialX: number, // initial X position of the knight
  initialY: number, // initial Y position
): Solution {
  const t1 = performance.now();

  const cellsMoves = getCellsMoves(h, v);

  const takenMoves = [stringifyPosition(initialX, initialY)];
  const pastAlternativeMoves: PossibleMoves[] = [];
  const numOfCells = h * v;

  let move = [initialX, initialY];

  while (takenMoves.length < numOfCells) {
    const position = stringifyPosition(move[0], move[1]);

    const possibleMoves = getFilteredMoves(cellsMoves[position], takenMoves, cellsMoves);

    move = possibleMoves[0];
    let restMoves = possibleMoves.slice(1);
    let lastAlternativeMoves;

    /* if there are no possible moves for the current cell,
    we are removing the last item from pastAlternativeMoves and assigning it to lastAlternativeMoves
    */
    while (!move && (lastAlternativeMoves = pastAlternativeMoves.pop())) {
      takenMoves.pop(); // removing last taken move from our solution, since it was a dead end

      // if lastAlternativeMoves has possible moves, then we are continuing our top-level while loop as usual
      // but if it doesn't, this while loop with pop repeats again and again until we can find an alternative cell in history with possible moves
      if (lastAlternativeMoves?.length) {
        // wrapping it in parentheses allows us to assign it to let variables with destructuring, without needing to create new intermediate let variables
        ([move, ...restMoves] = lastAlternativeMoves);
      }
    }

    // if we arrive to this point and "move" is undefined, it means that we have no more possible moves
    if (!move) {
      console.log('no solution');

      return rangeFromZero(numOfCells).map(() => {
        return stringifyPosition(-1, -1); // placeholder values for no solution
      });
    }

    takenMoves.push(stringifyPosition(move[0], move[1]));
    pastAlternativeMoves.push(restMoves);
  }

  console.log('Chess Knight Moves solver time taken', performance.now() - t1);

  return takenMoves;
};
`;

const reactCode = `
export interface Props {
  boxSize?: number;
  xSize?: number;
  ySize?: number;
  startX?: number;
  startY?: number;
  stepAnimationTime?: number;
}

function ChessKnightMovesDemo({
  boxSize = 60,
  xSize = 6,
  ySize = 6,
  startX = 3,
  startY = 3,
  stepAnimationTime = 0.2,
}: Props) {
  const [isMoving, setIsMoving] = useState(false);
  const [moves, setMoves] = useState<Solution>([]);
  const [knightX, setKnightX] = useState(startX - 1);
  const [knightY, setKnightY] = useState(startY - 1);
  const startDelayRef = useRef<NodeJS.Timeout>();
  const intervalRef = useRef<NodeJS.Timeout>();

  const moveKnight = (solution: Solution) => {
    let index = 1; // initial knight position is 0, so in animation we need to start at 1

    // initial interval that changes knight position every stepAnimationTime seconds until it reaches the end
    intervalRef.current = setInterval(() => {
      const [x, y] = solution[index].split('-').map(Number);

      setKnightX(x);
      setKnightY(y);

      index += 1;

      if (index >= solution.length) {
        clearInterval(intervalRef.current);
        setIsMoving(false);
      }
    }, stepAnimationTime * 1000);
  };

  // run once on mount, which also reruns on component key change reset
  useEffect(() => {
    const solution = solveMoves(xSize, ySize, knightX, knightY);

    startDelayRef.current = setTimeout(() => {
      setIsMoving(true);
      setMoves(solution);
      moveKnight(solution);
    }, 1000);

    // clear timeouts/intervals on component unmount in case it's still running. Also clear on key change reset
    return () => {
      if (startDelayRef.current) {
        clearTimeout(startDelayRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const styleObj = {
    '--box-size': \`$\{boxSize}px\`,
    '--x-size': xSize,
    '--y-size': ySize,
    '--knight-x': knightX,
    '--knight-y': knightY,
    '--step-at': \`$\{stepAnimationTime}s\`,
  } as React.CSSProperties;

  return (
    <div className={cn('chess', { 's--moving': isMoving })} style={styleObj}>
      <img
        src={ChessKnightSVG.src}
        alt="Chess Knight"
        className="chess__knight"
      />
      {/* render borderless chess cells */}
      {rangeFromZero(xSize * ySize).map((i) => {
        const x = i % xSize;
        const y = Math.floor(i / xSize);
        const position = stringifyPosition(x, y);
        const moveIndex = moves.findIndex((move) => position === move);

        return (
          <div
            key={position}
            className="chess__box"
            style={{
              left: x * boxSize,
              top: y * boxSize,
            }}
          >
            {moveIndex !== -1 && (
              <p style={{ '--move-index': moveIndex } as React.CSSProperties}>
                {moveIndex}
              </p>
            )}
          </div>
        );
      })}
      {/* render vertical board borders */}
      {rangeFromZero(xSize + 1).map((i) => (
        <div
          key={i}
          className="chess__line chess__line--y"
          style={
            {
              '--x': i,
              '--delay': getBorderDelayIndex(i, xSize),
            } as React.CSSProperties
          }
        />
      ))}
      {/* render horizontal board borders */}
      {rangeFromZero(ySize + 1).map((i) => (
        <div
          key={i}
          className="chess__line chess__line--x"
          style={
            {
              '--y': i,
              '--delay': getBorderDelayIndex(i, ySize),
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

// borders in the middle getting lowest delay, borders on the edges getting highest delay
function getBorderDelayIndex(index: number, size: number) {
  return Math.abs(Math.round(size) / 2 - index);
}
`;

const stylesCode = `
.chess {
  $parentRef: &;

  // default values, overridden by react component
  --box-size: 60px;
  --x-size: 6;
  --y-size: 6;
  --knight-x: 3;
  --knight-y: 3;
  --step-at: 0.2s;

  display: flex;
  flex-shrink: 0;
  width: calc(var(--box-size) * var(--x-size));
  height: calc(var(--box-size) * var(--y-size));

  @mixin isMoving {
    #{$parentRef}.s--moving & {
      @content;
    }
  }

  @keyframes fadeInKnight {
    to {
      opacity: 0.5;
    }
  }

  &__knight {
    position: absolute;
    left: 0;
    top: 0;
    width: var(--box-size);
    height: var(--box-size);
    will-change: transform, opacity;
    transition: transform var(--step-at), opacity 0.3s;
    transform: translate(
      calc(var(--knight-x) * var(--box-size)),
      calc(var(--knight-y) * var(--box-size))
    );
    opacity: 0;
    animation: fadeInKnight 1s 0.5s forwards;

    @include isMoving {
      opacity: 1;
    }
  }

  &__box {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--box-size);
    height: var(--box-size);
    // border: 1px solid #333;
    font-size: 20px;

    @keyframes fadeIn {
      to {
        opacity: 1;
      }
    }

    p {
      opacity: 0;
      will-change: opacity;
      animation: fadeIn var(--step-at) calc(var(--step-at) * calc(var(--move-index) + 1)) forwards;
    }
  }

  @keyframes animateBorder {
    to {
      transform: scale(1, 1);
    }
  }

  &__line {
    position: absolute;
    background: #333;
    will-change: transform;
    animation: animateBorder 1s calc(0.2s + var(--delay, 0) * 0.2s) forwards;

    &--x {
      left: 0;
      top: calc(var(--y, 0) * var(--box-size));
      width: 100%;
      height: 1px;
      transform: scale(0, 1);
    }

    &--y {
      left: calc(var(--x, 0) * var(--box-size));
      top: 0;
      width: 1px;
      height: 100%;
      transform: scale(1, 0);
    }
  }
}
`;

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

      <Texterino.CodeExamples
        slug={slug}
        codepenId="YzRMdvY"
        links={[{ filename: 'solver.ts' }]}
      />

      <h2>Algo Solver</h2>
      <p>
        So, you are given a chess board, which is usually at least 5x5 size, and
        knight positioned somewhere on it, and you need to move that knight
        sequentially all around the board until you&apos;ll visit all of the
        cells, without repeating any moves. And in case you forgot, knight moves
        in L shape (2 steps in one direction and then 1 step in perpendicular
        direction). How hard it can be?
      </p>
      <p>
        Well, if you are interested in a ultra-nerdy coverage of this topic,
        then you can always check this wiki page called{' '}
        <a href="https://en.wikipedia.org/wiki/Knight%27s_tour" target="_blank">
          Knight&apos;s tour
        </a>
        , but here I will be showing you my smooth brain solution (aka CSS guy
        tries to do algo stuff).
      </p>
      <p>So here is the rough overview of how the algorithm solver works:</p>
      <ol>
        <li>
          For all cells, store all possible moves than can be made from it in a
          mapping, so we won&apos;t need to figure out that part on every step.
        </li>
        <li>
          Create 2 arrays, one for <HL>taken moves</HL> (initially populated
          with starting knight position), and one empty for{' '}
          <HL>past alternative moves</HL>.
        </li>
        <li>
          Run while loop until <HL>taken moves</HL> array length won&apos;t
          become equal to the total size of the board.
        </li>
        <li>
          Inside that loop get available moves for current knight position,
          filter out already taken moves and sort remaining ones by the number
          of available moves in ascending order.
        </li>
        <li>
          From that sorted listed of moves, first one will become our new{' '}
          <HL>taken move</HL>, that will go into <HL>taken moves</HL> array. It
          will allow us to priotize cells with the highest tendency of becoming{' '}
          <HL>orphaned cells</HL> (which boosts performance by 10-1000x
          depending on a size of the board). Rest of the sorted moves will be
          added to <HL>past alternative moves</HL> array.
        </li>
        <li>
          In case of miracle, this while loop will repeat until the end and the
          problem will solved, which returns array of <HL>taken moves</HL>. But
          most of the time it will be hitting a dead end, and that&apos;s where
          we&apos;ll need to add backtracking logic that involves{' '}
          <HL>past alternative moves</HL>.
        </li>
        <li>
          So, if we are retrieving sorted&filtered moves for current position
          and it&apos;s empty, then we need to remove last move from{' '}
          <HL>taken moves</HL> array and also pop (aka remove and store in
          variable) last alternative moves from our second array. These
          alternative moves will now become our new set of sorted&filtered
          moves, on which we&apos;ll repeat this nested while loop, until we
          have a move available, with which we can continue top-level while
          loop.
        </li>
        <li>
          In case if our nested backtracking while loop drilled all the way to
          the top and our <HL>past alternative moves</HL> are empty and next
          move is undefined, then it means we couldn&apos;t find a solution and
          it&apos;s time to exit top level while loop and return{' '}
          <HL>no solution</HL> result.
        </li>
      </ol>

      <p>
        Let&apos;s go over the code. First we&apos;ll start with helper
        functions:
      </p>

      <pre>
        <code className="lang-ts">{solverHelpersCode}</code>
      </pre>

      <p>And here is the solver code:</p>

      <pre>
        <code className="lang-ts">{solverCode}</code>
      </pre>

      <p>
        In the end we gonna receive array of positions (like{' '}
        <HL>{'["2-2", "0-1", ...]'}</HL>) from the solver, that we can use to
        visualize the movement of chess knight on a board.
      </p>

      <h2>React and Styles</h2>

      <p>Here is how it works:</p>

      <ol>
        <li>
          On component mount we are running <HL>useEffect</HL> which runs solver
          once, saves result in a state and initiates animation interval with a
          short delay.
        </li>
        <li>
          Solution saved in state allows us to render the chess board and
          position the knight on it. Cells borders are drawn as separate lines
          (so I could animate their appearence).
        </li>
        <li>
          Once animation interval starts, it updates knight position on every
          step, until it reached the end of the solution, which also stops the
          interval.
        </li>
        <li>
          If component unmounts (which can happen on page navigation or
          component key change), then interval is killed via{' '}
          <HL>useEffect return function</HL>.
        </li>
        <li>
          Updating component params from <HL>DemoContainer</HL> changes its key,
          which <HL>resets</HL> component state and reruns <HL>useEffect</HL>,
          which also includes rerunning of all appearence CSS animations.
        </li>
      </ol>

      <p>React code:</p>

      <pre>
        <code className="lang-tsx">{reactCode}</code>
      </pre>

      <p>And styles:</p>

      <pre>
        <code className="lang-scss">{stylesCode}</code>
      </pre>

      <h2>Additional notes:</h2>

      <ul>
        <li>
          This demo can easily freeze your browser tab on certain combinations
          of params. In current playground I&apos;m setting boundries for board
          size not to be over 10x10, because values above that can easily be
          unsolvable for certain starting positions with this algo. But I
          definitely saw some lucky solutions for 12x12 boards few times, so
          feel free to experiment with it yourself.
        </li>
        <li>
          You can evade tab freezes for unsolvable/hard combinations by adding
          custom <HL>steps counter</HL> logic to solver code, that will be
          counting number of while loops steps taken and exiting the loop if
          certain value is reached, like 1 million or more, depending on your
          machine.
        </li>
      </ul>

      <Texterino.Begging />
    </Texterino>
  );
}
