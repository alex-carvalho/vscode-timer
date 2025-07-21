import * as assert from 'assert';
import * as sinon from 'sinon';
import * as vscode from 'vscode';
import { Timer } from '../Timer';

suite('Timer Class', () => {
    let timer: Timer;
    let contextStub: any;
    let showInfoStub: sinon.SinonStub;

    setup(() => {
        contextStub = { subscriptions: [] };
        showInfoStub = sinon.stub(vscode.window, 'showInformationMessage');
        timer = new Timer(contextStub);
    });

    teardown(() => {
        showInfoStub.restore();
    });

    test('setTimer sets the timer and starts countdown', () => {
        timer.setTimer(2);
        assert.strictEqual((timer as any).timerTime, 2);
        assert.strictEqual((timer as any).remainingSeconds, 2);
        timer.stopTimer();
    });

    test('pauseTimer pauses the timer', () => {
        timer.setTimer(2);
        timer.pauseTimer();
        assert.strictEqual((timer as any).isRunning, false);
        sinon.assert.calledWith(showInfoStub, 'Timer paused');
        timer.stopTimer();
    });

    test('stopTimer resets the timer', () => {
        timer.setTimer(2);
        timer.stopTimer();
        assert.strictEqual((timer as any).remainingSeconds, 2);
        sinon.assert.calledWith(showInfoStub, 'Timer reset');
    });

    test('startTimer resumes the timer', () => {
        timer.setTimer(2);
        timer.pauseTimer();
        timer.startTimer();
        assert.strictEqual((timer as any).isRunning, true);
        timer.stopTimer();
    });
});
