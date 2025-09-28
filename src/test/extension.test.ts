import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';

/**
 * Test suite for the Chezmoi Template Syntax extension.
 *
 * This file contains unit tests to verify the extension's functionality.
 * Tests are run using Mocha framework within VS Code's test environment.
 */

/**
 * Main test suite for the extension.
 * Groups all tests related to the Chezmoi Template Syntax extension.
 */
suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	/**
	 * Test that chezmoi template files are recognized with correct language IDs
	 */
	test('File language association', async () => {
		// Get the workspace folder
		const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
		assert.ok(workspaceFolder, 'Workspace folder should be available');

		// Test .tmpl file
		const tmplPath = path.join(workspaceFolder.uri.fsPath, 'test', 'fixtures', 'test.tmpl');
		const tmplUri = vscode.Uri.file(tmplPath);
		const tmplDoc = await vscode.workspace.openTextDocument(tmplUri);
		assert.strictEqual(tmplDoc.languageId, 'chezmoi-tmpl', 'test.tmpl should be recognized as chezmoi-tmpl language');

		// Test .sh.tmpl file
		const shTmplPath = path.join(workspaceFolder.uri.fsPath, 'test', 'fixtures', 'test.sh.tmpl');
		const shTmplUri = vscode.Uri.file(shTmplPath);
		const shTmplDoc = await vscode.workspace.openTextDocument(shTmplUri);
		assert.strictEqual(shTmplDoc.languageId, 'chezmoi-sh-tmpl', 'test.sh.tmpl should be recognized as chezmoi-sh-tmpl language');

		// Test .ps1.tmpl file
		const ps1TmplPath = path.join(workspaceFolder.uri.fsPath, 'test', 'fixtures', 'test.ps1.tmpl');
		const ps1TmplUri = vscode.Uri.file(ps1TmplPath);
		const ps1TmplDoc = await vscode.workspace.openTextDocument(ps1TmplUri);
		assert.strictEqual(ps1TmplDoc.languageId, 'chezmoi-ps1-tmpl', 'test.ps1.tmpl should be recognized as chezmoi-ps1-tmpl language');

		// Test .zsh.tmpl file
		const zshTmplPath = path.join(workspaceFolder.uri.fsPath, 'test', 'fixtures', 'test.zsh.tmpl');
		const zshTmplUri = vscode.Uri.file(zshTmplPath);
		const zshTmplDoc = await vscode.workspace.openTextDocument(zshTmplUri);
		assert.strictEqual(zshTmplDoc.languageId, 'chezmoi-zsh-tmpl', 'test.zsh.tmpl should be recognized as chezmoi-zsh-tmpl language');
	});

	/**
	 * Test that extension dependencies are available
	 */
	test('Extension dependencies', () => {
		const goTemplateExt = vscode.extensions.getExtension('jinliming2.vscode-go-template');
		assert.ok(goTemplateExt, 'Go Template extension should be available as dependency');
	});

	/**
	 * Test that the extension contributes the expected languages
	 */
	test('Language contributions', () => {
		const languages = vscode.languages.getLanguages();
		return languages.then(langs => {
			assert.ok(langs.includes('chezmoi-tmpl'), 'chezmoi-tmpl language should be contributed');
			assert.ok(langs.includes('chezmoi-sh-tmpl'), 'chezmoi-sh-tmpl language should be contributed');
			assert.ok(langs.includes('chezmoi-zsh-tmpl'), 'chezmoi-zsh-tmpl language should be contributed');
			assert.ok(langs.includes('chezmoi-ps1-tmpl'), 'chezmoi-ps1-tmpl language should be contributed');
		});
	});
});
