'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');

const username = process.env.GITHUB_USERNAME || 'anindya2007';
const token = process.env.GITHUB_TOKEN;
const readmePath = path.resolve(process.cwd(), 'README.md');

const markers = {
  featuredStart: '<!-- FEATURED_REPOSITORIES_START -->',
  featuredEnd: '<!-- FEATURED_REPOSITORIES_END -->',
  allStart: '<!-- ALL_REPOSITORIES_START -->',
  allEnd: '<!-- ALL_REPOSITORIES_END -->',
};

function escapeMarkdown(value = '') {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\|/g, '\\|')
    .replace(/[\r\n]+/g, ' ')
    .trim();
}

async function fetchRepositories() {
  const repositories = [];
  let page = 1;

  while (true) {
    const url = new URL(`https://api.github.com/users/${encodeURIComponent(username)}/repos`);
    url.searchParams.set('type', 'owner');
    url.searchParams.set('sort', 'updated');
    url.searchParams.set('direction', 'desc');
    url.searchParams.set('per_page', '100');
    url.searchParams.set('page', String(page));

    const headers = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': `${username}-profile-readme-updater`,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, { headers });
    if (!response.ok) {
      const details = await response.text();
      throw new Error(
        `GitHub API request failed (${response.status} ${response.statusText}): ${details.slice(0, 500)}`,
      );
    }

    const batch = await response.json();
    if (!Array.isArray(batch)) {
      throw new Error('Unexpected response from GitHub API: expected an array of repositories.');
    }

    repositories.push(...batch.filter((repo) => !repo.private));

    if (batch.length < 100) {
      break;
    }

    page += 1;
  }

  // Exclude the special profile README repository from the project catalogue.
  return repositories.filter((repo) => repo.name.toLowerCase() !== username.toLowerCase());
}

function formatDate(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toISOString().slice(0, 10);
}

function repositoryRow(repo) {
  const name = escapeMarkdown(repo.name || 'Untitled repository');
  const description = escapeMarkdown(repo.description || 'No description provided.').slice(0, 140);
  const language = escapeMarkdown(repo.language || '—');
  const stars = Number(repo.stargazers_count || 0);
  const forks = Number(repo.forks_count || 0);
  const updated = formatDate(repo.updated_at);
  const forkLabel = repo.fork ? ' _(fork)_' : '';

  return `| [${name}](${repo.html_url})${forkLabel} | ${description} | ${language} | ★ ${stars} · 🍴 ${forks} | ${updated} |`;
}

function buildRepositoryTable(repositories, heading) {
  if (repositories.length === 0) {
    return '_No public repositories found._';
  }

  return [
    `_${repositories.length} public repositories · sorted by recently updated_`,
    '',
    '| Repository | Description | Language | Stars · Forks | Updated |',
    '|---|---|---|---:|---|',
    ...repositories.map(repositoryRow),
  ].join('\n');
}

function replaceSection(readme, startMarker, endMarker, replacement) {
  const startIndex = readme.indexOf(startMarker);
  const endIndex = readme.indexOf(endMarker);

  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    throw new Error(`Missing or incorrectly ordered README markers: ${startMarker} ... ${endMarker}`);
  }

  return (
    readme.slice(0, startIndex + startMarker.length)
    + '\n'
    + replacement
    + '\n'
    + readme.slice(endIndex)
  );
}

async function main() {
  if (!username || !/^[A-Za-z0-9-]+$/.test(username)) {
    throw new Error('GITHUB_USERNAME must be a valid GitHub username.');
  }

  const readme = await fs.readFile(readmePath, 'utf8');
  const repositories = await fetchRepositories();

  const featuredRepositories = repositories
    .filter((repo) => !repo.fork)
    .slice(0, 6);

  let updatedReadme = replaceSection(
    readme,
    markers.featuredStart,
    markers.featuredEnd,
    buildRepositoryTable(featuredRepositories, 'Recently updated projects'),
  );

  updatedReadme = replaceSection(
    updatedReadme,
    markers.allStart,
    markers.allEnd,
    buildRepositoryTable(repositories, 'All public repositories'),
  );

  await fs.writeFile(readmePath, updatedReadme, 'utf8');
  process.stdout.write(
    `Updated README: ${featuredRepositories.length} featured projects and ${repositories.length} public repositories.\n`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
