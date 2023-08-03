import { rangeFromZero } from "src/utils";

type PossibleMoves = number[][];

function getPossibleMoves(
  h: number,
  v: number,
  i: number,
  j: number,
): PossibleMoves {
  const result = [];

  const left = i - 2;
  const right = i + 2;
  const top = j - 2;
  const bottom = j + 2;

  if (left >= 0) {
    if (j - 1 >= 0) {
      result.push([left, j - 1]);
    }
    if (j + 1 <= v - 1) {
      result.push([left, j + 1]);
    }
  }
  if (right <= h - 1) {
    if (j - 1 >= 0) {
      result.push([right, j - 1]);
    }
    if (j + 1 <= v - 1) {
      result.push([right, j + 1]);
    }
  }
  if (top >= 0) {
    if (i - 1 >= 0) {
      result.push([i - 1, top]);
    }
    if (i + 1 <= h - 1) {
      result.push([i + 1, top]);
    }
  }
  if (bottom <= v - 1) {
    if (i - 1 >= 0) {
      result.push([i - 1, bottom]);
    }
    if (i + 1 <= h - 1) {
      result.push([i + 1, bottom]);
    }
  }

  return result;
};

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

const getCellMoves = (h: number, v: number) => {
  return rangeFromZero(h * v).reduce((acc, cellIndex) => {
    const cellI = cellIndex % h;
    const cellJ = Math.floor(cellIndex / h);
    const position = stringifyPosition(cellI, cellJ);

    acc[position] = getPossibleMoves(h, v, cellI, cellJ);

    return acc;
  }, {} as Record<string, PossibleMoves>);
};

export function stringifyPosition(i: number, j: number) {
  return `${i}-${j}`;
}

export type Solution = string[];

export function solveMoves(
  h: number,
  v: number,
  initialI: number,
  initialJ: number,
): Solution {
  const t1 = performance.now();

  const cellsMoves = getCellMoves(h, v);

  const takenMoves = [stringifyPosition(initialI, initialJ)];
  const pastAlternativeMoves: PossibleMoves[] = [];
  const numOfCells = h * v;
  let i = initialI;
  let j = initialJ;

  while (takenMoves.length < numOfCells) {
    const position = stringifyPosition(i, j);

    const possibleMoves = getFilteredMoves(cellsMoves[position], takenMoves, cellsMoves);

    let [move, ...restMoves] = possibleMoves;
    let lastAlternativeMove;

    while (!move && (lastAlternativeMove = pastAlternativeMoves.pop())) {
      takenMoves.pop();

      const lastAltMoves = getFilteredMoves(lastAlternativeMove, takenMoves, cellsMoves);

      if (lastAltMoves.length) {
        ([move, ...restMoves] = lastAltMoves);
      }
    }

    if (!move) {
      console.log('no solution');

      return rangeFromZero(numOfCells).map(() => {
        return stringifyPosition(-1, -1);
      });
    }

    i = move[0];
    j = move[1];
    takenMoves.push(stringifyPosition(i, j));
    pastAlternativeMoves.push(restMoves);
  }

  console.log('Chess Knight Moves solver time taken', performance.now() - t1);

  return takenMoves;
};