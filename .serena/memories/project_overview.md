# Chezmoi Template Syntax Extension Project

## Purpose
This is a VS Code extension that provides syntax highlighting for chezmoi templated files with Go Template injection. It enables dual syntax highlighting that combines base language syntax (shell, PowerShell, plain text) with Go Template syntax.

## Core Features
- Dual syntax highlighting for base language + Go Template syntax
- Multi-format support: `.tmpl`, `.sh.tmpl`, `.zsh.tmpl`, `.ps1.tmpl` files
- Automatic file associations configuration
- Grammar injection mechanism for proper template highlighting

## Supported File Types
- `*.sh.tmpl` - Shell scripts with chezmoi templates
- `*.zsh.tmpl` - Zsh scripts with chezmoi templates  
- `*.ps1.tmpl` - PowerShell scripts with chezmoi templates
- `*.tmpl` - Generic template files

## Extension Dependencies
- Requires Go Template extension (`jinliming2.vscode-go-template`) - automatically installed as dependency
- VS Code 1.90.0 or later

## Known Limitations
- Language Server Protocol (LSP) features are limited to the base language only
- Template expressions within comments or strings are not highlighted to avoid false positives
- Dual LSP support is not possible due to VS Code limitations