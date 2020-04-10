import * as assert from 'assert';
import * as path from 'path';

import * as vscode from 'vscode';
import * as myExtension from '../../extension';
import { MulticopyUtil } from '../../util/MulticopyUtil';

const testFolderLocation = '/../../../src/test/suite/test-examples/';

suite('Extension Test Suite', () => {

  vscode.window.showInformationMessage('Started all tests.');

  test('should contain the main multicopy command', async () => {
    const allCommands = await vscode.commands.getCommands();

    const multiCopyCommand = allCommands.filter((command) => {
      return command === 'multicopy';
    });

    assert.strictEqual(multiCopyCommand[0], 'multicopy');
    assert.equal(multiCopyCommand.length, 1);
  });

  test('should contain the deleteItems command for deleting all items', async () => {
    const allCommands = await vscode.commands.getCommands();

    const deleteItemsCommand = allCommands.filter((command) => {
      return command === 'multicopy.deleteItems';
    });

    assert.equal(deleteItemsCommand[0], 'multicopy.deleteItems');
    assert.equal(deleteItemsCommand.length, 1);
  });

  test('should contain the cursorUndoAndDeleteLeft command for dot deletion', async () => {
    const allCommands = await vscode.commands.getCommands();

    const deleteItemsCommand = allCommands.filter((command) => {
      return command === 'multicopy.cursorUndoAndDeleteLeft';
    });

    assert.equal(deleteItemsCommand[0], 'multicopy.cursorUndoAndDeleteLeft');
    assert.equal(deleteItemsCommand.length, 1);
  });

  test('should return if the ts test file is visible and has 12 lines', async () => {
    const uri = vscode.Uri.file(
      path.join(__dirname + testFolderLocation + 'testfile.ts')
    );

    const document = await vscode.workspace.openTextDocument(uri);
    await vscode.window.showTextDocument(document);

    // Test file in examples should contain 12 lines.
    assert.equal(vscode.window.activeTextEditor?.document.lineCount, 12);
  });

  test('should add first line to copied collection after selection', async () => {
    const uri = vscode.Uri.file(
      path.join(__dirname + testFolderLocation + 'testfile.ts')
    );

    const document = await vscode.workspace.openTextDocument(uri);
    await vscode.window.showTextDocument(document);

    await vscode.commands.executeCommand('expandLineSelection');
    await vscode.commands.executeCommand('multicopy');

    const editor = vscode.window.activeTextEditor;

    const line = editor!.document.getText(editor!.selection);

    await vscode.commands.executeCommand('multicopy.deleteItems');

    // Test file's first line should contain the provided line.
    assert.strictEqual('type NonFunctionPropertyNames<T> = {\n', line);
  });

  test('should return list of snippets that were copied to the collection', async () => {
    const uri = vscode.Uri.file(
      path.join(__dirname + testFolderLocation + 'testfile.ts')
    );

    const document = await vscode.workspace.openTextDocument(uri);
    await vscode.window.showTextDocument(document);

    // Select the first line and add it to the collection of copied snippets.
    await vscode.commands.executeCommand('expandLineSelection');
    await vscode.commands.executeCommand('multicopy');

    // Select the previous word and add it to the collection of copied snippets.
    await vscode.commands.executeCommand('cursorHomeSelect');
    await vscode.commands.executeCommand('multicopy');

    // Select the column down the cursor and add it to the collection of copied snippets.
    await vscode.commands.executeCommand('cursorEndSelect');
    await vscode.commands.executeCommand('multicopy');

    const snippets = MulticopyUtil.getListOfSnippets();
    assert.equal(snippets.length, 3);

    // Delete all the items from the collection 
    await vscode.commands.executeCommand('multicopy.deleteItems');
  });

  test('should return no snippet when no snippet was added in the collection', async () => {
    const uri = vscode.Uri.file(
      path.join(__dirname + testFolderLocation + 'testfile.ts')
    );

    const document = await vscode.workspace.openTextDocument(uri);
    await vscode.window.showTextDocument(document);

    const snippets = MulticopyUtil.getListOfSnippets();
    assert.equal(snippets.length, 0);
  });

  test('should return no snippet when we pres alt+m on mac or windows for removing all items', async () => {
    const uri = vscode.Uri.file(
      path.join(__dirname + testFolderLocation + 'testfile.ts')
    );

    const document = await vscode.workspace.openTextDocument(uri);
    await vscode.window.showTextDocument(document);

    // Select the first line and add it to the collection of copied code.
    await vscode.commands.executeCommand('expandLineSelection');
    await vscode.commands.executeCommand('multicopy');

    // Remove the added snippet from the collection.
    await vscode.commands.executeCommand('multicopy.deleteItems');

    const snippets = MulticopyUtil.getListOfSnippets();
    assert.equal(snippets.length, 0);

  });

  vscode.window.showInformationMessage('Ended all tests.');
});
