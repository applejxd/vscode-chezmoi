import { commands, ConfigurationTarget, ExtensionContext, window, workspace } from "vscode";

/**
 * File associations mapping for chezmoi template files.
 * Maps file patterns to their corresponding VS Code language identifiers.
 * This enables proper syntax highlighting for the base language while allowing
 * Go Template injection through the grammar definition.
 */
const ASSOCIATIONS: Record<string, string> = {
  "*.sh.tmpl": "chezmoi-sh-tmpl",   // Shell script templates with chezmoi support
  "*.zsh.tmpl": "chezmoi-zsh-tmpl", // Zsh templates with chezmoi support
  "*.ps1.tmpl": "chezmoi-ps1-tmpl", // PowerShell script templates with chezmoi support
  "*.py.tmpl": "chezmoi-py-tmpl",   // Python templates with chezmoi support
  "*.toml.tmpl": "chezmoi-toml-tmpl", // TOML templates with chezmoi support
  "*.yaml.tmpl": "chezmoi-yaml-tmpl", // YAML templates with chezmoi support
  "*.yml.tmpl": "chezmoi-yaml-tmpl",  // YAML templates (short extension)
  "*.json.tmpl": "chezmoi-json-tmpl", // JSON templates with chezmoi support
  "*.ini.tmpl": "chezmoi-ini-tmpl",   // INI templates with chezmoi support
  "*.tmpl": "chezmoi-tmpl"          // Generic templates with chezmoi support
};

/**
 * Extension activation function.
 * Called when the extension is activated for the first time.
 *
 * This function:
 * 1. Checks the current VS Code file associations
 * 2. Identifies missing chezmoi template associations
 * 3. Prompts the user to add missing associations
 * 4. Updates the global VS Code settings if user confirms
 *
 * @param ctx - The extension context provided by VS Code
 */
export async function activate(_ctx: ExtensionContext) {
  // Get the current files configuration section
  const cfg = workspace.getConfiguration("files");

  // Retrieve existing file associations, defaulting to empty object if none exist
  const current = (cfg.get<Record<string, string>>("associations") ?? {});

  // Find associations that are missing or different from our desired configuration
  const missing = Object.entries(ASSOCIATIONS).filter(([pattern, language]) => current[pattern] !== language);

  // If all associations are already correctly configured, no action needed
  if (missing.length === 0) {
    return;
  }

  // Prompt user to enable the file associations
  const choice = await window.showInformationMessage(
    "Enable chezmoi template file associations for .tmpl and related files?",
    "Yes",
    "No"
  );

  // Exit if user declined
  if (choice !== "Yes") {
    return;
  }

  // Update the global file associations configuration
  // Merge existing associations with our chezmoi template associations
  try {
    await cfg.update(
      "associations",
      { ...current, ...ASSOCIATIONS },
      ConfigurationTarget.Global
    );

    // Notify user that associations have been added and offer reload
    const action = await window.showInformationMessage(
      "Added chezmoi file associations. Reload to apply.",
      "Reload Now"
    );
    if (action === "Reload Now") {
      await commands.executeCommand("workbench.action.reloadWindow");
    }
  } catch (error) {
    window.showErrorMessage(
      `Failed to update file associations: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Extension deactivation function.
 * Called when the extension is deactivated.
 * Currently no cleanup is needed.
 */
export function deactivate() {
  // No cleanup required for this extension
}
