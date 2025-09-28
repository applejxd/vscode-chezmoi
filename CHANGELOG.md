# Change Log

All notable changes to the "chezmoi-template-syntax" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.1.0] - 2025-01-28

### Added
- Initial release with syntax highlighting for chezmoi templated files
- Support for `.tmpl`, `.sh.tmpl`, `.zsh.tmpl`, `.ps1.tmpl` file extensions
- Dedicated language definitions for each template type
- Grammar injection for Go Template syntax within base languages
- Automatic file association configuration on extension activation
- Language configuration for proper editor behavior (brackets, auto-closing pairs)

### Features
- Dual syntax highlighting combining base language + Go Template syntax
- Reliable file type recognition using explicit language definitions
- Grammar injection targeting custom scopes for consistent highlighting
- Dependency on Go Template extension for accurate template syntax

### Technical Details
- Custom language IDs: `chezmoi-tmpl`, `chezmoi-sh-tmpl`, `chezmoi-zsh-tmpl`, `chezmoi-ps1-tmpl`
- Custom scopes: `text.plain.chezmoi`, `source.shell.chezmoi`, `source.powershell.chezmoi`
- Injection selector excludes comments and strings to avoid false positives