import { Texterino } from 'src/components';

interface Props {
  slug: string;
}

export default function Text({ slug }: Props) {
  return (
    <Texterino>
      <h1>Spiral Blocks Animation Demo</h1>
      <Texterino.CodeExamples slug={slug} />
      <p>Tutorial Coming soon...</p>
    </Texterino>
  );
}
