# Versioning Strategy

This project follows [Semantic Versioning 2.0.0](https://semver.org/).

## Version Format: `MAJOR.MINOR.PATCH`

| Component | When to bump | Examples |
|-----------|-------------|----------|
| **MAJOR** | Breaking changes to user-facing behavior (e.g. removing supported file types, changing extension ID after Marketplace publish) | `1.0.0` → `2.0.0` |
| **MINOR** | New features that are backward-compatible (e.g. adding new file type support like YAML/JSON/INI, new commands, significant grammar improvements) | `0.1.0` → `0.2.0` |
| **PATCH** | Bug fixes, documentation updates, refactoring with no user-visible change | `0.2.0` → `0.2.1` |

## Pre-1.0 Convention

While the extension is in `0.x.y` (pre-stable), minor version bumps may include small breaking changes if necessary. After `1.0.0`, the full semver contract applies strictly.

## Release Workflow

1. Update `CHANGELOG.md`: move items from `[Unreleased]` into a new version section
2. Bump `version` in `package.json`
3. Commit with message: `release: vX.Y.Z`
4. Create and push a Git tag: `git tag vX.Y.Z && git push origin vX.Y.Z`
5. GitHub Actions automatically creates a GitHub Release with the VSIX attached

## Tag Format

Tags use the `v` prefix: `v0.1.0`, `v0.2.0`, `v1.0.0`, etc.
