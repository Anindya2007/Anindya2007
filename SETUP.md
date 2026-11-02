# Anindya's GitHub Profile — Immersive README

## Repository structure

```text
anindya2007/
├── README.md
├── SETUP.md
├── .github/
│   └── workflows/
│       ├── update-repo.yml
│       └── contribution-snake.yml
└── scripts/
    └── update-repositories.js
```

## Install

1. Replace the current profile repository's `README.md` with this package's `README.md`.
2. Copy `.github/` and `scripts/` into the root of the profile repository. Merge with existing folders; do not create nested `.github/.github` or `scripts/scripts` folders.
3. Commit and push all files to the repository's default branch.
4. In **Settings → Actions → General → Workflow permissions**, allow **Read and write permissions**.
5. Open **Actions** and run **Update repository catalog** and **Generate contribution snake** manually once.

Both workflows use the repository's built-in `GITHUB_TOKEN`; no personal access token is required.

## What updates automatically

- `update-repo.yml` runs daily and populates the project spotlight and the complete repository wall for public repositories owned by `anindya2007`. Each repository preview image is wrapped in a link to that repository, so clicking a card opens the source repository instead of the raw image. Forks appear in the full wall and are marked separately; they are excluded from the original-project spotlight.
- `contribution-snake.yml` runs daily and publishes light/dark contribution snake SVGs to the `output` branch.
- The README's contribution timeline, statistics cards, language chart, and streak card are served by external SVG services. Their availability and refresh intervals are controlled by those services.

## Important limitations

- The full repository grid covers public repositories owned by `anindya2007`, including public forks. It cannot reveal private repositories. Contributions to repositories owned by other people/organizations are reflected in GitHub's contribution overview, but are not automatically listed in the owned-repository grid.
- GitHub profile READMEs do not run custom JavaScript, so they cannot host truly interactive charts, hover effects, or filters. Animated SVG/GIF cards work as embedded images; use a GitHub Pages portfolio for a fully interactive experience.
- Technology badges link to their documentation, and generated repository preview cards link to the matching repository. Other decorative images may still open GitHub's image preview when clicked.
- The profile photo currently loads from the GitHub avatar URL. Change the GitHub account avatar to a portrait if you want your face to appear here.
