import * as vscode from 'vscode';

import { Timer } from './Timer';

export function activate(context: vscode.ExtensionContext) {
	
	const timer = new Timer(context);

	const setTimerCommand = vscode.commands.registerCommand('timer.setTimer', async () => {
		const config = vscode.workspace.getConfiguration();
		const unit = config.get<string>('timer.unit', 'seconds');
		const prompt = `Enter timer duration in ${unit}. (use preference setting to change unit)`;
		const value = await vscode.window.showInputBox({
			prompt,
			validateInput: (input) => {
				const n = Number(input);
				if (isNaN(n) || n <= 0) {
					return 'Please enter a positive number';
				}
				return null;
			}
		});
		if (value) {
			let seconds = Number(value);
			if (unit === 'minutes') {
				seconds = seconds * 60;
			}
			timer.setTimer(seconds);
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
