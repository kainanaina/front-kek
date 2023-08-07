import { Texterino } from 'src/components';

interface Props {
  slug: string;
}

export default function Text({ slug }: Props) {
  return (
    <Texterino>
      <Texterino.Disclaimers />
      <h1>Chess Knight Moves Algorithm Animation Tutorial</h1>
      <Texterino.CodeExamples slug={slug} links={[{ filename: 'solver.ts' }]} />
    </Texterino>
  );
}
