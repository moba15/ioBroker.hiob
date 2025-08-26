import { LoginManager } from '../src/login/loginmanager';
import type { SamartHomeHandyBis } from '../src/main';
import * as sinon from 'sinon';
import { expect } from 'chai';
import { ApprovalRequest, LoginRequest, LoginResponse } from '../src/generated/login/login';
import * as bcrypt from 'bcrypt';
import { createMockAdapter } from '../test/mocks';

async function waitFor(test: () => boolean): Promise<void> {
    while (!test()) {
        await new Promise(f => setTimeout(f, 10));
    }
}

describe('LoginManager', () => {
    let adapter: SamartHomeHandyBis;
    let loginManager: LoginManager;

    // Create a new mock adapter and LoginManager instance before each test
    beforeEach(() => {
        adapter = createMockAdapter();
        loginManager = new LoginManager(adapter);
    });

    // Restore all sinon stubs after each test
    afterEach(() => {
        sinon.restore();
    });

    it('should be created successfully', () => {
        expect(loginManager).to.be.an.instanceOf(LoginManager);
    });

    it('should initialize with correct default values', () => {
        expect(loginManager.pendingClients).to.be.an('array').that.is.empty;
        expect(loginManager.pendingClientIds).to.be.an('array').that.is.empty;
        expect(loginManager.approveLogins).to.be.false;
        expect(loginManager.approveLoginsTimeout).to.be.undefined;
    });

    it('should register a state change listener during construction', () => {
        // Verify that the 'on' method of the listener was called once
        expect((adapter.listener.on as sinon.SinonStub).calledOnce).to.be.true;
    });

    it('new client should get rejected', async () => {
        const loginRequestNoKey = LoginRequest.fromObject({
            deviceName: 'new device',
            deviceId: 'new device id',
        });
        let result = await loginManager.onLoginRequestProto(loginRequestNoKey);
        expect(result.status).to.be.not.equal(LoginResponse.Status.succesfull);
        result = await loginManager.onLoginRequestProto(loginRequestNoKey);
        expect(result.status).to.be.not.equal(LoginResponse.Status.succesfull);

        const loginRequestWithKey = LoginRequest.fromObject({
            deviceName: 'new device',
            deviceId: 'new device id1',
            key: 'iosajdiofjasdf',
        });

        result = await loginManager.onLoginRequestProto(loginRequestWithKey);
        expect(result.status).to.be.not.equal(LoginResponse.Status.succesfull);
        result = await loginManager.onLoginRequestProto(loginRequestNoKey);
        expect(result.status).to.be.not.equal(LoginResponse.Status.succesfull);

        const loginRequestWithKeyAndPwd = LoginRequest.fromObject({
            deviceName: 'new device',
            deviceId: 'new device id1',
            key: 'iosajdiofjasdf',
            user: 'asda',
            password: 'asf',
        });

        result = await loginManager.onLoginRequestProto(loginRequestWithKeyAndPwd);
        expect(result.status).to.be.not.equal(LoginResponse.Status.succesfull);
        result = await loginManager.onLoginRequestProto(loginRequestWithKeyAndPwd);
        expect(result.status).to.be.not.equal(LoginResponse.Status.succesfull);
    });

    it('new client should create object', async () => {
        const loginRequestNoKey = LoginRequest.fromObject({
            deviceName: 'new device',
            deviceId: 'new device id',
        });
        await loginManager.onLoginRequestProto(loginRequestNoKey);
        expect((adapter.setObjectNotExistsAsync as sinon.SinonStub).calledWith(sinon.match('devices.')));
    });

    it('request login', async () => {
        const loginRequestNoKey = LoginRequest.fromObject({
            deviceName: 'new device',
            deviceId: 'newdeviceid',
        });
        (adapter.getStateAsync as sinon.SinonStub).withArgs('devices.newdeviceid.approved').resolves({ val: false });
        await loginManager.onLoginRequestProto(loginRequestNoKey);
        const requestApproval = ApprovalRequest.fromObject({ deviceName: 'new dvice', deviceId: 'newdeviceid' });
        const deviceApproveStateId = 'hiob.0.devices.newdeviceid.approved';
        const deviceApproveState = { value: true, ack: true, objectID: deviceApproveStateId };
        const resultPromise = loginManager.requestApproval(requestApproval);
        await waitFor(() => {
            return (adapter.listener.once as sinon.SinonSpy).called;
        });
        adapter.listener.emit('stateChangedhiob.0.devices.newdeviceid.approved', deviceApproveState);
        const result = await resultPromise;
        expect(result.key.length).to.be.greaterThan(0);
        (adapter.getStateAsync as sinon.SinonStub).withArgs('devices.newdeviceid.approved').resolves({ val: true });
        const hashedKey = await bcrypt.hash(result.key, 5);
        (adapter.getStateAsync as sinon.SinonStub).withArgs('devices.newdeviceid.key').resolves({ val: hashedKey });
        loginRequestNoKey.key = result.key;
        const resultLoginRequest = await loginManager.onLoginRequestProto(loginRequestNoKey);
        expect(resultLoginRequest.status).to.be.equal(LoginResponse.Status.succesfull);
    });

    it('request login with approvedNextLogin', async () => {
        const loginRequestNoKey = LoginRequest.fromObject({
            deviceName: 'new device',
            deviceId: 'newdeviceid',
        });
        (adapter.getStateAsync as sinon.SinonStub).withArgs('devices.newdeviceid.approved').resolves({ val: false });
        await loginManager.onLoginRequestProto(loginRequestNoKey);
        const requestApproval = ApprovalRequest.fromObject({ deviceName: 'new dvice', deviceId: 'newdeviceid' });
        loginManager.approveLogins = true;
        expect(loginManager.approveLogins).to.be.true;
        const result = await loginManager.requestApproval(requestApproval);
        expect(result.key.length).to.be.greaterThan(0);
        (adapter.getStateAsync as sinon.SinonStub).withArgs('devices.newdeviceid.approved').resolves({ val: true });
        const hashedKey = await bcrypt.hash(result.key, 5);
        (adapter.getStateAsync as sinon.SinonStub).withArgs('devices.newdeviceid.key').resolves({ val: hashedKey });
        loginRequestNoKey.key = result.key;
        const resultLoginRequest = await loginManager.onLoginRequestProto(loginRequestNoKey);
        expect(resultLoginRequest.status).to.be.equal(LoginResponse.Status.succesfull);
    });
});
