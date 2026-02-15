import { ConfigurationTarget, ExtensionContext, window, workspace } from "vscode";

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
export async function activate(ctx: ExtensionContext) {
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
    "Enable chezmoi templated file associations? (.tmpl/.sh.tmpl/.zsh.tmpl/.ps1.tmpl/.py.tmpl)",
    "Yes",
    "No"
  );

  // Exit if user declined
  if (choice !== "Yes") {
    return;
  }

  // Update the global file associations configuration
  // Merge existing associations with our chezmoi template associations
  await cfg.update(
    "associations",
    { ...current, ...ASSOCIATIONS },
    ConfigurationTarget.Global
  );

  // Notify user that associations have been added
  window.showInformationMessage("Added chezmoi file associations. Reload to apply.");
}

/**
 * Extension deactivation function.
 * Called when the extension is deactivated.
 * Currently no cleanup is needed.
 */
export function deactivate() {
  // No cleanup required for this extension
}
