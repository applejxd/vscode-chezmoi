import * as assert from 'assert';

/**
 * Test suite for the Chezmoi Template Syntax extension.
 *
 * This file contains unit tests to verify the extension's functionality.
 * Tests are run using Mocha framework within VS Code's test environment.
 *
 * Note: You can import and use all API from the 'vscode' module
 * as well as import your extension to test it
 */
import * as vscode from 'vscode';
// Uncomment the line below to import and test extension functions directly
// import * as myExtension from '../../extension';

/**
 * Main test suite for the extension.
 * Groups all tests related to the Chezmoi Template Syntax extension.
 */
suite('Extension Test Suite', () => {
	// Display information message when tests start
	vscode.window.showInformationMessage('Start all tests.');

	/**
	 * Sample test demonstrating basic array operations.
	 * This is a placeholder test that verifies the testing framework works correctly.
	 *
	 * TODO: Replace with actual extension functionality tests such as:
	 * - File association configuration tests
	 * - Extension activation/deactivation tests
	 * - Grammar injection verification tests
	 */
	test('Sample test', () => {
		// Test that indexOf returns -1 for elements not in the array
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});
});
