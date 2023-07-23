import { generateMetadata } from 'src/utils';
import { DemoContainer } from 'src/components';
import { DEMOS } from 'src/constants';
import Demo from './demo';
import Texterino from './texterino';

const demo = DEMOS.find((d) => d.slug === 'form-switch');

export const metadata = generateMetadata({
  title: demo?.title,
  seoPreview: demo?.seoPreview,
});

const FormSwitchPage = () => {
  return (
    <>
      <DemoContainer>
        <p>Click on SIGN UP button to trigger animation</p>
        <Demo />
        <p>And don&apos;t forget to check the tutorial below!</p>
      </DemoContainer>
      <Texterino />
    </>
  );
};

export default FormSwitchPage;
