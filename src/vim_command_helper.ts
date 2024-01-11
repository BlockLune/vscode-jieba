import * as vscode from "vscode";
import { Token, parseSentence } from "./parse";

export function parseText(text:string): Token[] {
  return parseSentence(text);
}

export function isBlankText(text: string): boolean {
  return /^\s*$/.test(text);
}

export function getTextForSearchingForward(document: vscode.TextDocument, cursor: vscode.Position): string {
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

export function getTextForSearchingBackward(document: vscode.TextDocument, cursor: vscode.Position): string {
  // 范围是从当前光标位置开始，到上一个非空行头部结束
  let textForSearching = document.lineAt(cursor.line).text.slice(0, cursor.character) + "\n";

  for (let curLine = cursor.line - 1; curLine >= 0; --curLine) {
    const curLineText = document.lineAt(curLine).text + "\n";
    textForSearching += curLineText;
    if (!isBlankText(curLineText)) {
      break;
    }
  }

  return textForSearching;
}

function getLastNewLinePosition(str: string): number {
  return str.lastIndexOf("\n");
}

export function getLineOffsetForward(textForSearching: string, start: number, end: number):number {
  const matches = textForSearching.slice(start, end).match(/\n/g);
  return matches ? matches.length : 0;
}


export function getCharOffsetForward(textForSearching: string, start: number, end: number): number {
  return end - getLastNewLinePosition(textForSearching.slice(start, end)) - 1;
}