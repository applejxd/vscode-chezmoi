import * as assert from 'assert';
import * as path from 'path';
import * as sinon from 'sinon';
import * as vscode from 'vscode';

/**
 * Test suite for the Chezmoi Template Syntax extension.
 *
 * Uses parameterized test data and sinon for mocking VS Code APIs.
 */

/** Test data mapping fixture files to expected language IDs */
const FILE_LANGUAGE_MAP: ReadonlyArray<{ readonly file: string; readonly langId: string }> = [
	{ file: 'test.tmpl', langId: 'chezmoi-tmpl' },
	{ file: 'test.sh.tmpl', langId: 'chezmoi-sh-tmpl' },
	{ file: 'test.zsh.tmpl', langId: 'chezmoi-zsh-tmpl' },
	{ file: 'test.ps1.tmpl', langId: 'chezmoi-ps1-tmpl' },
	{ file: 'test.py.tmpl', langId: 'chezmoi-py-tmpl' },
	{ file: 'test.toml.tmpl', langId: 'chezmoi-toml-tmpl' },
	{ file: 'test.yaml.tmpl', langId: 'chezmoi-yaml-tmpl' },
	{ file: 'test.json.tmpl', langId: 'chezmoi-json-tmpl' },
	{ file: 'test.ini.tmpl', langId: 'chezmoi-ini-tmpl' },
];

const ALL_LANGUAGE_IDS = FILE_LANGUAGE_MAP.map(({ langId }) => langId);

suite('Extension Test Suite', () => {

	suite('File Language Associations', () => {
		for (const { file, langId } of FILE_LANGUAGE_MAP) {
			test(`${file} → ${langId}`, async () => {
				const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
				assert.ok(workspaceFolder, 'Workspace folder should be available');

				const filePath = path.join(workspaceFolder.uri.fsPath, 'test', 'fixtures', file);
				const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(filePath));
				assert.strictEqual(doc.languageId, langId, `${file} should map to ${langId}`);
			});
		}
	});

	test('Extension dependencies: Go Template extension', () => {
		const ext = vscode.extensions.getExtension('jinliming2.vscode-go-template');
		assert.ok(ext, 'Go Template extension should be available');
	});

	test('All language IDs are registered', async () => {
		const langs = await vscode.languages.getLanguages();
		for (const langId of ALL_LANGUAGE_IDS) {
			assert.ok(langs.includes(langId), `${langId} should be registered`);
		}
	});

	suite('Extension Activation', () => {
		let sandbox: sinon.SinonSandbox;

		setup(() => {
			sandbox = sinon.createSandbox();
		});

		teardown(() => {
			sandbox.restore();
		});

		test('Extension is present', () => {
			const ext = vscode.extensions.getExtension('applejxd.chezmoi-template-syntax');
			assert.ok(ext, 'Extension should be installed');
		});

		test('Extension activates successfully', async () => {
			const ext = vscode.extensions.getExtension('applejxd.chezmoi-template-syntax');
			assert.ok(ext);
			if (!ext.isActive) {
				await ext.activate();
			}
			assert.ok(ext.isActive, 'Extension should be active');
		});

		test('activate() does not throw on re-invocation', async () => {
			// Stub the info message to prevent UI interaction during test
			const stub = sandbox.stub(vscode.window, 'showInformationMessage') as sinon.SinonStub;
			stub.resolves(undefined);

			const { activate } = require('../extension') as typeof import('../extension');
			await assert.doesNotReject(
				() => activate({} as vscode.ExtensionContext),
				'activate() should handle re-invocation gracefully'
			);
		});

		test('deactivate() is exported as a function', () => {
			const ext = require('../extension') as typeof import('../extension');
			assert.strictEqual(typeof ext.deactivate, 'function');
		});
	});
});
