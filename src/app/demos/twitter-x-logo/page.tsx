import { generateDemoMetadata } from 'src/utils';
import Demo from './demo';
import Texterino from './texterino';

const slug = 'twitter-x-logo';

export const metadata = generateDemoMetadata(slug);

export default function TwitterXLogoPage() {
  return (
    <>
      <Demo />
      <Texterino slug={slug} />
    </>
  );
}
