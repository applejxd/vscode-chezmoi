# Code Style and Conventions

## TypeScript Configuration
- **Strict Mode**: Enabled (`strict: true`)
- **Target**: ES2022
- **Module System**: Node16
- **Source Maps**: Enabled for debugging

## ESLint Rules
- **Naming Convention**: camelCase or PascalCase for imports
- **Curly Braces**: Required for control structures (`curly: "warn"`)
- **Equality**: Strict equality required (`eqeqeq: "warn"`)
- **Semicolons**: Required (`semi: "warn"`)
- **Throw Literal**: Warn against throwing literals (`no-throw-literal: "warn"`)

## Code Style Patterns
### Import Style
- Use camelCase or PascalCase for import names
- ES6 module imports preferred

### Function Style
- Export functions using `export function` or `export async function`
- Use async/await for asynchronous operations

### VS Code Extension Patterns
- Use `ExtensionContext` parameter in activate function
- Access configuration via `workspace.getConfiguration()`
- Show user messages via `window.showInformationMessage()`
- Update global settings via `ConfigurationTarget.Global`

## File Organization
- Main logic in `src/extension.ts`
- Tests in `src/test/` directory
- Grammar definitions in `syntaxes/` directory
- Compiled output in `out/` directory

## Naming Conventions
- **Files**: kebab-case for file names (e.g., `extension.test.ts`)
- **Constants**: UPPER_CASE (e.g., `ASSOCIATIONS`)
- **Functions**: camelCase (e.g., `activate`, `deactivate`)
- **Variables**: camelCase

## Error Handling
- Use proper TypeScript typing
- Handle configuration updates with async/await
- Provide user feedback for important operations