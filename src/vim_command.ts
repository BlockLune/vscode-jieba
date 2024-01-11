import * as vscode from "vscode";
import { Token, parseSentence } from "./parse";

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

function findNextWordHead(document: vscode.TextDocument, cursor: vscode.Position): number {
  const textForSearching = getTextForSearchingForward(document, cursor);
  console.log(textForSearching);

  const tokens = parseText(textForSearching);
  console.log(tokens);

  let startIndex = 0;
  const cursorText = document.lineAt(cursor.line).text.charAt(cursor.character);
  if (!isBlankText(cursorText)) {
    startIndex = 1;
  }
  for (let i = startIndex; i < tokens.length; ++i) {
    const token = tokens[i];
    if (!isBlankText(token.word)) {
      return token.start;
    }
  }
  return -1; // if not found
}

export function testFindNextWordHead() {
  const document = vscode.window.activeTextEditor!.document;
  const cursor = vscode.window.activeTextEditor!.selection.active;
  const oldSelections = vscode.window.activeTextEditor!.selections;

  console.log(cursor);
  const nextWordHead = findNextWordHead(document, cursor);
  console.log(nextWordHead);

  for (const selection of oldSelections) {
  }
}
