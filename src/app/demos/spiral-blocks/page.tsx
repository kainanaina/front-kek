import { generateDemoMetadata } from 'src/utils';
import Demo from './demo';
import Texterino from './texterino';

const slug = 'spiral-blocks';

export const metadata = generateDemoMetadata(slug);

export default function SpiralBlocksPage() {
  return (
    <>
      <Demo />
      <Texterino slug={slug} />
    </>
  );
}
