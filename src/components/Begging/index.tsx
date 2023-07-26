import Link from 'next/link';
import { TWITTER } from 'src/constants';

export default function Begging() {
  return (
    <>
      <p>
        Please{' '}
        <a href={TWITTER} target="_blank">
          follow me on twitter
        </a>{' '}
        for my latest demos, tutorials and cooked takes.
      </p>
      <p>
        Also I&apos;m currently looking for a new job, so please check{' '}
        <Link href="/about-me">About Me</Link> page for more info.
      </p>
    </>
  );
}
