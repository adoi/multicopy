import {
  commands as Commands,
  window as Window,
  languages as Languages,
  ExtensionContext,
  CompletionItem,
  Disposable,
  CompletionList,
  MarkdownString,
  CompletionItemKind,
} from 'vscode';

import { MulticopyUtil } from './util/MulticopyUtil';
import { dotRemoval } from './actions/dotRemoval';
import { ERROR, INFORMATION, SNIPPET } from './constants/contants';

/**
 * Activate the extension
 *
 * @param {ExtensionContext} context The context which will be subsribed to
 */
export function activate(context: ExtensionContext) {

  // Array which contains all the snippets
  const snippets: Array<CompletionItem> = [];

  /**
   * Add new snippet to the snippet collection after triggering the multicopy command.
   *
   * @return {Disposable} Release resources after adding snippet.
   */
  function insertionDisponsable(): Disposable {

    // Execute this after the command is pressed.
    return Commands.registerCommand('multicopy', () => {
      const editor = Window.activeTextEditor;
      if (!editor) {
        return Window.showErrorMessage(ERROR.SNIPPETS_EMPTY);
      }

      // Note: vscode.CompletionItemKind.Function has been set to function, but it doesn't mean every snippet section is a function. Could be changed in the future.
      snippets.push(new CompletionItem(editor.document.getText(editor.selection), CompletionItemKind.Function));

      // Message box to the user
      Window.showInformationMessage(INFORMATION.SNIPPET_ADDED);
    });
  };

  /**
   * Remove all the snippets from the collection.
   *
   * @return {Disposable} Release resources afeter items deletion
   */
  function removalDisponsable(): Disposable {
    return Commands.registerCommand('multicopy.deleteItems', () => {
      const editor = Window.activeTextEditor;
      if (!editor) {
        return Window.showErrorMessage(ERROR.SNIPPETS_EMPTY);
      }
      snippets.splice(0, snippets.length);
      Window.showInformationMessage(INFORMATION.SNIPPETS_REMOVED);
    });
  };

  /**
   * Get the list of snippets and also modify the snippet.
   *
   * @return {Disposable} Release resources after returning the snippets and modifying them.
   */
  function listDisponsable(): Disposable {
    // Trigger a new intellisense window with the snippets when . is typed
    return Languages.registerCompletionItemProvider(
      '*',
      {
        provideCompletionItems() {
          return new CompletionList(snippets);
        },
        resolveCompletionItem(item: CompletionItem) {
          if (!item) {
            Window.showErrorMessage(ERROR.SNIPPETS_EMPTY);
          }

          // Customize the boxes for clarity.
          item.detail = SNIPPET.HEADER;
          item.documentation = new MarkdownString('').appendCodeblock(item.label);

          // Call the registered command to delete the dot after inserting the copied snippet
          item.command = { command: dotRemoval().name, title: dotRemoval().title };

          return item;
        },
      },
      '.'
    );
  };

  // Set the extension context to be the current context
  MulticopyUtil.setExtensionContext(context);

  // Get list of snippets (needed for testing)
  MulticopyUtil.setListOfSnippets(snippets);

  // Array of subscriptions to disposables
  context.subscriptions.push(
    dotRemoval().command(),
    insertionDisponsable(),
    listDisponsable(),
    removalDisponsable()
  );

}

// Deactivate Execution
export function deactivate() {
  const { subscriptions }: ExtensionContext = MulticopyUtil.getExtensionContext();
  // Dispose and remove each subscription from the current context
  subscriptions.forEach((item) => {
    if (item) {
      item.dispose();
    }
  });
  subscriptions.splice(0, subscriptions.length);
}
