import * as vscode from "vscode";
import {
  backwardKillWord,
  backwardWord,
  forwardWord,
  killWord,
  selectWord,
} from "./command";
import { vimLikeLowerW } from "./vim_command_w";
import { vimLowerE } from "./vim_command_e";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("jieba.vimLikeLowerW", vimLikeLowerW),
    vscode.commands.registerCommand("jieba.vimLowerE", vimLowerE),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("jieba.forwardWord", forwardWord),
    vscode.commands.registerCommand("jieba.backwardWord", backwardWord),
    vscode.commands.registerCommand("jieba.killWord", killWord),
    vscode.commands.registerCommand("jieba.backwardKillWord", backwardKillWord),
    vscode.commands.registerCommand("jieba.selectWord", selectWord),
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
