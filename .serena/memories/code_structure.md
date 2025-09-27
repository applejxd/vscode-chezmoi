# Code Structure

## Directory Layout
```
├── src/                           # TypeScript source code
│   ├── extension.ts              # Main extension entry point
│   └── test/                     # Test files
│       └── extension.test.ts     # Extension tests
├── syntaxes/                     # TextMate grammar files
│   └── chezmoi-templating.injection.tmLanguage.json
├── out/                          # Compiled JavaScript output
├── node_modules/                 # npm dependencies
├── .vscode/                      # VS Code workspace settings
├── doc/                          # Documentation
└── [config files]               # Various config files

## Key Files
- **package.json**: Extension manifest, dependencies, contribution points
- **tsconfig.json**: TypeScript compiler configuration
- **eslint.config.mjs**: ESLint configuration
- **.vscode-test.mjs**: VS Code test configuration
- **.vscodeignore**: Files to exclude from extension package

## Main Components

### extension.ts
- **activate()**: Main activation function that sets up file associations
- **deactivate()**: Cleanup function (currently empty)
- **ASSOCIATIONS**: Constant defining file type associations

### Grammar Definition
- **chezmoi-templating.injection.tmLanguage.json**: TextMate grammar for injecting Go Template syntax into base languages

## Test Structure
- Single test suite in `src/test/extension.test.ts`
- Uses Mocha framework with VS Code test runner
- Currently has minimal sample tests