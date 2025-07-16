import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Timer status bar item
	const timerStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
	timerStatusBarItem.text = '$(clock) Timer: 00:00';
	timerStatusBarItem.tooltip = 'Click to set timer';
	timerStatusBarItem.command = 'timer.setTimer';
	timerStatusBarItem.show();
	context.subscriptions.push(timerStatusBarItem);
	
	const stopTimerStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 99);
	stopTimerStatusBarItem.text = '$(debug-stop) Stop';
	stopTimerStatusBarItem.tooltip = 'Stop timer';
	stopTimerStatusBarItem.command = 'timer.stopTimer';
	context.subscriptions.push(stopTimerStatusBarItem);

	let timerInterval: NodeJS.Timeout | undefined;
	let remainingSeconds = 0;
	let isRecurring = false;
	let recurringDuration = 0;
	let recurringUnit = 'minutes';
	let isRunning = false;
	let originalDuration = 0;

	const updateTimerDisplay = () => {
		const min = Math.floor(remainingSeconds / 60).toString().padStart(2, '0');
		const sec = (remainingSeconds % 60).toString().padStart(2, '0');
		timerStatusBarItem.text = `$(clock) Timer: ${min}:${sec}${isRecurring ? ' (↻)' : ''}`;
		
		if (isRunning) {
			stopTimerStatusBarItem.show();
		} else {
			stopTimerStatusBarItem.hide();
		}
	};

	   const setTimerCommand = vscode.commands.registerCommand('timer.setTimer', async () => {
			   // Create WebviewPanel with form
			   const panel = vscode.window.createWebviewPanel(
				   'timerConfig',
				   'Timer Configuration',
				   vscode.ViewColumn.One,
				   { enableScripts: true }
			   );
			   
			   // Load HTML content from file
			   const fs = require('fs');
			   const path = require('path');
			   const htmlPath = path.join(context.extensionPath, 'src', 'timerConfig.html');
			   panel.webview.html = fs.readFileSync(htmlPath, 'utf8');
			   
			   // Handle messages from webview
			   panel.webview.onDidReceiveMessage(
				   message => {
					   const { value, unit, isRecurring: recurring, recurringValue, recurringUnit } = message;
					   remainingSeconds = unit === 'minutes' ? value * 60 : value;
					   originalDuration = remainingSeconds;
					   panel.dispose();
					   
					   // Store recurring settings
					   if (recurring && recurringValue) {
						   isRunning = true;
						   isRecurring = recurring;
						   recurringDuration = recurringUnit === 'minutes' ? recurringValue * 60 : recurringValue;
					   }
					   
					   updateTimerDisplay();
					   if (timerInterval) {
						   clearInterval(timerInterval);
					   }
					   
					   const startTimer = () => {
						   timerInterval = setInterval(() => {
							   if (remainingSeconds > 0) {
								   remainingSeconds--;
								   updateTimerDisplay();
							   } else {
								   clearInterval(timerInterval!);
								   vscode.window.showInformationMessage('Timer finished!');
								   
								   // Start recurring timer if enabled
								   if (isRecurring && isRunning) {
									   remainingSeconds = recurringDuration;
									   updateTimerDisplay();
									   startTimer();
								   } else {
									   isRunning = false;
									   updateTimerDisplay();
								   }
							   }
						   }, 1000);
					   };
					   
					   startTimer();
				   }
			   );
	   });
	   context.subscriptions.push(setTimerCommand);
	   
	   // Register stop timer command
	   const stopTimerCommand = vscode.commands.registerCommand('timer.stopTimer', () => {
		   if (timerInterval) {
			   clearInterval(timerInterval);
			   timerInterval = undefined;
		   }
		   isRunning = false;
		   isRecurring = false;
		   updateTimerDisplay();
		   vscode.window.showInformationMessage('Timer stopped');
	   });
	   context.subscriptions.push(stopTimerCommand);
	   
}

// This method is called when your extension is deactivated
export function deactivate() {}
