# Task Completion Checklist

## Before Committing Code
1. **Compile**: Run `npm run compile` to ensure TypeScript compiles without errors
2. **Lint**: Run `npm run lint` to ensure code follows style guidelines
3. **Test**: Run `npm run test` to ensure all tests pass
4. **Type Check**: TypeScript compilation serves as type checking

## Comprehensive Pre-commit Workflow
```bash
# Run the full pre-test suite
npm run pretest    # This runs: compile + lint

# Run tests
npm run test

# Optional: Test packaging
npm run package
```

## Quality Gates
- ✅ TypeScript compilation succeeds (no errors)
- ✅ ESLint passes (no errors, warnings acceptable)
- ✅ All tests pass
- ✅ Extension can be packaged successfully

## Testing the Extension
1. Package the extension: `npm run package`
2. Install locally: `code --install-extension chezmoi-template-syntax-0.1.0.vsix`
3. Test with sample `.tmpl` files
4. Verify syntax highlighting works for supported file types

## Release Checklist
1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Run full test suite
4. Create package: `npm run package`
5. Test package locally
6. Publish: `npm run publish` (if ready for marketplace)

## Common Commands for Task Completion
```bash
npm run pretest && npm run test    # Full quality check
npm run package                    # Test packaging
```