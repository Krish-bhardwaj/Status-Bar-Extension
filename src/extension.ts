import * as vscode from 'vscode';
import { getAddress } from '@ethersproject/address';
import { ethers } from 'ethers';
let network: vscode.StatusBarItem;
let account: vscode.StatusBarItem;

let ethcodeExtension: any = vscode.extensions.getExtension('7finney.ethcode');
let api = ethcodeExtension.exports;

let localnetwork: string;
let localaccount: string;

export function activate({ subscriptions }: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "statusbartestextension" is now active!');

	const myCommandId = 'statusbartestextension.showSelectionCount';
	subscriptions.push(vscode.commands.registerCommand(myCommandId, () => {
		vscode.window.showInformationMessage(`${api.status()}`);
	}));

	// Network
	network = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	network.command = myCommandId;
	subscriptions.push(network);

	api.ethcode.network.event(
		async (network: string) => {
			vscode.window.showInformationMessage(`Network : ${network} `);
			localnetwork = network;
			updateStatusBarNetwork();

			let temp = await api.provider.get();
			temp.getGasPrice().then((result: any) => {
				vscode.window.showInformationMessage(`Gas Price : ${result} `);
			}).catch((err: any) => {
				vscode.window.showInformationMessage(`Gas Price : ${err} `);
			});
		}
	);

	updateStatusBarNetwork();

	// Account
	account = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	account.command = myCommandId;
	subscriptions.push(account);
	api.ethcode.account.event(
		(account: string) => {
			vscode.window.showInformationMessage(`Account : ${account} `);
			localaccount = account;
			updateStatusBarAccount();
		}
	);
	updateStatusBarAccount();
}


function isAddress(value: any): string | false {
	try {
		return getAddress(value);
	} catch {
		return false;
	}
}

function shortenAddress(address: string, chars = 4): string {
	const parsed = isAddress(address);
	if (!parsed) {
		throw Error(`Invalid 'address' parameter '${address}'.`);
	}
	return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
}

function updateStatusBarNetwork(): void {
	network.text = `( Ethcode ) Network : ${localnetwork}`;
	network.show();
}

function updateStatusBarAccount(): void {

	network.text = `( Ethcode ) Account : ${shortenAddress(localaccount)}`;
	network.show();
}
