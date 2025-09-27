# VS Code 拡張: chezmoi テンプレート付きファイルのシンタックスハイライト
対象拡張子: `.tmpl`, `.sh.tmpl`, `.zsh.tmpl`, `.ps1.tmpl`  
目的: 元の言語（text/shell/powershell）のハイライトに **Go Template**（chezmoi 準拠）を**同時適用**。

---

## 0. 事前準備
```bash
# Node.js 18+ 推奨
npm -g i yo generator-code @vscode/vsce
```

---

## 1. プロジェクト作成（TypeScript）
```bash
yo code
# -> "New Extension (TypeScript)" を選択
# Name: chezmoi-template-syntax
# Identifier: chezmoi-template-syntax
# Description: Syntax highlighting for chezmoi templated files (.tmpl, .sh.tmpl, .zsh.tmpl, .ps1.tmpl)
# Git/Package Manager は任意
cd chezmoi-template-syntax
npm i
```

> この拡張は**文法注入＋設定補助のみ**で動作。LSP等は不要。

---

## 2. 依存拡張（Go Template）の追加
`package.json` に **extensionDependencies** を追加（自動で一緒に入るようにする）:

```jsonc
{
  // ...
  "extensionDependencies": [
    "jinliming2.vscode-go-template"
  ]
}
```

> chezmoi のテンプレは Go の `text/template` + Sprig + chezmoi独自関数。Go Template 拡張の文法をそのまま再利用する。

---

## 3. ファイル関連付け（.tmpl / .sh.tmpl / .zsh.tmpl / .ps1.tmpl）
拡張が**初回起動時にユーザーへ確認し、`files.associations` に追記**する方式。  
`src/extension.ts` を **丸ごと置換**:

```ts
import { ConfigurationTarget, ExtensionContext, window, workspace } from "vscode";

const ASSOCIATIONS: Record<string, string> = {
  "*.sh.tmpl": "shellscript",   // bashベース
  "*.zsh.tmpl": "shellscript",  // zsh も shellscript で扱う（必要なら zsh 拡張と併用可）
  "*.ps1.tmpl": "powershell",
  "*.tmpl": "plaintext"         // 汎用テンプレ：最低限はプレーンテキスト
};

export async function activate(ctx: ExtensionContext) {
  const cfg = workspace.getConfiguration("files");
  const current = (cfg.get<Record<string, string>>("associations") ?? {});
  const missing = Object.entries(ASSOCIATIONS).filter(([k, v]) => current[k] !== v);

  if (missing.length === 0) return;

  const choice = await window.showInformationMessage(
    "Enable chezmoi templated file associations? (.tmpl/.sh.tmpl/.zsh.tmpl/.ps1.tmpl)",
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

`package.json` に **起動トリガ** を追加:
```jsonc
{
  // ...
  "main": "./out/extension.js",
  "activationEvents": ["onStartupFinished"]
}
```

---

## 4. Injection Grammar（Go Template を注入）
1) フォルダ作成:
```bash
mkdir -p syntaxes
```

2) `syntaxes/chezmoi-templating.injection.tmLanguage.json` を**新規作成**:

```json
{
  "$schema": "https://raw.githubusercontent.com/microsoft/vscode/master/extensions/theme-defaults/syntaxes/tmLanguage.schema.json",
  "scopeName": "chezmoi.templating.injection",
  "injectionSelector": "L:source.shell -comment -string, L:source.powershell -comment -string, L:text.plain -comment -string",
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

> `{{ ... }}`（`{{-`/`-}}` 含む）内部を **Go Template** としてトークナイズ。  
> コメントや文字列中の誤検出を避けるため `-comment -string` を指定。  
> **Go Template 拡張**のスコープは `source.go-template` を想定。

3) `package.json` の **grammars** に登録（注入先のスコープを指定）:

```jsonc
{
  // ...
  "contributes": {
    "grammars": [
      {
        "scopeName": "chezmoi.templating.injection",
        "path": "./syntaxes/chezmoi-templating.injection.tmLanguage.json",
        "injectTo": [
          "source.shell",
          "source.powershell",
          "text.plain"
        ],
        "embeddedLanguages": {
          "meta.embedded.block.go-template": "go-template"
        }
      }
    ]
  }
}
```

> `embeddedLanguages` は括弧対応などの言語機能ヒント用（`go-template` 言語IDを使用）。

---

## 5. メタデータ整備（Marketplace 用）
`package.json` の必須項目を調整:

