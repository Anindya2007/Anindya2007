# GitHub Profile Automation Setup

This package contains the two GitHub Actions workflows and the JavaScript script used by the profile README.

## Required repository structure

```text
anindya2007/
├── README.md
├── .github/
│   └── workflows/
│       ├── contribution-snake.yml
│       └── update-repo.yml
└── scripts/
    └── update-repositories.js
```

Keep `README.md` in the root of the special profile repository named `anindya2007`.

## 1. Repository catalogue workflow

The `update-repo.yml` workflow fetches the public repositories owned by `anindya2007`, then updates the two marked sections in `README.md`:

- `FEATURED_REPOSITORIES_START` / `FEATURED_REPOSITORIES_END`
- `ALL_REPOSITORIES_START` / `ALL_REPOSITORIES_END`

It runs daily and can also be started manually from **Actions → Update repository catalog → Run workflow**.

Only public repositories owned by the account are listed. Private repositories and repositories owned by other accounts or organizations are not included by this public-user endpoint.

## 2. Contribution snake workflow

The `contribution-snake.yml` workflow creates light and dark SVG contribution animations and publishes them to a branch named `output`.

Run it manually from **Actions → Generate contribution snake → Run workflow**. It will also run daily.

The README should reference the generated files using:

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/anindya2007/anindya2007/output/github-contribution-grid-snake-dark.svg" />
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/anindya2007/anindya2007/output/github-contribution-grid-snake.svg" />
  <img alt="Animated GitHub contribution snake" src="https://raw.githubusercontent.com/anindya2007/anindya2007/output/github-contribution-grid-snake.svg" />
</picture>
```

## 3. GitHub permissions

In the repository, open **Settings → Actions → General → Workflow permissions**. Select **Read and write permissions** if the repository currently restricts the workflow token to read-only access.

The workflows use the built-in `GITHUB_TOKEN`; do not add a personal access token to the README or commit one to the repository.

If your repository uses branch protection or rulesets that block GitHub Actions from pushing to the default branch, adjust those rules or update the README catalog manually.

## 4. Push the files

```bash
git add README.md .github/workflows/contribution-snake.yml .github/workflows/update-repo.yml scripts/update-repositories.js SETUP.md
git commit -m "Add GitHub profile automation"
git push origin main
```

If your default branch is not `main`, replace `main` with its actual name.
