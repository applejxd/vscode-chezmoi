# Troubleshooting Guide

This guide helps diagnose and resolve common issues with the Chezmoi extension.

## 🚨 Quick Diagnostics

### Check Extension Status

1. **Verify Extension is Installed and Enabled**:
   - Open VS Code Extensions panel (`Ctrl+Shift+X`)
   - Search for "Chezmoi"
   - Ensure it's installed and enabled

2. **Check Dependency Extension**:
   - Verify "Go Template" extension is installed
   - Extension ID: `jinliming2.vscode-go-template`

3. **Verify File Association**:
   - Open a `.tmpl` file
   - Check language mode in bottom-right corner
   - Should show "Chezmoi Template" or similar

## 🔍 Common Issues

### Issue 1: No Syntax Highlighting

**Symptoms**:
- Template files show as plain text
- No highlighting for `{{ }}` expressions
- File appears unstyled

**Diagnosis**:
```bash
# Check file language ID
# In VS Code: Ctrl+Shift+P → "Developer: Inspect Editor Tokens and Scopes"
```

**Solutions**:

**Solution A: Enable File Associations**
1. Restart VS Code
2. Open any `.tmpl` file
3. Extension should prompt to enable associations
4. Click "Yes" when prompted
5. Reload VS Code when requested

**Solution B: Manual File Association**
1. Open VS Code Settings (`Ctrl+,`)
2. Search for "files.associations"
3. Add the following associations:
   ```json
   {
     "files.associations": {
       "*.tmpl": "chezmoi-tmpl",
       "*.sh.tmpl": "chezmoi-sh-tmpl",
       "*.zsh.tmpl": "chezmoi-zsh-tmpl",
       "*.ps1.tmpl": "chezmoi-ps1-tmpl"
     }
   }
   ```

**Solution C: Force Language Mode**
1. Open template file
2. Click language indicator in bottom-right
3. Select "Configure File Association for '.tmpl'"
4. Choose appropriate "Chezmoi" language

### Issue 2: Partial Syntax Highlighting

**Symptoms**:
- Base language (shell, PowerShell) is highlighted
- Template expressions `{{ }}` are not highlighted
- Mixed results across different files

**Diagnosis**:
Use `Developer: Inspect Editor Tokens and Scopes` on `{{ }}` expressions:

**Expected Scopes**:
```
text.chezmoi
  punctuation.definition.template.begin.go
  meta.embedded.block.go-template
    source.go-template
      [Go template tokens]
  punctuation.definition.template.end.go
```

**Solutions**:

**Solution A: Reinstall Dependencies**
1. Uninstall Go Template extension
2. Restart VS Code
3. Chezmoi extension will prompt to reinstall dependency
4. Accept installation

**Solution B: Check Injection Targets**
1. Open `test.tmpl` in Extension Development Host (`F5`)
2. Verify scopes include `text.plain.chezmoi`
3. If not, check extension configuration

### Issue 3: Extension Activation Failed

**Symptoms**:
- Extension appears in list but isn't working
- No file association prompts
- Console errors in Developer Tools

**Diagnosis**:
1. Open Developer Tools (`Help` → `Toggle Developer Tools`)
2. Check Console for errors
3. Look for extension-related messages

**Solutions**:

**Solution A: Clear Extension Host Cache**
1. `Ctrl+Shift+P` → "Developer: Reload Window"
2. If issues persist: `Ctrl+Shift+P` → "Developer: Restart Extension Host"

**Solution B: Reinstall Extension**
1. Uninstall Chezmoi extension
2. Restart VS Code
3. Reinstall extension
4. Restart VS Code again

**Solution C: Check VS Code Version**
- Minimum required: VS Code 1.90.0
- Update VS Code if necessary

### Issue 4: Performance Issues

**Symptoms**:
- Slow file opening
- Laggy typing in template files
- High CPU usage

**Diagnosis**:
1. Profile extension performance:
   ```bash
   # In VS Code
   Ctrl+Shift+P → "Developer: Startup Performance"
   ```

**Solutions**:

**Solution A: Reduce File Size**
- Large template files may cause performance issues
- Consider splitting large templates

**Solution B: Disable Other Extensions**
- Temporarily disable other language extensions
- Test if conflict exists

**Solution C: Update Extension**
- Check for extension updates
- Update to latest version

### Issue 5: Grammar Injection Conflicts

**Symptoms**:
- Incorrect highlighting in specific contexts
- Template expressions in comments/strings are highlighted
- Unexpected syntax coloring

**Diagnosis**:
Check injection selector configuration in extension files.

**Solutions**:

