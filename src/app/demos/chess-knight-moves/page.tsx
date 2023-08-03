import { generateDemoMetadata } from 'src/utils';
import Demo from './demo';

const slug = 'chess-knight-moves';

export const metadata = generateDemoMetadata(slug);

export default function ChessKnightMovesPage() {
  return (
    <>
      <Demo />
    </>
  );
}
