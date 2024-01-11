import * as vscode from "vscode";
import {
  parseText,
  isBlankText,
  getTextForSearchingForward,
  getLineOffsetForward,
  getCharOffsetForward,
} from "./vim_command_helper";

function findNextWordHead(document: vscode.TextDocument, cursor: vscode.Position): {
  lineOffset: number,
  charOffset: number,
} {
  const textForSearching = getTextForSearchingForward(document, cursor);
  // console.log(textForSearching);

  const tokens = parseText(textForSearching);
  // console.log(tokens);

  let startIndex = 0;
  const cursorText = document.lineAt(cursor.line).text.charAt(cursor.character);
  if (!isBlankText(cursorText)) {
    startIndex = 1;
  }
  let tokenDistance = -1;
  for (let i = startIndex; i < tokens.length; ++i) {
    if (!isBlankText(tokens[i].word)) {
      tokenDistance =  tokens[i].start - 1; // minus 1 to be distance
      break;
    }
  }

  if (tokenDistance === -1) {
    return {
      lineOffset: 0,
      charOffset: 0,
    };
  }

  const lineOffset = getLineOffsetForward(textForSearching, 0, tokenDistance + 1);
  const charOffset = getCharOffsetForward(textForSearching, 0, tokenDistance + 1);
  return {lineOffset, charOffset};
}

export function vimLikeLowerW() {
  const editor = vscode.window.activeTextEditor;
  if (editor === undefined) {
    return;
  }

  const document = vscode.window.activeTextEditor!.document;
  const cursor = vscode.window.activeTextEditor!.selection.active;
  // console.log("cursor: " + cursor);

  const oldSelections = vscode.window.activeTextEditor!.selections;
  const newSelections: vscode.Selection[] = [];
  const {lineOffset, charOffset} = findNextWordHead(document, cursor);
  // console.log("lineOffset: " + lineOffset);
  // console.log("charOffset: " + charOffset);

  for (const oldSelection of oldSelections) {
    const oldCursorPosition = oldSelection.start;
    // console.log("oldCursorPosition: " + oldCursorPosition);
    const newCursorPosition = new vscode.Position(
      oldCursorPosition.line + lineOffset,
      (lineOffset > 0) ? charOffset : oldCursorPosition.character + charOffset
    );
    // console.log("newCursorPosition: " + newCursorPosition);
    const newSelection = new vscode.Selection(newCursorPosition, newCursorPosition);
    newSelections.push(newSelection);
  }

  editor.selections = newSelections;
}
