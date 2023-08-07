import { generateDemoMetadata } from 'src/utils';
import Demo from './demo';
import Text from './texterino';

const slug = 'chess-knight-moves';

export const metadata = generateDemoMetadata(slug);

export default function ChessKnightMovesPage() {
  return (
    <>
      <Demo />
      <Text slug={slug} />
    </>
  );
}
