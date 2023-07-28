import { generateMetadata } from 'src/utils';
import { DemosList } from 'src/components';

export const metadata = generateMetadata({ title: 'Demos and Tutorials' });

export default function DemosPage() {
  return <DemosList />;
}
