import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const { Timer } = require('./Timer');
	const timer = new Timer(context);

	const setTimerCommand = vscode.commands.registerCommand('timer.setTimer', async () => {
		const value = await vscode.window.showInputBox({
			prompt: 'Enter timer duration in seconds',
			validateInput: (input) => {
				const n = Number(input);
				if (isNaN(n) || n <= 0) {
					return 'Please enter a positive number';
				}
				return null;
			}
		});
		if (value) {
			timer.setTimer(Number(value));
		}
	});
	context.subscriptions.push(setTimerCommand);

	const pauseTimerCommand = vscode.commands.registerCommand('timer.pauseTimer', () => timer.pauseTimer());
	context.subscriptions.push(pauseTimerCommand);

	const startTimerCommand = vscode.commands.registerCommand('timer.startTimer', () => timer.startTimer());
	context.subscriptions.push(startTimerCommand);

	const stopTimerCommand = vscode.commands.registerCommand('timer.stopTimer', () => timer.stopTimer());
	context.subscriptions.push(stopTimerCommand);
}

export function deactivate() {}
