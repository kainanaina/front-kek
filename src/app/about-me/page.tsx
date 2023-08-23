import { CODEPEN_PROFILE, LINKEDIN_PROFILE, TWITTER } from 'src/constants';
import { generateMetadata } from 'src/utils';

export const metadata = generateMetadata({ title: 'About Me' });

export default function AboutMePage() {
  return (
    <div className="container texterino">
      <h1>About Me</h1>
      <p>
        Hello, I&apos;m Nikolay Talanov and I am a professional frontend idiot,
        welcome to my personal demos website.
      </p>

      <h2>Back in my days</h2>
      <p>
        Somewhere around 2014-2016 I used to do lots of frontend animation demos
        on{' '}
        <a href={CODEPEN_PROFILE} target="_blank">
          codepen
        </a>
        , and I even managed to get{' '}
        <a href="https://codepen.io/2015/popular/pens/10" target="_blank">
          11 demos in top 100 most liked demos of 2015
        </a>
        . That got me lots of attention and I managed to relocate from small
        russian town straight to Singapore, where I spent last 7 years working
        in various startups.
      </p>

      <h2>The journey so far</h2>
      <ol>
        <li>
          Spent first 4 years building dashboards for BI Tools SAAS startup,
          where I grew from junior into senior developer, while building new
          stuff and then maintaining/extending it for years.
        </li>
        <li>
          Then ended up in travel startup in early 2020, right before travelling
          became unpopular for some unknown reason.
        </li>
        <li>
          After that joined another startup, which was acquired a half-year
          later by company with 12 hours timezone difference, so you can guess
          the rest.
        </li>
        <li>
          Aaaaand then I managed to join web3 startup in early 2022, just a few
          months before whole industry started going down in flames. We managed
          to do like 4 pivots with various products and in the end we
          didn&apos;t made it (NGMI), so company is shutting down.
        </li>
        <li>
          Started at a new place at the end of August 2023, the story
          continues...
        </li>
      </ol>

      <p>You can contact me via:</p>
      <ul>
        <li>
          <a href={TWITTER} target="_blank">
            Twitter DMs
          </a>
        </li>
        <li>
          <a href={LINKEDIN_PROFILE} target="_blank">
            Linkedin
          </a>
        </li>
        <li>Email - frontkek at gmail.com</li>
      </ul>
    </div>
  );
}
