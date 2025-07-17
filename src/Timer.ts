import * as vscode from 'vscode';

export class Timer {
    private timerInterval: NodeJS.Timeout | undefined;
    private remainingSeconds = 0;
    private isRecurring = false;
    private recurringWaitSeconds = 0;
    private isRunning = false;
    private originalDuration = 0;
    private timerStatusBarItem: vscode.StatusBarItem;
    private stopTimerStatusBarItem: vscode.StatusBarItem;

    constructor(context: vscode.ExtensionContext) {
        this.timerStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
        this.timerStatusBarItem.text = '$(clock) Timer: 00:00';
        this.timerStatusBarItem.tooltip = 'Click to set timer';
        this.timerStatusBarItem.command = 'timer.setTimer';
        this.timerStatusBarItem.show();
        context.subscriptions.push(this.timerStatusBarItem);

        this.stopTimerStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 99);
        this.stopTimerStatusBarItem.text = '$(debug-stop) Stop';
        this.stopTimerStatusBarItem.tooltip = 'Stop timer';
        this.stopTimerStatusBarItem.command = 'timer.stopTimer';
        context.subscriptions.push(this.stopTimerStatusBarItem);

        this.updateTimerDisplay();
    }

    public setTimer(value: number, unit: string, isRecurring: boolean, recurringValue?: number, recurringUnit?: string) {
        this.remainingSeconds = value;
        this.originalDuration = this.remainingSeconds;
        if (isRecurring && recurringValue) {
            this.isRunning = true;
            this.isRecurring = isRecurring;
            this.recurringWaitSeconds = recurringValue;
        } else {
            this.isRecurring = false;
            this.recurringWaitSeconds = 0;
        }
        this.updateTimerDisplay();
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        this.startTimer();
    }

    private startTimer() {
        this.isRunning = true;
        this.timerInterval = setInterval(() => {
            if (this.remainingSeconds > 0) {
                this.remainingSeconds--;
                this.updateTimerDisplay();
            } else {
                clearInterval(this.timerInterval!);
                vscode.window.showInformationMessage(
                    this.isRecurring && this.recurringWaitSeconds > 0
                        ? `Timer finished! Waiting ${this.recurringWaitSeconds} seconds before restarting.`
                        : 'Timer finished!'
                );
                if (this.isRecurring && this.isRunning && this.recurringWaitSeconds > 0) {
                    this.isRunning = false;
                    this.updateTimerDisplay();
                    setTimeout(() => {
                        this.remainingSeconds = this.originalDuration;
                        this.isRunning = true;
                        this.updateTimerDisplay();
                        this.startTimer();
                    }, this.recurringWaitSeconds * 1000);
                } else {
                    this.isRunning = false;
                    this.updateTimerDisplay();
                }
            }
        }, 1000);
    }

    public stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = undefined;
        }
        this.isRunning = false;
        this.isRecurring = false;
        this.updateTimerDisplay();
        vscode.window.showInformationMessage('Timer stopped');
    }

    private updateTimerDisplay() {
        const min = Math.floor(this.remainingSeconds / 60).toString().padStart(2, '0');
        const sec = (this.remainingSeconds % 60).toString().padStart(2, '0');
        this.timerStatusBarItem.text = `$(clock) Timer: ${min}:${sec}${this.isRecurring ? ' (↻)' : ''}`;
        if (this.isRunning) {
            this.stopTimerStatusBarItem.show();
        } else {
            this.stopTimerStatusBarItem.hide();
        }
    }
}
