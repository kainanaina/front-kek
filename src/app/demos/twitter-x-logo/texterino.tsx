import { CodeExamples } from 'src/components';

interface Props {
  slug: string;
}

export default function Texterino({ slug }: Props) {
  return (
    <div className="container texterino">
      <h1>Twitter X Logo Transformation Demo</h1>
      <CodeExamples slug={slug} codepenId="RwqYNar" />
      <p>Tutorial Coming soon...</p>
    </div>
  );
}
