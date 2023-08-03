import { DemoContainer } from 'src/components';
import './styles.scss';

enum Direction {
  Left = 'left',
  Right = 'right',
  Top = 'top',
  Bottom = 'bottom',
}

type HorizontalDirection = Direction.Left | Direction.Right;
type VerticalDirection = Direction.Top | Direction.Bottom;
type DirectionValue = -1 | 0 | 1;
type DirectionPair = [DirectionValue, DirectionValue];
type Position = [number, number, DirectionPair];

const DIRECTIONS_MAPPING: Record<`${Direction}`, DirectionPair> = {
  left: [-1, 0],
  right: [1, 0],
  top: [0, -1],
  bottom: [0, 1],
};
const NUM_OF_DIRECTIONS = Object.keys(DIRECTIONS_MAPPING).length;

type DirectionProp =
  | [HorizontalDirection, VerticalDirection]
  | [VerticalDirection, HorizontalDirection];

interface Props {
  gridSize?: number;
  boxSize?: number;
  animationTime?: number;
  initialDirections?:
    | [HorizontalDirection, VerticalDirection]
    | [VerticalDirection, HorizontalDirection];
}

function SpiralBlocks({
  gridSize = 11,
  boxSize = 50,
  animationTime = 0.3,
  initialDirections = [Direction.Bottom, Direction.Left],
}: Props) {
  const positions = calculatePositions(gridSize ** 2, initialDirections);

  return (
    <div
      className="demospiral"
      style={
        {
          '--box-size': `${boxSize}px`,
          '--anim-time': `${animationTime}s`,
        } as React.CSSProperties
      }
    >
      {positions.map((pos, i) => {
        const [x, y, direction] = pos;

        return (
          <div
            key={i}
            className="demospiral__block"
            style={{
              left: `${x * 100}%`,
              top: `${y * 100}%`,
            }}
          >
            <div
              className="demospiral__block-inner"
              style={{
                transform: `rotateY(${direction[0] * 90}deg) rotateX(${
                  direction[1] * -90
                }deg)`,
                transformOrigin: getTransformOrigin(direction),
                animationDelay: `${i * 0.1}s`,
              }}
            >
              {i + 1}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function flipDirection(directionValues: [DirectionValue, DirectionValue]) {
  return [directionValues[0] * -1, directionValues[1] * -1] as DirectionPair;
}

function calculatePositions(
  totalSize: number,
  direction: DirectionProp = [Direction.Top, Direction.Right]
) {
  const direction0 = DIRECTIONS_MAPPING[direction[0]];
  const direction1 = DIRECTIONS_MAPPING[direction[1]];
  const directions: DirectionPair[] = [
    direction0,
    direction1,
    flipDirection(direction0),
    flipDirection(direction1),
  ];
  const result: Position[] = [[0, 0, direction0]];

  let directionCounter = 0;
  let directionStep = 0;
  let stepsPerDirection = 1;

  for (let i = 1; i < totalSize; i++) {
    const activeDirection = directions[directionCounter % NUM_OF_DIRECTIONS];
    const [x, y] = result[i - 1];

    result.push([
      x + activeDirection[0],
      y + activeDirection[1],
      activeDirection,
    ]);

    directionStep++;

    if (directionStep === stepsPerDirection) {
      directionCounter++;
      directionStep = 0;

      if (directionCounter % 2 === 0) {
        stepsPerDirection++;
      }
    }
  }

  return result;
}

function getTransformOriginForValue(val: DirectionValue) {
  if (val === 0) return '50%';

  return val === 1 ? '0%' : '100%';
}

function getTransformOrigin(pos: DirectionPair) {
  return `${getTransformOriginForValue(pos[0])} ${getTransformOriginForValue(
    pos[1]
  )}`;
}

export default function Demo() {
  return <DemoContainer component={SpiralBlocks} />;
}
