import { Disposable } from "vscode";

/**
 * Represents a custom command created with a custom name 
 * and with the disposable interface for releasing resources.
 */
export interface CustomCommand {

  // The name of our custom command
  readonly name: string,

  // The additional information for our command
  readonly title: string;

  // The command disposable to release resources
  command: () => Disposable,
}