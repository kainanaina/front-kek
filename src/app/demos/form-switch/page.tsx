import { generateDemoMetadata } from 'src/utils';
import Demo from './demo';
import Texterino from './texterino';

const slug = 'form-switch';

export const metadata = generateDemoMetadata(slug);

const FormSwitchPage = () => {
  return (
    <>
      <Demo />
      <Texterino slug={slug} />
    </>
  );
};

export default FormSwitchPage;
