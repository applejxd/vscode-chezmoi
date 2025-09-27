# Tech Stack

## Core Technology
- **Language**: TypeScript 
- **Target Platform**: VS Code Extension
- **Extension Framework**: VS Code Extension API

## Build Tools & Configuration
- **TypeScript**: v5.6.0 with strict mode enabled
- **Compiler**: TSC targeting ES2022, Node16 modules
- **Output**: Compiled to `out/` directory
- **Source Maps**: Enabled for debugging

## Code Quality & Linting
- **ESLint**: v9.34.0 with TypeScript plugin
- **TypeScript ESLint**: v8.42.0 (parser and plugin)
- **Configuration**: ESLint config in `eslint.config.mjs`

## Testing Framework
- **Test Framework**: Mocha with VS Code Test CLI
- **Test Runner**: `@vscode/test-cli` v0.0.11
- **Test Environment**: `@vscode/test-electron` v2.5.2

## Development Dependencies
- `@types/vscode`: VS Code API types
- `@types/mocha`: Mocha testing types
- `@types/node`: Node.js types (v22.x)
- `@vscode/vsce`: VS Code extension packaging tool

## Syntax Definition
- **Grammar Format**: TextMate Language Grammar (tmLanguage.json)
- **Injection Grammar**: Uses VS Code's grammar injection for Go Template syntax
- **Base Languages**: Shell, PowerShell, Plain Text