**Solution A: Update Injection Rules**
The extension should exclude comments and strings. Verify configuration:

```json
"injectionSelector": "L:source.shell -comment -string, L:source.powershell -comment -string, L:text.plain -comment -string"
```

**Solution B: Report False Positives**
If template expressions in comments are highlighted:
1. This is intentional to avoid false positives
2. Templates in comments won't be processed by chezmoi
3. If needed, move templates outside comments

## 🛠️ Advanced Diagnostics

### Extension Development Host

For detailed debugging:

1. **Open Extension in Development Mode**:
   ```bash
   # In extension directory
   code .
   # Press F5 to launch Extension Development Host
   ```

2. **Enable Extension Logging**:
   ```typescript
   // Add to extension.ts for debugging
   console.log('Extension activated');
   ```

3. **Check Extension Host Console**:
   - In Extension Development Host
   - `Help` → `Toggle Developer Tools`
   - Check Console tab

### File Association Debugging

Check current associations:
```bash
# In VS Code Terminal
code --list-extensions | grep chezmoi
code --install-extension applejxd.vscode-chezmoi --force
```

### Grammar File Validation

Validate TextMate grammar files:
1. Use online TextMate grammar tester
2. Check syntax in `syntaxes/*.tmLanguage.json`
3. Verify JSON syntax is valid

## 📊 Performance Monitoring

### Measure Extension Impact

1. **Startup Performance**:
   ```bash
   # Measure activation time
   Ctrl+Shift+P → "Developer: Startup Performance"
   ```

2. **Memory Usage**:
   ```bash
   # Check memory consumption
   Ctrl+Shift+P → "Developer: Open Process Explorer"
   ```

3. **File Processing Time**:
   - Open large template files
   - Monitor response time
   - Check for delays in syntax highlighting

## 🔧 Configuration Verification

### Check Extension Settings

**Extension Manifest** (`package.json`):
```json
{
  "extensionDependencies": ["jinliming2.vscode-go-template"],
  "activationEvents": ["onStartupFinished"],
  "main": "./out/extension.js"
}
```

**Language Contributions**:
```json
{
  "contributes": {
    "languages": [
      {
        "id": "chezmoi-tmpl",
        "extensions": [".tmpl"]
      }
    ]
  }
}
```

### Verify Grammar Files

Check that all required files exist:
- `syntaxes/chezmoi-templating.injection.tmLanguage.json`
- `syntaxes/chezmoi-tmpl.tmLanguage.json`
- `syntaxes/chezmoi-sh-tmpl.tmLanguage.json`
- `syntaxes/chezmoi-zsh-tmpl.tmLanguage.json`
- `syntaxes/chezmoi-ps1-tmpl.tmLanguage.json`

## 🐛 Reporting Issues

### Information to Include

When reporting issues, please provide:

1. **Environment Information**:
   - VS Code version
   - Operating system
   - Extension version
   - Go Template extension version

2. **Problem Description**:
   - Expected behavior
   - Actual behavior
   - Steps to reproduce

3. **Sample Files**:
   - Minimal template file showing issue
   - Screenshots of highlighting problems

4. **Console Output**:
   - Developer Tools console errors
   - Extension host output

### Example Issue Report

```
**Environment:**
- VS Code: 1.85.0
- OS: Windows 11
- Extension: 0.1.0
- Go Template: 0.2.1

**Problem:**
Template expressions in .sh.tmpl files are not highlighted.

**Steps to Reproduce:**
1. Create file `test.sh.tmpl`
2. Add content: `echo "{{ .username }}"`
3. Open in VS Code
4. No highlighting on `{{ .username }}`

**Expected:**
Template expression should be highlighted with Go Template syntax.

**Console Errors:**
None visible in Developer Tools.
```

## 📞 Getting Help

### Resources

1. **GitHub Issues**: Report bugs and feature requests
2. **Documentation**: Check README and doc/ folder
3. **VS Code Extension API**: For development questions
4. **Chezmoi Documentation**: For template syntax questions

### Community Support

- Check existing GitHub issues
- Search VS Code extension documentation
- Consult chezmoi community resources
- Review Go Template extension documentation

## ✅ Self-Help Checklist

Before seeking help, verify:

- [ ] Extension is installed and enabled
- [ ] Go Template extension is installed
- [ ] VS Code version is 1.90.0 or later
- [ ] File associations are configured
- [ ] Tried restarting VS Code
- [ ] Tested with minimal template file
- [ ] Checked Developer Tools for errors
- [ ] Verified grammar files exist
- [ ] Tested in Extension Development Host

If all checks pass and issues persist, create a detailed issue report with the information outlined above.