# Chezmoi Template Syntax

VS Code extension providing syntax highlighting for chezmoi templated files with Go Template injection.

## Features

- **Dual syntax highlighting**: Combines base language syntax (shell, PowerShell, plain text) with Go Template syntax
- **Multi-format support**: `.tmpl`, `.sh.tmpl`, `.zsh.tmpl`, `.ps1.tmpl` files
- **Automatic file associations**: Configures VS Code file associations on first run
- **Go Template integration**: Leverages the existing Go Template extension for accurate template syntax highlighting

## Supported File Types

- `*.sh.tmpl` - Shell scripts with chezmoi templates
- `*.zsh.tmpl` - Zsh scripts with chezmoi templates
- `*.ps1.tmpl` - PowerShell scripts with chezmoi templates
- `*.tmpl` - Generic template files

## Requirements

- VS Code 1.90.0 or later
- Go Template extension (`jinliming2.vscode-go-template`) - automatically installed as dependency

## How It Works

The extension uses VS Code's grammar injection mechanism to inject Go Template syntax highlighting into base language grammars. Template expressions like `{{ .username }}` and `{{ if .condition }}...{{ end }}` are highlighted within their respective base languages.

## Installation

Install from the VS Code Marketplace or package locally:

```bash
npm run package
code --install-extension chezmoi-template-syntax-0.1.0.vsix
```

## Configuration

On first activation, the extension will prompt to add file associations to your VS Code settings. This enables proper language services for the base languages while maintaining template syntax highlighting.

## Known Limitations

- Language Server Protocol (LSP) features are limited to the base language only
- Template expressions within comments or strings are not highlighted to avoid false positives
- Dual LSP support is not possible due to VS Code limitations

## Release Notes

### 0.1.0

Initial release with support for chezmoi template syntax highlighting in shell, PowerShell, and plain text files.
