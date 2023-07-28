import { DemoContainer } from 'src/components';
import { generateDemoMetadata } from 'src/utils';
import Demo from './demo';
import Texterino from './texterino';

const slug = 'twitter-x-logo';

export const metadata = generateDemoMetadata(slug);

export default function TwitterXLogoPage() {
  return (
    <>
      <DemoContainer style={{ overflow: 'hidden' }}>
        <Demo />
        <DemoContainer.Callout style={{ color: '#fff' }} />
      </DemoContainer>
      <Texterino slug={slug} />
    </>
  );
}
