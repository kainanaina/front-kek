import { DemoContainer } from 'src/components';
import { generateMetadata } from 'src/utils';
import { DEMOS } from 'src/constants';
import Demo from './demo';
import Texterino from './texterino';

const slug = 'twitter-x-logo';
const demo = DEMOS.find((d) => d.slug === slug);

export const metadata = generateMetadata({
  title: demo?.title,
  seoPreview: demo?.seoPreview,
});

export default function TwitterXLogoPage() {
  return (
    <>
      <DemoContainer style={{ overflow: 'hidden' }}>
        <Demo />
      </DemoContainer>
      <Texterino slug={slug} />
    </>
  );
}
