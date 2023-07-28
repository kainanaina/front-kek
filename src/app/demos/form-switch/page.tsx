import { generateDemoMetadata } from 'src/utils';
import { DemoContainer } from 'src/components';
import Demo from './demo';
import Texterino from './texterino';

const slug = 'form-switch';

export const metadata = generateDemoMetadata(slug);

const FormSwitchPage = () => {
  return (
    <>
      <DemoContainer>
        <p>Click on SIGN UP button to trigger animation</p>
        <Demo />
        <DemoContainer.Callout />
      </DemoContainer>
      <Texterino slug={slug} />
    </>
  );
};

export default FormSwitchPage;
