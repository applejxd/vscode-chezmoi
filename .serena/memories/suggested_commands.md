# Suggested Commands for Development

## Build & Compilation
```bash
npm run compile          # Compile TypeScript to JavaScript
npm run watch           # Watch mode compilation
npm run vscode:prepublish # Pre-publish build (runs compile)
```

## Code Quality
```bash
npm run lint            # Run ESLint on src/ directory
npm run pretest         # Run compile + lint before testing
```

## Testing
```bash
npm run test            # Run VS Code extension tests
npm run pretest         # Prepare for testing (compile + lint)
```

## Packaging & Publishing
```bash
npm run package         # Create .vsix package file
npm run publish         # Publish to VS Code Marketplace
```

## Development Workflow
```bash
# Install dependencies
npm install

# Development cycle
npm run watch           # Start watch mode
npm run test           # Run tests when ready

# Before committing
npm run pretest        # Ensure code quality
npm run package        # Test packaging
```

## VS Code Testing
```bash
# Install packaged extension locally
code --install-extension chezmoi-template-syntax-0.1.0.vsix
```

## Windows-specific Notes
- Use `npm` commands as shown (npm is available on Windows)
- Commands run in PowerShell or Command Prompt
- File paths use Windows backslashes in output but forward slashes work in commands