import { GITHUB_REPO } from 'src/constants';

export const getGithubUrl = (path: string) => `${GITHUB_REPO}${path}`;