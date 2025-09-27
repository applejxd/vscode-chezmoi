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
