# ADR-003: Add TOML Template Support for `*.toml.tmpl`

## Status
Proposed

## Context
Current extension support covers `*.tmpl`, `*.sh.tmpl`, `*.zsh.tmpl`,
`*.ps1.tmpl`, and `*.py.tmpl`.

Files named `*.toml.tmpl` are currently matched by the generic `*.tmpl`
rule, so they receive `chezmoi-tmpl` (`text.plain.chezmoi`) as the base
language. As a result, TOML syntax is not highlighted while Go template
syntax is injected.

This reduces readability and increases the chance of editing mistakes for
users managing TOML-based configuration files with chezmoi templates.

## Decision
Adopt a dedicated language mapping for TOML templates.

### 1. Add a new language contribution
- Language ID: `chezmoi-toml-tmpl`
- Extensions: `.toml.tmpl`
- Base scope: `source.toml.chezmoi`

### 2. Add a dedicated TextMate grammar
Create `syntaxes/chezmoi-toml-tmpl.tmLanguage.json` with:
- `scopeName`: `source.toml.chezmoi`
- Base include: `source.toml`

This follows the same architecture already used for shell, PowerShell,
Python, and generic template variants.

### 3. Extend template injection targets
Update `syntaxes/chezmoi-templating.injection.tmLanguage.json`:
- Add `L:source.toml -comment -string` to `injectionSelector`.

Update `package.json` grammar contribution:
- Add `source.toml.chezmoi` to `injectTo`.

### 4. Extend automatic file association setup
Update `src/extension.ts` association map:
- `*.toml.tmpl` -> `chezmoi-toml-tmpl`

Update activation prompt text to include `.toml.tmpl`.

### 5. Test coverage
Add fixture and tests:
- `test/fixtures/test.toml.tmpl`
- Verify language association resolves to `chezmoi-toml-tmpl`
- Verify language contribution includes `chezmoi-toml-tmpl`

### 6. Release version policy
After implementation is completed and merged, increment the extension
patch version by one in `package.json` and reflect it in `CHANGELOG.md`.

Example:
- If current version is `0.1.0`, release version becomes `0.1.1`.

## Consequences
### Positive
- TOML syntax highlighting becomes available for `*.toml.tmpl` while
  preserving Go template highlighting.
- Keeps architecture consistent with existing per-language template mapping.
- Improves usability for TOML-heavy dotfiles such as app and tool configs.

### Negative
- Slight maintenance increase from one additional language and grammar entry.
- Potential scope conflicts if upstream TOML grammar changes, though risk is
  low and consistent with existing approach.

## Alternatives Considered
### A. Keep `*.toml.tmpl` on generic `*.tmpl`
Rejected: does not provide TOML base-language highlighting.

### B. Route `*.toml.tmpl` to plain `toml` language directly
Rejected: breaks current architecture where chezmoi template file types use
dedicated `*.chezmoi` scopes to control injection boundaries and behavior.

### C. Build one generalized multi-language grammar
Rejected: increases complexity and maintenance burden compared to the
existing explicit per-language pattern.

## Implementation Notes
- This ADR defines decision and implementation direction.
- User-facing docs (`README.md`, `docs/build_plan.md`) and release notes
  (`CHANGELOG.md`) should be updated in the implementation PR.

## Rollout Plan
1. Add language and grammar registration for TOML template files.
2. Add association and tests.
3. Run standard checks (`npm test`).
4. Bump patch version by one and update `CHANGELOG.md`.
