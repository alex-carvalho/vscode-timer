import * as vscode from 'vscode';
import { exec } from 'child_process';

export function showNotification(message: string) {
    vscode.window.showInformationMessage(message);}

export function showNotificationWithSound(message: string) {
    vscode.window.showInformationMessage(message);

    if (process.platform === 'darwin') {
        exec('afplay /System/Library/Sounds/Purr.aiff');
    }
}
