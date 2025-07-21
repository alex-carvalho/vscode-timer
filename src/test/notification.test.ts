import * as assert from 'assert';
import * as sinon from 'sinon';
import * as vscode from 'vscode';
import * as Notification from '../Notification';

suite('Notification', () => {
    let showInfoStub: sinon.SinonStub;
    let execStub: sinon.SinonStub;

    setup(() => {
        showInfoStub = sinon.stub(vscode.window, 'showInformationMessage');
        execStub = sinon.stub(require('child_process'), 'exec');
    });

    teardown(() => {
        showInfoStub.restore();
        execStub.restore();
    });

    test('showNotification calls showInformationMessage', () => {
        Notification.showNotification('Test message');
        sinon.assert.calledWith(showInfoStub, 'Test message');
    });

    test('showNotificationWithSound calls showInformationMessage', () => {
        Notification.showNotificationWithSound('Test sound');
        sinon.assert.calledWith(showInfoStub, 'Test sound');
    });

    test('showNotificationWithSound calls exec on darwin', () => {
        const originalPlatform = process.platform;
        Object.defineProperty(process, 'platform', { value: 'darwin' });
        Notification.showNotificationWithSound('Test sound');
        sinon.assert.calledOnce(execStub);
        Object.defineProperty(process, 'platform', { value: originalPlatform });
    });
});
