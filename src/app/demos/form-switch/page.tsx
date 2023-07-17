import { DemoContainer } from 'src/components';
import Demo from './demo';
import Texterino from './texterino';

const FormSwitchPage = () => {
  return (
    <>
      <DemoContainer>
        <p>Click on SIGN UP button to trigger animation</p>
        <Demo />
      </DemoContainer>
      <Texterino />
    </>
  );
};

export default FormSwitchPage;
