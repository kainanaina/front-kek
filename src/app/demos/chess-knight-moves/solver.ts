import { rangeFromZero } from "src/utils";

type PossibleMoves = number[][];

// gets all possible moves for a given cell considering the board constraints
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

/* given possible moves for particular cell, it filters out moves that are already taken
and sorts the remaining moves by the number of possible moves each target cell has
this allows us to minimize the amount of possible "ophan cells" when we are running the solver
without it solver pretty much dies on 8x8 board most of the time, with it it can do 10x10 and even more sometimes
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

export function stringifyPosition(x: number, y: number) {
  return `${x}-${y}`;
}

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
  let x = initialX;
  let y = initialY;

  while (takenMoves.length < numOfCells) {
    const position = stringifyPosition(x, y);

    const possibleMoves = getFilteredMoves(cellsMoves[position], takenMoves, cellsMoves);

    let [move, ...restMoves] = possibleMoves;
    let lastAlternativeMove;

    /* if there are no possible moves for the current cell,
    we are removing last item from pastAlternativeMoves and assigning it to lastAlternativeMove
    */
    while (!move && (lastAlternativeMove = pastAlternativeMoves.pop())) {
      takenMoves.pop(); // removing last taken move from our solution, since it was a dead end

      // treat lastAlternativeMove as a new destination cell and try to find possible moves for it
      const lastAltMoves = getFilteredMoves(lastAlternativeMove, takenMoves, cellsMoves);

      // if lastAlternativeMove has possible moves, then we are continuing our top-level while loop as usual
      // but if it doesn't, this while loop with pop repeats again and again until we can find an alternative cell in history with possible moves
      if (lastAltMoves.length) {
        // wrapping it in parentheses allows us to assign it to let variables with destructuring, without creating new intermediate let variables
        ([move, ...restMoves] = lastAltMoves);
      }
    }

    // if we arrive to this point and move is undefined, it means that we have no more possible moves
    if (!move) {
      console.log('no solution');

      return rangeFromZero(numOfCells).map(() => {
        return stringifyPosition(-1, -1); // placeholder values for no solution
      });
    }

    x = move[0];
    y = move[1];
    takenMoves.push(stringifyPosition(x, y));
    pastAlternativeMoves.push(restMoves);
  }

  console.log('Chess Knight Moves solver time taken', performance.now() - t1);

  return takenMoves;
};