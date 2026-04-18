# Change Log

All notable changes to the "Chezmoi" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

## [0.2.1] - 2026-04-19

### Fixed
- Changed `extensionDependencies` to `extensionPack` for `vscode-go-template` dependency
- Fixed test environment to install `go-template` correctly during tests

## [0.2.0] - 2026-02-25

### Added
- Support for `.yaml.tmpl` / `.yml.tmpl` (YAML), `.json.tmpl` (JSON), `.ini.tmpl` (INI) file types
- Per-language `language-configuration-*.json` files with correct comment settings for each base language
- `{{ }}` auto-closing and surrounding pairs in all language configurations
- GitHub Actions CI workflow (lint, compile, test, VSIX packaging)
- GitHub Actions Release workflow (automatic GitHub Release on tag push)
- Marketplace metadata: icon, gallery banner, CI badge, `preview: true`
- `sinon`-based tests for extension activation and idempotency
- Parameterized (data-driven) file association tests covering all 9 file types
- Versioning strategy documentation (`docs/VERSIONING.md`)

### Changed
- Renamed extension ID from `chezmoi-template-syntax` to `vscode-chezmoi`
- Renamed display name from "Chezmoi Template Syntax" to "Chezmoi"
- Changed activation strategy from `onStartupFinished` to implicit `onLanguage` (empty `activationEvents`)
- Fixed Zsh scope name duplication (`source.shell.chezmoi` → `source.zsh.chezmoi`)
- Refined injection selector to target only `.chezmoi`-suffixed scopes
- Enhanced `.vscodeignore` to exclude docs, tests, and dev files from VSIX
- Improved error handling in `activate()` with try-catch and "Reload Now" button
- Enabled stricter TypeScript checks (`noImplicitReturns`, `noFallthroughCasesInSwitch`, `noUnusedParameters`)
- Corrected documentation paths (`doc/` → `docs/`), fixed Mocha/Jest references

## [0.1.1] - 2026-02-15

### Added
- Support for `.py.tmpl` file extension with dedicated `chezmoi-py-tmpl` language
- Python grammar scope `source.python.chezmoi` and Go Template injection support for Python templates
- Support for `.toml.tmpl` file extension with dedicated `chezmoi-toml-tmpl` language
- TOML grammar scope `source.toml.chezmoi` and Go Template injection support for TOML templates
- File association mapping for `*.py.tmpl` and `*.toml.tmpl` with test fixture coverage
- ADR-003 documenting the implementation plan for `*.toml.tmpl` support and patch version bump policy

## [0.1.0] - 2025-01-28

### Added
- Initial release with syntax highlighting for chezmoi templated files
- Support for `.tmpl`, `.sh.tmpl`, `.zsh.tmpl`, `.ps1.tmpl` file extensions
- Dedicated language definitions for each template type
- Grammar injection for Go Template syntax within base languages
- Automatic file association configuration on extension activation
- Language configuration for proper editor behavior (brackets, auto-closing pairs)
