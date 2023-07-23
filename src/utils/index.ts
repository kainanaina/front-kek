import { Metadata } from 'next';
import { GITHUB_REPO } from 'src/constants';

export const getGithubUrl = (path: string) => `${GITHUB_REPO}${path}`;

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
}