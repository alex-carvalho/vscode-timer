import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const { Timer } = require('./Timer');
	const timer = new Timer(context);

	const setTimerCommand = vscode.commands.registerCommand('timer.setTimer', async () => {
		
		const panel = vscode.window.createWebviewPanel(
			'timerConfig',
			'Timer Configuration',
			vscode.ViewColumn.One,
			{ enableScripts: true }
		);

		const fs = require('fs');
		const path = require('path');
		const htmlPath = path.join(context.extensionPath, 'src', 'timerConfig.html');
		panel.webview.html = fs.readFileSync(htmlPath, 'utf8');

		panel.webview.onDidReceiveMessage(
			message => {
				const { value, unit, isRecurring, recurringValue, recurringUnit } = message;
				panel.dispose();
				timer.setTimer(value, unit, isRecurring, recurringValue, recurringUnit);
			}
		);
	});
	context.subscriptions.push(setTimerCommand);

	const stopTimerCommand = vscode.commands.registerCommand('timer.stopTimer', () => {
		timer.stopTimer();
	});
	context.subscriptions.push(stopTimerCommand);
}

export function deactivate() {}
