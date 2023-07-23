import { CODEPEN_PROFILE } from 'src/constants';

interface Props {
  slug: string;
  codepenId?: string;
}

function CodeExamples({ slug, codepenId }: Props) {
  return (
    <>
      <h2>Show me the code</h2>
      <p>
        I&apos;m still working on proper code embeddings, so for now I will be
        using github links and codepen as source code materials, while tutorial
        will be mostly about general explanation behind animations and tricks.
      </p>
      <p>
        I will try to heavily comment my code (mainly styles) to compensate for
        my lack of tutorial skills.
      </p>
      <p>
        Also, if reading SCSS code with parent references nesting is too much
        trouble, you can always check compiled CSS in codepen to see the final
        classes and styles.
      </p>

      <p>
        <CodeExamples.DemoCodeLink slug={slug}>
          demo.tsx
        </CodeExamples.DemoCodeLink>
      </p>
      <p>
        <CodeExamples.StylesLink slug={slug}>
          styles.scss
        </CodeExamples.StylesLink>
      </p>

      {codepenId && (
        <iframe
          style={{ width: '100%', height: 600 }}
          title="Demo Codepen Embed"
          src={`${CODEPEN_PROFILE}/embed/${codepenId}`}
          loading="lazy"
          allowFullScreen
        >
          See the Pen
        </iframe>
      )}
    </>
  );
}

CodeExamples.DemoCodeLink = function DemoCodeLink({
  children,
  slug,
}: React.PropsWithChildren<Props>) {
  return (
    <a
      href={`https://github.com/kainanaina/front-kek/blob/main/src/app/demos/${slug}/demo.tsx`}
      target="_blank"
    >
      {children}
    </a>
  );
};

CodeExamples.StylesLink = function StylesLink({
  children,
  slug,
}: React.PropsWithChildren<Props>) {
  return (
    <a
      href={`https://github.com/kainanaina/front-kek/blob/main/src/app/demos/${slug}/styles.scss`}
      target="_blank"
    >
      {children}
    </a>
  );
};

export default CodeExamples;
