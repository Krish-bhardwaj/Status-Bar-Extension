import * as vscode from 'vscode';

let myStatusBarItem: vscode.StatusBarItem;

let ethcodeExtension: any = vscode.extensions.getExtension('7finney.ethcode');
let api = ethcodeExtension.exports;

export function activate({ subscriptions }: vscode.ExtensionContext) {
	
	console.log('Congratulations, your extension "statusbartestextension" is now active!');

	const myCommandId = 'statusbartestextension.showSelectionCount';
	subscriptions.push(vscode.commands.registerCommand(myCommandId, () => {
		const n = getNumberOfSelectedLines(vscode.window.activeTextEditor);
		vscode.window.showInformationMessage(`Yeah, ${n} line(s) selected... Keep going!`);
	}));

	myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	myStatusBarItem.command = myCommandId;
	subscriptions.push(myStatusBarItem);

	subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem));
	subscriptions.push(vscode.window.onDidChangeTextEditorSelection(updateStatusBarItem));

	updateStatusBarItem();
}


function updateStatusBarItem(): void {
	const n = getNumberOfSelectedLines(vscode.window.activeTextEditor);
	if (n > 0) {
		myStatusBarItem.text = `${n} line(s) selected ${api.status()}`;
		myStatusBarItem.show();
	} else {
		myStatusBarItem.hide();
	}
}

function getNumberOfSelectedLines(editor: vscode.TextEditor | undefined): number {
	let lines = 0;
	if (editor) {
		lines = editor.selections.reduce((prev, curr) => prev + (curr.end.line - curr.start.line), 0);
	}
	return lines;
}
