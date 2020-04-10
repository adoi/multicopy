import {
  ExtensionContext,
  extensions as Extensions,
  Extension,
  CompletionItem
} from 'vscode';

export class MulticopyUtil {
  // Enabled extension's context.
  private static extensionContext: ExtensionContext;

  // Reference copy of snippets [for testing].
  private static snippets: Array<CompletionItem> = [];

  /**
   * Get enabled extenson
   * 
   * @return {Extension} Enabled extension's status.
   */
  public static getExtension(): Extension<any> {
    return Extensions.getExtension('multicopy')!;
  }

  /**
   * Get status of enabled extension,
   * 
   * @return {boolean} Enabled extension's status.
   */
  public static isActive(): boolean {
    return this.getExtension().isActive;
  }

  /**
   * Activate enabled extension
   * 
   * @return {Thenable<void>} Current extension context (promise).
   */
  public static activateExtension(): Thenable<void> {
    return this.getExtension().activate();
  }

  /**
   * Get the current extension context.
   * 
   * @return {ExtensionContext} Current extension context.
   */
  public static getExtensionContext(): ExtensionContext {
    return this.extensionContext;
  }

  /**
   * Set extension's context.
   * 
   * @param {ExtensionContext} context Execution context for multicopy extension.
   * @return {Disposable} Release resources after returning the snippets and modifying them.
   */
  public static setExtensionContext(context: ExtensionContext) {
    this.extensionContext = context;
  }

  /**
   * Set list of snippets for testing.
   * 
   * @param {Array<CompletionItem>} snippets List of snippets.
   * @return {Disposable} Release resources after returning the snippets and modifying them.
   */
  public static setListOfSnippets(snippets: Array<CompletionItem>) {
    this.snippets = snippets;
  }

  /**
   * Get list of all snippets.
   * 
   * @return {Array<CompletionItem>} List of snippets.
   */
  public static getListOfSnippets() {
    return this.snippets;
  }

}