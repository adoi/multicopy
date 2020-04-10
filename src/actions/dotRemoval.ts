import {
  commands as Commands, Disposable,
} from "vscode";
import { CustomCommand } from "../interface/CustomCommand";

// Custom command name
function name(): string { return 'multicopy.cursorUndoAndDeleteLeft'; };

// Custom command title (description) to put it in item.command
function title(): string { return 'Deletes the dot'; };

/**
 * Registered custom command which deletes the dot after we insert the  
 * items from the collection.
 *
 * @returns {CustomCommand} Release resources after executing the command, return command information too.
 */
export function dotRemoval(): CustomCommand {
  return {
    name: name(),
    title: title(),
    command: function (): Disposable {
      return Commands.registerCommand(name(), async () => {
        await Commands.executeCommand('cursorUndo');
        await Commands.executeCommand('deleteLeft');
      });
    }
  };
}