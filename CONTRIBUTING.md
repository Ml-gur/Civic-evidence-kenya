# Contributing to Witness Kenya

Thank you for your interest in contributing! This document has everything you need to get started.

## Code of Conduct

By participating in this project, you agree to uphold our [Code of Conduct](CODE_OF_CONDUCT.md). In short: be respectful, inclusive, and constructive.

## How Can I Contribute?

### 🐛 Reporting Bugs

Before submitting a bug report:

- Search [existing issues](https://github.com/Ml-gur/Civic-evidence-kenya/issues) first.
- Update to the latest version and see if the issue persists.

When submitting a bug report, include:

```
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g., Windows 11, macOS Ventura, Ubuntu 22.04]
 - Browser: [e.g., Chrome 124, Firefox 125]
 - Node.js version: [e.g., 20.11.0]
```

### 💡 Suggesting Features

We love ideas! Open an issue with the `enhancement` label and describe:

1. **The problem** you're trying to solve (don't just propose a solution)
2. **Your proposed solution** and how it works
3. **Alternatives** you've considered
4. **Why this benefits** the Kenyan civic community

### 🔧 Submitting Pull Requests

#### Setup

1. Fork the repository.
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/Civic-evidence-kenya.git`
3. Add the upstream remote: `git remote add upstream https://github.com/Ml-gur/Civic-evidence-kenya.git`
4. Create a feature branch: `git checkout -b feat/my-feature`

#### Before You Code

- Check if there's an existing issue for your change. If not, create one first.
- For large changes, open an issue to discuss the approach before spending time coding.

#### Development

```bash
npm install          # Install dependencies
cp .env.example .env # Set up environment (fill in your credentials)
npm run dev          # Start dev server at http://localhost:3000
```

Follow the setup guide in `README.md` for database and Cloudinary configuration.

#### Making Changes

- Keep changes focused — one PR per feature or bug fix.
- Follow the [Coding Standards](README.md#coding-standards) in the README.
- Write clear, self-documenting code.
- Add comments to complex or non-obvious logic.

#### Testing Your Changes

```bash
npm run lint    # TypeScript type check (must pass)
npm run build   # Ensure production build succeeds (must pass)
```

Manually test your changes in the browser before submitting.

#### Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): short description

[optional longer description]

[optional: Closes #123]
```

**Types:**
- `feat` — a new feature
- `fix` — a bug fix
- `docs` — documentation changes only
- `style` — formatting, missing semicolons, etc. (no logic change)
- `refactor` — code change that neither fixes a bug nor adds a feature
- `perf` — performance improvement
- `test` — adding or updating tests
- `chore` — build process, dependency updates, etc.

**Examples:**

```
feat(map): add ward-level heat map overlay
fix(camera): resolve GPS accuracy issue on iOS Safari
docs: improve database migration instructions
```

#### Pull Request Process

1. Update `README.md` if your change affects setup, usage, or architecture.
2. Ensure `npm run lint` and `npm run build` pass.
3. Open the PR against the `main` branch.
4. Fill in the PR description template completely.
5. A maintainer will review within a few days.
6. Address review comments promptly.
7. Once approved, a maintainer will merge your PR.

## Project Structure Quick Reference

```
src/
├── components/     # Reusable UI components
├── lib/
│   ├── supabase.ts # Database client + TypeScript types ← Add new DB types here
│   ├── kenyaData.ts # Counties/constituencies/wards data
│   ├── kenyaLeaders.ts # Leaders data
│   └── utils.ts    # Shared utilities
└── App.tsx         # Root component (views & global state)
```

## Database Changes

If your PR requires database changes:

1. Write a new `supabase_v{N}_migration.sql` file (increment N).
2. Document the changes in the PR description.
3. Update `README.md#database-setup` to include the new migration step.

**Never modify** existing migration files — only add new ones.

## Getting Help

- Open a [GitHub Discussion](https://github.com/Ml-gur/Civic-evidence-kenya/discussions) for questions.
- Comment on the relevant issue if you're stuck.

---

*Thank you for helping build a more accountable Kenya. 🇰🇪*
