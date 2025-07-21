import * as assert from 'assert';
import * as sinon from 'sinon';
import * as vscode from 'vscode';

suite('Extension Activation', () => {
	test('activate registers commands', async () => {
		const contextStub: any = { subscriptions: [] };
		const registerCommandStub = sinon.stub(vscode.commands, 'registerCommand').callsFake((id: string, cb: (...args: any[]) => any) => {
			return { dispose: () => {} };
		});
		const { activate } = await import('../extension.js');
		activate(contextStub);
		assert.strictEqual(registerCommandStub.callCount, 4);
		registerCommandStub.restore();
	});
});
