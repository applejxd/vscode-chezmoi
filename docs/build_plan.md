# Chezmoi Template Syntax Extension: Build and Implementation Guide

This document provides a comprehensive guide for building and implementing the VS Code extension for chezmoi template syntax highlighting.

**Target Extensions**: `.tmpl`, `.sh.tmpl`, `.zsh.tmpl`, `.ps1.tmpl`, `.py.tmpl`
**Purpose**: Simultaneously apply **Go Template** syntax highlighting (chezmoi-compliant) to base languages (text/shell/powershell).

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Project Setup](#2-project-setup)
3. [Dependency Management](#3-dependency-management)
4. [Language Definitions](#4-language-definitions)
5. [Grammar Injection](#5-grammar-injection)
6. [File Associations](#6-file-associations)
7. [Testing and Debugging](#7-testing-and-debugging)
8. [Packaging and Publishing](#8-packaging-and-publishing)
9. [Maintenance and Extensions](#9-maintenance-and-extensions)

---

## 1. Prerequisites

```bash
# Node.js 18+ recommended
npm install -g yo generator-code @vscode/vsce
```

**Note**: This extension operates using **grammar injection + configuration assistance only**. No LSP is required.

---

## 2. Project Setup

### Initial Project Creation
```bash
yo code
# Select "New Extension (TypeScript)"
# Name: chezmoi-template-syntax
# Identifier: chezmoi-template-syntax
# Description: Syntax highlighting for chezmoi templated files (.tmpl, .sh.tmpl, .zsh.tmpl, .ps1.tmpl, .py.tmpl)
cd chezmoi-template-syntax
npm install
```

### Current Architecture Overview

The implemented solution uses **dedicated language definitions** instead of relying on standard VS Code language associations. This provides more reliable scope control and eliminates conflicts.

**Key Innovation**: Custom language IDs with dedicated scopes:
- `chezmoi-tmpl` → `text.plain.chezmoi`
- `chezmoi-sh-tmpl` → `source.shell.chezmoi`
- `chezmoi-zsh-tmpl` → `source.shell.chezmoi`
- `chezmoi-ps1-tmpl` → `source.powershell.chezmoi`
- `chezmoi-py-tmpl` → `source.python.chezmoi`

---

## 3. Dependency Management

Add **extensionDependencies** to `package.json` for automatic installation:

```json
{
  "extensionDependencies": [
    "jinliming2.vscode-go-template"
  ]
}
```

**Rationale**: Chezmoi templates use Go's `text/template` + Sprig + chezmoi-specific functions. We reuse the existing Go Template extension's grammar.

---

## 4. Language Definitions

### Package.json Configuration

Add language definitions to enable explicit file type recognition:

```json
{
  "contributes": {
    "languages": [
      {
        "id": "chezmoi-tmpl",
        "aliases": ["Chezmoi Template", "chezmoi-tmpl"],
        "extensions": [".tmpl"],
        "configuration": "./language-configuration.json"
      },
      {
        "id": "chezmoi-sh-tmpl",
        "aliases": ["Chezmoi Shell Template", "chezmoi-sh-tmpl"],
        "extensions": [".sh.tmpl"],
        "configuration": "./language-configuration.json"
      },
      {
        "id": "chezmoi-zsh-tmpl",
        "aliases": ["Chezmoi Zsh Template", "chezmoi-zsh-tmpl"],
        "extensions": [".zsh.tmpl"],
        "configuration": "./language-configuration.json"
      },
      {
        "id": "chezmoi-ps1-tmpl",
        "aliases": ["Chezmoi PowerShell Template", "chezmoi-ps1-tmpl"],
        "extensions": [".ps1.tmpl"],
        "configuration": "./language-configuration.json"
      },
      {
        "id": "chezmoi-py-tmpl",
        "aliases": ["Chezmoi Python Template", "chezmoi-py-tmpl"],
        "extensions": [".py.tmpl"],
        "configuration": "./language-configuration.json"
      }
    ]
  }
}
```

### Language Configuration File

Create `language-configuration.json`:

```json
{
  "comments": {
    "lineComment": "#",
    "blockComment": ["/*", "*/"]
  },
  "brackets": [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"]
  ],
  "autoClosingPairs": [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"],
    ["\"", "\""],
    ["'", "'"]
  ],
  "surroundingPairs": [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"],
    ["\"", "\""],
    ["'", "'"]
  ]
}
```

---

## 5. Grammar Injection

### Create Syntax Directory
```bash
mkdir -p syntaxes
```

### Base Language Grammars

Create individual grammar files for each template type:

**`syntaxes/chezmoi-tmpl.tmLanguage.json`**:
```json
{
  "$schema": "https://raw.githubusercontent.com/microsoft/vscode/master/extensions/theme-defaults/syntaxes/tmLanguage.schema.json",
  "name": "Chezmoi Template",
  "scopeName": "text.plain.chezmoi",
  "patterns": [
    { "include": "text.plain" }
  ]
}
```

**`syntaxes/chezmoi-sh-tmpl.tmLanguage.json`**:
```json
{
  "$schema": "https://raw.githubusercontent.com/microsoft/vscode/master/extensions/theme-defaults/syntaxes/tmLanguage.schema.json",
  "name": "Chezmoi Shell Template",
  "scopeName": "source.shell.chezmoi",
  "patterns": [
    { "include": "source.shell" }
  ]
}
```

### Injection Grammar

**`syntaxes/chezmoi-templating.injection.tmLanguage.json`**:
```json
{
  "$schema": "https://raw.githubusercontent.com/microsoft/vscode/master/extensions/theme-defaults/syntaxes/tmLanguage.schema.json",
  "scopeName": "chezmoi.templating.injection",
  "injectionSelector": "L:source.shell -comment -string, L:source.powershell -comment -string, L:source.python -comment -string, L:text.plain -comment -string, L:text -comment -string",
  "patterns": [
    {
      "begin": "\\{\\{\\-?",
      "end": "\\-?\\}\\}",
      "beginCaptures": {
        "0": { "name": "punctuation.definition.template.begin.go" }
      },
      "endCaptures": {
        "0": { "name": "punctuation.definition.template.end.go" }
      },
      "contentName": "meta.embedded.block.go-template",
      "patterns": [
        { "include": "source.go-template" }
      ]
    }
  ]
}
```

### Grammar Registration

Add to `package.json`:

```json
{
  "contributes": {
    "grammars": [
      {
        "language": "chezmoi-tmpl",
        "scopeName": "text.plain.chezmoi",
        "path": "./syntaxes/chezmoi-tmpl.tmLanguage.json"
      },
      {
        "language": "chezmoi-sh-tmpl",
        "scopeName": "source.shell.chezmoi",
        "path": "./syntaxes/chezmoi-sh-tmpl.tmLanguage.json"
      },
      {
        "scopeName": "chezmoi.templating.injection",
        "path": "./syntaxes/chezmoi-templating.injection.tmLanguage.json",
        "injectTo": [
          "source.shell.chezmoi",
          "source.powershell.chezmoi",
          "source.python.chezmoi",
          "text.plain.chezmoi"
        ],
        "embeddedLanguages": {
          "meta.embedded.block.go-template": "go-template"
        }
      }
    ]
  }
}
```

---

## 6. File Associations

### Extension Logic

The extension prompts users on first activation to add file associations. This ensures proper language service integration.

**`src/extension.ts`**:
```typescript
import { ConfigurationTarget, ExtensionContext, window, workspace } from "vscode";

const ASSOCIATIONS: Record<string, string> = {
  "*.sh.tmpl": "chezmoi-sh-tmpl",
  "*.zsh.tmpl": "chezmoi-zsh-tmpl",
  "*.ps1.tmpl": "chezmoi-ps1-tmpl",
  "*.py.tmpl": "chezmoi-py-tmpl",
  "*.tmpl": "chezmoi-tmpl"
};

export async function activate(ctx: ExtensionContext) {
  const cfg = workspace.getConfiguration("files");
  const current = (cfg.get<Record<string, string>>("associations") ?? {});
  const missing = Object.entries(ASSOCIATIONS).filter(([pattern, language]) => current[pattern] !== language);

  if (missing.length === 0) return;

  const choice = await window.showInformationMessage(
    "Enable chezmoi templated file associations? (.tmpl/.sh.tmpl/.zsh.tmpl/.ps1.tmpl/.py.tmpl)",
    "Yes",
    "No"
  );

  if (choice !== "Yes") return;

  await cfg.update(
    "associations",
    { ...current, ...ASSOCIATIONS },
    ConfigurationTarget.Global
  );

  window.showInformationMessage("Added chezmoi file associations. Reload to apply.");
}

export function deactivate() {}
```

---

## 7. Testing and Debugging

### Compilation and Testing
```bash
npm run compile
npm test
```

### Test Files

Example test files are provided in `test/fixtures/`:

**`test.sh.tmpl`**:
```bash
#!/bin/sh
echo "User: {{ .username }} Host: {{ .chezmoi.hostname }}"
{{ if eq .chezmoi.os "linux" -}}
echo "on Linux"
{{- else -}}
echo "not Linux"
{{ end }}
```

### Scope Verification

Use **Developer: Inspect Editor Tokens and Scopes** to verify that `{{ if ... }}` expressions have:
- `meta.embedded.block.go-template`
- `source.go-template` scopes

### Debug Mode

1. Open project in VS Code
2. Press `F5` to launch Extension Development Host
3. Open test files to verify syntax highlighting

---

## 8. Packaging and Publishing

### Local VSIX Creation
```bash
npm run package
# Generates: chezmoi-template-syntax-0.1.0.vsix
# Local installation: code --install-extension ./chezmoi-template-syntax-0.1.0.vsix
```

### Marketplace Publishing

1. **Create Publisher** (first time only):
   - Visit https://marketplace.visualstudio.com/manage
   - Create Publisher account
   - Generate Azure DevOps PAT (Personal Access Token)

2. **Login and Publish**:
   ```bash
   vsce login YOUR_PUBLISHER_ID
   # Paste PAT when prompted
   npm run publish
   ```

---

## 9. Maintenance and Extensions

### Adding New File Types

1. Add language definition to `package.json`
2. Create corresponding grammar file in `syntaxes/`
3. Update injection targets in `chezmoi-templating.injection.tmLanguage.json`
4. Update ASSOCIATIONS in `src/extension.ts`

### Architecture Benefits

- **Reliability**: Explicit language definitions prevent scope conflicts
- **Consistency**: Custom scopes ensure predictable injection behavior
- **Extensibility**: Easy to add new template types
- **Performance**: Minimal runtime overhead

### Known Limitations

- **Dual LSP**: Same buffer cannot have multiple LSP servers
- **Comments/Strings**: Template expressions inside comments/strings are intentionally not highlighted
- **Scope Specificity**: Custom scopes may not integrate with all third-party extensions

### Chezmoi Template Specification

- **Syntax**: `{{ ... }}`, whitespace trimming `{{-` / `-}}`
- **Control**: `if`/`else if`/`else`/`end`, `range`, `with`, `define`/`template` (Go `text/template`)
- **Functions**: **Sprig** library + **chezmoi-specific functions** (password managers, `.chezmoi.os` data, etc.)
- **Testing**: Use `chezmoi execute-template` for preview
