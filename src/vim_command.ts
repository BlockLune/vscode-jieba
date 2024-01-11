import * as vscode from "vscode";
import { Token, parseSentence } from "./parse";
import { text } from "stream/consumers";

function parseText(text:string): Token[] {
  return parseSentence(text);
}

function isBlankText(text: string): boolean {
  return /^\s*$/.test(text);
}

function getTextForSearchingForward(document: vscode.TextDocument, cursor: vscode.Position): string {
  // 范围是从当前光标位置开始，到下一个非空行末尾结束
  let textForSearching = document.lineAt(cursor.line).text.slice(cursor.character) + "\n";

  for (let curLine = cursor.line + 1; curLine < document.lineCount; ++curLine) {
    const curLineText = document.lineAt(curLine).text + "\n";
    textForSearching += curLineText;
    if (!isBlankText(curLineText)) {
      break;
    }
  }

  return textForSearching;
}

function getLineOffset(textForSearching: string, start: number, end: number):number {
  const matches = textForSearching.slice(start, end).match(/\n/g);
  return matches ? matches.length : 0;
}

function getLastNewLinePosition(str: string): number {
  return str.lastIndexOf("\n");
}

function getCharOffset(textForSearching: string, start: number, end: number): number {
  return end - getLastNewLinePosition(textForSearching.slice(start, end)) - 1;
}


function findNextWordHead(document: vscode.TextDocument, cursor: vscode.Position): {
  lineOffset: number,
  charOffset: number,
} {
  const textForSearching = getTextForSearchingForward(document, cursor);
  console.log(textForSearching);

  const tokens = parseText(textForSearching);
  console.log(tokens);

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

  const lineOffset = getLineOffset(textForSearching, 0, tokenDistance + 1);
  const charOffset = getCharOffset(textForSearching, 0, tokenDistance + 1);
  return {lineOffset, charOffset};
}

export function testFindNextWordHead() {
  const editor = vscode.window.activeTextEditor;
  if (editor === undefined) {
    return;
  }

  const document = vscode.window.activeTextEditor!.document;
  const cursor = vscode.window.activeTextEditor!.selection.active;
  console.log("cursor: " + cursor);

  const oldSelections = vscode.window.activeTextEditor!.selections;
  const newSelections: vscode.Selection[] = [];

  const {lineOffset, charOffset} = findNextWordHead(document, cursor);
  console.log("lineOffset: " + lineOffset);
  console.log("charOffset: " + charOffset);

  for (const oldSelection of oldSelections) {
    const oldCursorPosition = oldSelection.start;
    console.log("oldCursorPosition: " + oldCursorPosition);
    const newCursorPosition = new vscode.Position(
      oldCursorPosition.line + lineOffset,
      (lineOffset > 0) ? charOffset : oldCursorPosition.character + charOffset
    );
    console.log("newCursorPosition: " + newCursorPosition);
    const newSelection = new vscode.Selection(newCursorPosition, newCursorPosition);
    newSelections.push(newSelection);
  }

  editor.selections = newSelections;
}
