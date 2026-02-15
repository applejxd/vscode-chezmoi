# Chezmoi Template Syntax

A VS Code extension that provides comprehensive syntax highlighting for [chezmoi](https://www.chezmoi.io/) templated files, combining base language syntax with Go Template highlighting.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Supported File Types](#supported-file-types)
- [Project Architecture](#project-architecture)
- [Installation](#installation)
- [How It Works](#how-it-works)
- [Development](#development)
- [Testing](#-testing)
- [Contributing](#contributing)
- [Release Notes](#release-notes)

## Overview

This extension solves the problem of syntax highlighting for chezmoi template files that combine multiple syntaxes. For example, a `.sh.tmpl` file contains both shell script syntax AND Go template syntax (`{{ .variable }}`), but standard VS Code extensions can only highlight one or the other.

**Before**: No highlighting for template expressions in `.tmpl` files
**After**: Full dual syntax highlighting for both base language and Go templates

## Features

- **🎨 Dual Syntax Highlighting**: Seamlessly combines base language syntax (shell, PowerShell, plain text) with Go Template syntax
- **📁 Multi-Format Support**: Supports `.tmpl`, `.sh.tmpl`, `.zsh.tmpl`, `.ps1.tmpl`, `.py.tmpl` files
- **🔧 Automatic Configuration**: Configures VS Code file associations on first activation
- **🔗 Dependency Management**: Automatically installs and leverages the Go Template extension
- **🎯 Intelligent Injection**: Only highlights template expressions outside of comments and strings

## Supported File Types

| Extension | Base Language | Use Case | Example |
| --------- | ------------- | -------- | --------- |
| `*.tmpl` | Plain Text | Generic configuration files | `config.yaml.tmpl` |
| `*.sh.tmpl` | Shell Script | Bash/shell scripts | `install.sh.tmpl` |
| `*.zsh.tmpl` | Shell Script | Zsh configuration | `.zshrc.tmpl` |
| `*.ps1.tmpl` | PowerShell | Windows PowerShell scripts | `setup.ps1.tmpl` |
| `*.py.tmpl` | Python | Python scripts | `script.py.tmpl` |

### Example Template File

```bash
#!/bin/bash
# File: install.sh.tmpl

echo "Installing for user: {{ .username }}"
{{ if eq .chezmoi.os "linux" -}}
sudo apt-get update
{{- end }}

export PATH="$PATH:{{ .custom_path }}"
```

## Project Architecture

### 🏗️ Core Components

```txt
chezmoi-syntax/
├── 📁 src/                          # TypeScript source code
│   ├── extension.ts                 # Main extension logic
│   └── test/extension.test.ts       # Test suite
├── 📁 syntaxes/                     # Grammar definitions
│   ├── chezmoi-templating.injection.tmLanguage.json  # Injection grammar
│   ├── chezmoi-tmpl.tmLanguage.json                  # Plain text grammar
│   ├── chezmoi-sh-tmpl.tmLanguage.json               # Shell grammar
│   ├── chezmoi-zsh-tmpl.tmLanguage.json              # Zsh grammar
│   ├── chezmoi-ps1-tmpl.tmLanguage.json              # PowerShell grammar
│   └── chezmoi-py-tmpl.tmLanguage.json               # Python grammar
├── 📁 test/fixtures/                # Test template files
├── 📁 doc/                          # Documentation
├── package.json                     # Extension manifest
└── language-configuration.json     # Language behavior config
```

### 🔧 Technical Implementation

1. **Language Definitions**: Custom language IDs for each template type
   - `chezmoi-tmpl` → `text.plain.chezmoi` scope
   - `chezmoi-sh-tmpl` → `source.shell.chezmoi` scope
   - `chezmoi-ps1-tmpl` → `source.powershell.chezmoi` scope
   - `chezmoi-py-tmpl` → `source.python.chezmoi` scope

2. **Grammar Injection**: Injects Go Template syntax into base language scopes

   ```json
   "injectTo": [
     "source.shell.chezmoi",
     "source.powershell.chezmoi",
     "source.python.chezmoi",
     "text.plain.chezmoi"
   ]
   ```

3. **File Association**: Runtime configuration of VS Code settings

   ```typescript
   "*.tmpl": "chezmoi-tmpl",
   "*.sh.tmpl": "chezmoi-sh-tmpl",
   "*.py.tmpl": "chezmoi-py-tmpl"
   ```

## Installation

### From VSIX Package

1. Build the extension:

   ```bash
   npm install
   npm run package
   ```

2. Install in VS Code:

   ```bash
   code --install-extension chezmoi-template-syntax-0.1.0.vsix
   ```

### Development Installation

1. Clone and setup:

   ```bash
   git clone https://github.com/applejxd/chezmoi-template-syntax.git
   cd chezmoi-template-syntax
   npm install
   ```

2. Open in VS Code and press `F5` to launch Extension Development Host

## How It Works

### 🎯 Grammar Injection Process

1. **File Recognition**: VS Code identifies `.tmpl` files using our language definitions
2. **Base Grammar**: Applies appropriate base language grammar (shell, PowerShell, etc.)
3. **Template Injection**: Injects Go Template grammar into `{{ }}` expressions
4. **Scope Targeting**: Uses custom scopes to avoid conflicts with standard languages

### 🔍 Injection Selector Logic

```json
"injectionSelector": "L:source.shell -comment -string, L:source.powershell -comment -string, L:source.python -comment -string, L:text.plain -comment -string"
```

This ensures template expressions are only highlighted when they're NOT inside:

- Comments (`# {{ .not_highlighted }}`)
- String literals (`"{{ .not_highlighted }}"`)

## Development

### 🛠️ Available Commands

```bash
# Development
npm run compile        # Compile TypeScript
npm run watch         # Watch mode compilation
npm run lint          # Run ESLint

# Testing
npm test              # Run extension tests
npm run pretest       # Compile + lint before testing

# Packaging
npm run package       # Create VSIX package
npm run publish       # Publish to marketplace
```

### 🧪 Testing

The extension includes comprehensive tests:

- **File Language Association**: Verifies correct language assignment
- **Extension Dependencies**: Checks Go Template extension availability
- **Language Contributions**: Validates language registration

Run tests:

```bash
npm test
```

### 📁 Test Files

Example test files are provided in `test/fixtures/`:

- `test.tmpl` - Generic template
- `test.sh.tmpl` - Shell script template
- `test.ps1.tmpl` - PowerShell template
- `test.zsh.tmpl` - Zsh configuration template
- `test.py.tmpl` - Python template

## Contributing

### 🔧 Adding New File Types

1. Add language definition to `package.json`:

   ```json
   {
     "id": "chezmoi-new-tmpl",
     "extensions": [".new.tmpl"],
     "configuration": "./language-configuration.json"
   }
   ```

2. Create grammar file `syntaxes/chezmoi-new-tmpl.tmLanguage.json`
3. Update injection target in `chezmoi-templating.injection.tmLanguage.json`
4. Add to extension's ASSOCIATIONS in `src/extension.ts`

### 📚 Documentation

- Architecture decisions: `doc/adr-001-chezmoi-syntax-highlighting-architecture.md`
- Build process: `doc/build_plan.md`
- API documentation: Generated from TypeScript comments

## Release Notes

### 0.1.0 - 2025-01-28

**🎉 Initial Release**

- ✅ Syntax highlighting for `.tmpl`, `.sh.tmpl`, `.zsh.tmpl`, `.ps1.tmpl` files
- ✅ Dual syntax highlighting (base language + Go Template)
- ✅ Automatic file association configuration
- ✅ Grammar injection with intelligent scope targeting
- ✅ Comprehensive test suite
- ✅ Complete documentation

**Technical Highlights:**

- Custom language definitions with dedicated scopes
- Grammar injection excluding comments/strings
- Runtime VS Code configuration
- Extension dependency management

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🔗 Links

- [Chezmoi Documentation](https://www.chezmoi.io/)
- [Go Template Extension](https://marketplace.visualstudio.com/items?itemName=jinliming2.vscode-go-template)
- [VS Code Extension API](https://code.visualstudio.com/api)
