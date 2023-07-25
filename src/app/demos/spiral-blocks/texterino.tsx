import { CodeExamples } from 'src/components';

interface Props {
  slug: string;
}

export default function Texterino({ slug }: Props) {
  return (
    <div className="container texterino">
      <h1>Spiral Blocks Animation Demo</h1>
      <CodeExamples slug={slug} />
      <p>Tutorial Coming soon...</p>
    </div>
  );
}
