import { DemoContainer } from 'src/components';
import Demo from './demo';
import Texterino from './texterino';

export default function TwitterXLogoPage() {
  return (
    <>
      <DemoContainer style={{ overflow: 'hidden' }}>
        <Demo />
      </DemoContainer>
      <Texterino />
    </>
  );
}
