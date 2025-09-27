# ADR-001: Chezmoi Template Syntax Highlighting Architecture

## Status
Accepted

## Context
VS Code users working with chezmoi configuration management need syntax highlighting for templated files (`.tmpl`, `.sh.tmpl`, `.zsh.tmpl`, `.ps1.tmpl`). These files combine base language syntax (shell, PowerShell, plain text) with Go Template syntax for chezmoi templating.

Current challenges:
- No existing VS Code extension provides dual syntax highlighting for chezmoi templated files
- Users lose syntax highlighting benefits when working with templated configuration files
- Go Template syntax within base language files is not recognized
- Need to support multiple file extensions and base languages simultaneously

## Decision

### 1. Extension Architecture: Grammar Injection Pattern
**Decision**: Use VS Code's Grammar Injection mechanism to inject Go Template syntax into base language grammars.

**Rationale**:
- Preserves existing base language syntax highlighting
- Allows simultaneous highlighting of both syntaxes
- Minimal implementation complexity
- Leverages existing Go Template extension capabilities

**Alternative Considered**: Custom grammar that duplicates base language rules
- **Rejected**: Would require maintaining separate grammars for each base language, increasing maintenance burden

### 2. Dependency Strategy: Extension Dependencies
**Decision**: Declare `jinliming2.vscode-go-template` as an extension dependency.

**Rationale**:
- Reuses mature Go Template grammar implementation
- Ensures consistent Go Template highlighting
- Automatic installation for users
- Reduces maintenance overhead

**Alternative Considered**: Embedded Go Template grammar
- **Rejected**: Would duplicate existing functionality and require independent maintenance

### 3. File Association Strategy: Programmatic Configuration
**Decision**: Automatically configure `files.associations` on extension activation with user consent.

**Rationale**:
- Provides seamless user experience
- Respects user preferences through consent dialog
- Enables proper language services for base languages
- Supports global configuration for consistent behavior

**Alternative Considered**: Manual configuration instructions
- **Rejected**: Creates friction for users and potential configuration errors

### 4. Injection Scope Strategy: Selective Targeting
**Decision**: Inject Go Template grammar only outside of comments and strings using injection selector `L:source.shell -comment -string, L:source.powershell -comment -string, L:text.plain -comment -string`.

**Rationale**:
- Prevents false positives in comments and string literals
- Maintains semantic correctness of base language
- Improves highlighting accuracy

**Alternative Considered**: Global injection without scope restrictions
- **Rejected**: Would cause incorrect highlighting in comments and strings

### 5. Template Pattern Recognition
**Decision**: Recognize Go Template delimiters `{{`, `}}`, `{{-`, and `-}}` with regex pattern `\\{\\{\\-?` and `\\-?\\}\\}`.

**Rationale**:
- Covers all standard Go Template delimiter variations
- Supports chezmoi's whitespace trimming syntax
- Aligns with Go Template specification

### 6. Supported File Extensions
**Decision**: Support `.tmpl`, `.sh.tmpl`, `.zsh.tmpl`, and `.ps1.tmpl` with respective base language associations.

**Rationale**:
- Covers common chezmoi use cases
- Maps to appropriate base language grammars
- Extensible for future requirements

**File Associations**:
- `*.sh.tmpl` → `shellscript`
- `*.zsh.tmpl` → `shellscript` (compatible with shell syntax)
- `*.ps1.tmpl` → `powershell`
- `*.tmpl` → `plaintext` (fallback for generic templates)

### 7. Implementation Language: TypeScript
**Decision**: Implement extension activation logic in TypeScript.

**Rationale**:
- Standard for VS Code extensions
- Type safety for extension API usage
- Good tooling and development experience
- Minimal runtime overhead (only activation logic needed)

## Consequences

### Positive
- Users get dual syntax highlighting without manual configuration
- Leverages existing, mature Go Template grammar
- Minimal maintenance overhead
- Extensible architecture for additional file types
- Preserves full base language functionality

### Negative
- Requires dependency on external Go Template extension
- Limited to languages with existing VS Code grammar support
- Cannot provide dual LSP support (language services limited to base language)
- Injection grammar may not cover all edge cases

### Risks and Mitigations
- **Risk**: Go Template extension compatibility changes
  - **Mitigation**: Pin to known compatible version range, monitor for updates
- **Risk**: Performance impact from grammar injection
  - **Mitigation**: Selective injection scope minimizes overhead
- **Risk**: User confusion with dual syntax
  - **Mitigation**: Clear documentation and examples

## Implementation Notes
- Extension uses `onStartupFinished` activation event for minimal performance impact
- Grammar injection file: `syntaxes/chezmoi-templating.injection.tmLanguage.json`
- Embedded language scope: `meta.embedded.block.go-template` → `go-template`
- No LSP implementation required (syntax highlighting only)

## Future Considerations
- Support for additional base languages (Python, YAML, etc.)
- Enhanced template validation and error detection
- Integration with chezmoi CLI for template preview
- Custom theme support for Go Template elements