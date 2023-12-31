import { Metadata } from 'next';
import { GITHUB_REPO, DEMOS } from 'src/constants';

export const getGithubUrl = (path: string) => `${GITHUB_REPO}/tree/main${path}`;

const titleSuffix = ' | FRONT-KEK';
const defaultTitle = `Front-End Demos and Tutorials${titleSuffix}`;
const description =
  'Your source of ridiculous frontend demos and tutorials made by Nikolay Talanov.';
const defaultSeoPreview = 'https://i.imgur.com/stvMUxc.png';

export const generateMetadata = ({ title, seoPreview }: { title?: string; seoPreview?: string; }) => {
  const resultTitle = title ? `${title}${titleSuffix}` : defaultTitle;
  const metadata: Metadata = {
    title: resultTitle,
    description,
    openGraph: {
      title: resultTitle,
      description,
      images: [
        { url: seoPreview || defaultSeoPreview },
      ],
    },
  };

  return metadata;
};

export const generateDemoMetadata = (slug: string) => {
  const demo = DEMOS.find((d) => d.slug === slug);
  if (!demo) {
    return generateMetadata({});
  }

  return generateMetadata({
    title: `${demo.title}${demo.tags?.includes('tutorial') ? ' Tutorial' : ''}`,
    seoPreview: demo.seoPreview,
  });
};

export const rangeFromZero = (numOfItems: number): number[] => {
  return Array.from(Array(numOfItems).keys());
};

export const preventNonNumbers = (allowDecimals = false) => (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter') {
    return;
  }

  const { value } = e.currentTarget;

  const regex = (allowDecimals && value?.length && !value.includes('.'))
    ? /[0-9]|\./
    : /[0-9]/;

  if (!regex.test(e.key)) {
    e.preventDefault();
  }
};