'use client';
import { Fragment, useState, useEffect, useRef } from 'react';
import cn from 'classnames';
import { DemoContainer } from 'src/components';
import { rangeFromZero } from 'src/utils';
import { solveMoves, stringifyPosition, Solution } from './solver';
import ChessKnightSVG from './chess-knight.svg';
import './styles.scss';

export interface Props {
  boxSize?: number;
  xSize?: number;
  ySize?: number;
  startX?: number;
  startY?: number;
  stepAnimationTime?: number;
}

function ChessKnightMovesDemo({
  boxSize = 100,
  xSize = 5,
  ySize = 5,
  startX = 3,
  startY = 3,
  stepAnimationTime = 0.3,
}: Props) {
  const [isMoving, setIsMoving] = useState(false);
  const [moves, setMoves] = useState<Solution>([]);
  const [knightX, setKnightX] = useState(startX - 1);
  const [knightY, setKnightY] = useState(startY - 1);
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

    setIsMoving(true);
    setMoves(solution);
    moveKnight(solution);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current); // clear interval on component unmount in case it's still running. Also clear on key change reset
      }
    };
  }, []);

  const styleObj = {
    '--box-size': `${boxSize}px`,
    '--x-size': xSize,
    '--y-size': ySize,
    '--knight-x': knightX,
    '--knight-y': knightY,
    '--step-at': `${stepAnimationTime}s`,
  } as React.CSSProperties;

  return (
    <div className={cn('chess', { 's--moving': isMoving })} style={styleObj}>
      <img
        src={ChessKnightSVG.src}
        alt="Chess Knight"
        className="chess__knight"
      />
      {rangeFromZero(xSize * ySize).map((i) => {
        const x = i % xSize;
        const y = Math.floor(i / xSize);
        const position = stringifyPosition(x, y);
        const moveIndex = moves.findIndex((move) => position === move);

        return (
          <div
            key={`${x}-${y}`}
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
    </div>
  );
}

// not related to core demo code

const initialProps: Props = {
  boxSize: 100,
  xSize: 6,
  ySize: 6,
  startX: 3,
  startY: 3,
  stepAnimationTime: 0.2,
};

export default function Demo() {
  return (
    <>
      <DemoContainer
        component={ChessKnightMovesDemo}
        initialProps={initialProps as Record<string, number>}
        paramsConfig={{
          boxSize: { label: 'Box Size (px)', min: 10 },
          xSize: { label: 'X Board Size', min: 5, max: 10 },
          ySize: { label: 'Y Board Size', min: 5, max: 10 },
          startX: { label: 'Start X Position', min: 1, max: 'xSize' },
          startY: { label: 'Start Y Position', min: 1, max: 'ySize' },
          stepAnimationTime: {
            label: 'Animation Step Time (S)',
            min: 0.05,
            max: 2,
            allowDecimals: true,
          },
        }}
        paramsAutoopenDelay={7400}
      ></DemoContainer>
    </>
  );
}