```jsonc
{
  "name": "chezmoi-template-syntax",
  "displayName": "Chezmoi Template Syntax",
  "publisher": "YOUR_PUBLISHER_ID",
  "version": "0.1.0",
  "engines": { "vscode": "^1.90.0" },
  "description": "Syntax highlighting for chezmoi templated files (.tmpl, .sh.tmpl, .zsh.tmpl, .ps1.tmpl): base language + Go Template injection",
  "categories": ["Programming Languages"],
  "license": "MIT",
  "repository": { "type": "git", "url": "https://github.com/YOUR_REPO/chezmoi-template-syntax.git" },
  "bugs": { "url": "https://github.com/YOUR_REPO/chezmoi-template-syntax/issues" },
  "homepage": "https://github.com/YOUR_REPO/chezmoi-template-syntax#readme",
  "activationEvents": ["onStartupFinished"],
  "main": "./out/extension.js",
  "extensionDependencies": ["jinliming2.vscode-go-template"],
  "contributes": {
    "grammars": [
      {
        "scopeName": "chezmoi.templating.injection",
        "path": "./syntaxes/chezmoi-templating.injection.tmLanguage.json",
        "injectTo": ["source.shell", "source.powershell", "text.plain"],
        "embeddedLanguages": { "meta.embedded.block.go-template": "go-template" }
      }
    ]
  },
  "scripts": {
    "vscode:prepublish": "npm run compile",
    "compile": "tsc -p ./",
    "watch": "tsc -watch -p ./",
    "package": "vsce package",
    "publish": "vsce publish"
  },
  "devDependencies": {
    "@types/vscode": "^1.90.0",
    "typescript": "^5.6.0",
    "vsce": "^3.0.0"
  }
}
```

`README.md` には対象拡張子／スクリーンショット／既知の制約（例：二重LSP不可）を明記。

---

## 6. ビルド＆デバッグ
```bash
npm run compile
# VS Codeでフォルダを開き F5 → Extension Development Host が開く
```

**動作テスト用ファイル例**（ルートに作成）:

`test.sh.tmpl`
```bash
#!/bin/sh
echo "User: {{ .username }} Host: {{ .chezmoi.hostname }}"
{{ if eq .chezmoi.os "linux" -}}
echo "on Linux"
{{- else -}}
echo "not Linux"
{{ end }}
```

`test.ps1.tmpl`
```powershell
Write-Host "User: {{ .username }} Host: {{ .chezmoi.hostname }}"
{{ if eq .chezmoi.os "windows" -}}
Write-Host "on Windows"
{{- end }}
```

`test.tmpl`
```
Hello, {{ .name | default "world" }}!
```

**Scope確認**: `Developer: Inspect Editor Tokens and Scopes`  
→ `{{ if ... }}` 内に `meta.embedded.block.go-template` / `source.go-template` が付与されていればOK。

---

## 7. パッケージング＆公開
1) **Publisher 作成**（初回のみ）  
   - https://marketplace.visualstudio.com/manage で Publisher を作成  
   - Azure DevOps の **PAT**（Marketplace > Manage）を発行  
   - ログイン:
     ```bash
     vsce login YOUR_PUBLISHER_ID
     # -> PAT を貼り付け
     ```

2) **VSIX 作成（任意のローカル検証）**
   ```bash
   npm run package
   # 生成: chezmoi-template-syntax-0.1.0.vsix
   # ローカル導入: code --install-extension ./chezmoi-template-syntax-0.1.0.vsix
   ```

3) **Marketplace 公開**
   ```bash
   npm run publish
   # 以後の更新: 版数を上げて再度 publish（例: vsce publish minor/major も可）
   ```

---

## 8. メンテナンスポイント
- **対象拡張子の追加**: `ASSOCIATIONS` と `injectTo` を適宜拡張。
- **zsh 専用文法を使いたい**: 別の zsh 拡張を入れて `.zsh.tmpl` を `zsh` に紐づけ、`injectTo` に `source.zsh` を追加。
- **テンプレコメント**（`{{/* ... */}}`）などは Go Template 側が面倒を見る。足りなければ Injection に追加パターンを追記。
- **限界**: 同一バッファへの**二重LSP適用は不可**。必要ならテンプレ評価結果を別バッファで開いて LSP を当てる運用を推奨。

---

## 付録: chezmoi テンプレの最小仕様メモ
- 構文: `{{ ... }}`、空白トリム `{{-` / `-}}`  
- 制御: `if` / `else if` / `else` / `end`、`range`、`with`、`define` / `template` など（Go `text/template`）  
- 関数: **Sprig** 全般 + **chezmoi 独自関数**（例：パスワードマネージャ連携、`.chezmoi.os` 等のデータ）  
- 実機検証: `chezmoi execute-template` でプレビュー可能
