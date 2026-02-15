# ADR-002: Add Python Template Support for `*.py.tmpl`

## Status
Proposed

## Context
Current extension support covers `*.tmpl`, `*.sh.tmpl`, `*.zsh.tmpl`,
and `*.ps1.tmpl`.

Files named `*.py.tmpl` are currently matched by the generic `*.tmpl`
rule, so they receive `chezmoi-tmpl` (`text.plain.chezmoi`) as the base
language. As a result, Python syntax is not highlighted while Go template
syntax is injected.

This causes reduced readability and editing accuracy for users managing
Python-based scripts and configuration files with chezmoi templates.

## Decision
Adopt a dedicated language mapping for Python templates.

### 1. Add a new language contribution
- Language ID: `chezmoi-py-tmpl`
- Extensions: `.py.tmpl`
- Base scope: `source.python.chezmoi`

### 2. Add a dedicated TextMate grammar
Create `syntaxes/chezmoi-py-tmpl.tmLanguage.json` with:
- `scopeName`: `source.python.chezmoi`
- Base include: `source.python`

This follows the same architecture already used for shell and PowerShell
template variants.

### 3. Extend template injection targets
Update `syntaxes/chezmoi-templating.injection.tmLanguage.json`:
- Add `L:source.python -comment -string` to `injectionSelector` for direct
  Python scope coverage.

Update `package.json` grammar contribution:
- Add `source.python.chezmoi` to `injectTo`.

### 4. Extend automatic file association setup
Update `src/extension.ts` association map:
- `*.py.tmpl` -> `chezmoi-py-tmpl`

Update activation prompt text to include `.py.tmpl`.

### 5. Test coverage
Add fixture and tests:
- `test/fixtures/test.py.tmpl`
- Verify language association resolves to `chezmoi-py-tmpl`
- Verify language contribution includes `chezmoi-py-tmpl`

## Consequences
### Positive
- Python syntax highlighting becomes available for `*.py.tmpl` while
  preserving Go template highlighting.
- Keeps architecture consistent with existing per-language template mapping.
- Improves usability for cross-platform dotfiles and script templates.

### Negative
- Slight maintenance increase from one additional language and grammar entry.
- Potential scope conflicts if upstream Python grammar changes, though risk
  is low and consistent with existing approach.

## Alternatives Considered
### A. Keep `*.py.tmpl` on generic `*.tmpl`
Rejected: does not provide Python base-language highlighting.

### B. Route `*.py.tmpl` to plain `python` language directly
Rejected: breaks current architecture where all chezmoi template file
types use dedicated `*.chezmoi` scopes to control injection boundaries and
behavior.

### C. Build one generalized multi-language grammar
Rejected: increases complexity and maintenance burden compared to the
existing explicit per-language pattern.

## Implementation Notes
- This ADR only defines the decision and implementation direction.
- User-facing docs (`README.md`, `docs/build_plan.md`) and release notes
  (`CHANGELOG.md`) should be updated in the implementation PR.

## Rollout Plan
1. Add language and grammar registration for Python template files.
2. Add association and tests.
3. Run standard checks (`npm test`).
4. Update docs and changelog in the same PR.
