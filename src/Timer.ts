import * as vscode from 'vscode';


export class Timer {
    private timerInterval: NodeJS.Timeout | undefined;
    private timerTime = 0;
    private remainingSeconds = 0;
    private isRunning = false;
    private timerStatusBarItem: vscode.StatusBarItem;
    private stopTimerStatusBarItem: vscode.StatusBarItem;
    private startTimerStatusBarItem: vscode.StatusBarItem;

    constructor(context: vscode.ExtensionContext) {
        this.timerStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        this.timerStatusBarItem.text = '$(clock) Timer: 00:00';
        this.timerStatusBarItem.tooltip = 'Click to set timer';
        this.timerStatusBarItem.command = 'timer.setTimer';
        this.timerStatusBarItem.show();
        context.subscriptions.push(this.timerStatusBarItem);

        this.stopTimerStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 99);
        this.stopTimerStatusBarItem.text = '$(debug-stop) Stop';
        this.stopTimerStatusBarItem.tooltip = 'Stop timer';
        this.stopTimerStatusBarItem.command = 'timer.stopTimer';
        context.subscriptions.push(this.stopTimerStatusBarItem);

        this.startTimerStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 98);
        this.startTimerStatusBarItem.text = '$(debug-start) Resume';
        this.startTimerStatusBarItem.tooltip = 'Resume timer';
        this.startTimerStatusBarItem.command = 'timer.startTimer';
        context.subscriptions.push(this.startTimerStatusBarItem);

        this.updateTimerDisplay();
    }

    public setTimer(seconds: number) {
        this.timerTime = seconds;
        this.remainingSeconds = seconds;
        this.updateTimerDisplay();
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        this.startTimerCountDown();
    }

    private startTimerCountDown() {
        this.isRunning = true;
        this.timerInterval = setInterval(() => {
            if (this.remainingSeconds > 0) {
                this.remainingSeconds--;
                this.updateTimerDisplay();
            } else {
                clearInterval(this.timerInterval!);
                this.isRunning = false;
                this.remainingSeconds = this.timerTime;
                this.updateTimerDisplay();
                vscode.window.showInformationMessage('Timer finished!');
            }
        }, 1000);
    }

    public startTimer() {
        if (!this.isRunning && this.remainingSeconds > 0) {
            this.startTimerCountDown();
        }
    }

    public stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = undefined;
        }
        this.isRunning = false;
        this.updateTimerDisplay();
        vscode.window.showInformationMessage('Timer stopped');
    }

    private updateTimerDisplay() {
        const min = Math.floor(this.remainingSeconds / 60).toString().padStart(2, '0');
        const sec = (this.remainingSeconds % 60).toString().padStart(2, '0');
        this.timerStatusBarItem.text = `$(clock) Timer: ${min}:${sec}`;
        if (this.isRunning) {
            this.stopTimerStatusBarItem.show();
            this.startTimerStatusBarItem.hide();
        } else {
            this.stopTimerStatusBarItem.hide();

            if (this.remainingSeconds > 0) {
                this.startTimerStatusBarItem.show();
            }
        }
    }
}
