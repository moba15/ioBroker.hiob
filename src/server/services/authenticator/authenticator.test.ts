import * as grpc from '@grpc/grpc-js';
import { expect } from 'chai';
import * as sinon from 'sinon';
import proxyquire from 'proxyquire';
import type { SamartHomeHandyBis } from '../../../main';
import { afterEach, beforeEach, describe, it } from 'node:test';

describe('Authenticator', () => {
    let mockAdapter: Partial<SamartHomeHandyBis>;
    let metadata: grpc.Metadata;
    let getStateAsyncStub: sinon.SinonStub;
    let bcryptCompareStub: sinon.SinonStub;

    // We need variables to hold the proxyquired module functions
    let checkAuthentication: any;
    let cleanupTokenCache: any;
    let invalidateDeviceTokens: any;

    beforeEach(() => {
        getStateAsyncStub = sinon.stub();
        bcryptCompareStub = sinon.stub();

        // Proxyquire the authenticator to mock bcrypt
        const authModule = proxyquire('./authenticator', {
            bcrypt: {
                compare: bcryptCompareStub,
            },
        });

        checkAuthentication = authModule.checkAuthentication;
        cleanupTokenCache = authModule.cleanupTokenCache;
        invalidateDeviceTokens = authModule.invalidateDeviceTokens;

        // Reset caches before each test
        cleanupTokenCache();

        metadata = new grpc.Metadata();

        // Create a mock ioBroker adapter
        mockAdapter = {
            getStateAsync: getStateAsyncStub as any,
            log: {
                info: sinon.stub(),
                warn: sinon.stub(),
                error: sinon.stub(),
                debug: sinon.stub(),
                silly: sinon.stub(),
                level: 'info',
            } as any,
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should reject when metadata is missing token or deviceId', async () => {
        const result = await checkAuthentication(metadata, mockAdapter);
        expect(result.code).to.equal(grpc.status.UNAUTHENTICATED);
        expect(result.details).to.include('Missing required metadata');
    });

    it('should reject when device is not approved', async () => {
        metadata.set('deviceId', 'test-device');
        metadata.set('token', 'test-token');

        // Mock device not approved
        getStateAsyncStub.resolves({ val: false });

        const result = await checkAuthentication(metadata, mockAdapter);

        expect(result.code).to.equal(grpc.status.PERMISSION_DENIED);
        expect(result.details).to.include('is not approved');
        expect(getStateAsyncStub.calledWith('devices.test-device.approved')).to.be.true;
    });

    it('should reject when device key is missing in states', async () => {
        metadata.set('deviceId', 'test-device');
        metadata.set('token', 'test-token');

        // Mock device approved, but no key
        getStateAsyncStub.onFirstCall().resolves({ val: true }); // approved state
        getStateAsyncStub.onSecondCall().resolves(null); // key state

        const result = await checkAuthentication(metadata, mockAdapter);

        expect(result.code).to.equal(grpc.status.UNAUTHENTICATED);
        expect(result.details).to.include('No key found');
    });

    it('should reject when token is invalid (bcrypt mismatch)', async () => {
        metadata.set('deviceId', 'test-device');
        metadata.set('token', 'invalid-token');

        getStateAsyncStub.onFirstCall().resolves({ val: true }); // approved state
        getStateAsyncStub.onSecondCall().resolves({ val: 'hashed-key' }); // key state

        bcryptCompareStub.resolves(false);

        const result = await checkAuthentication(metadata, mockAdapter);

        expect(result.code).to.equal(grpc.status.UNAUTHENTICATED);
        expect(result.details).to.equal('Invalid token');
        expect(bcryptCompareStub.calledWith('invalid-token', 'hashed-key')).to.be.true;
    });

    it('should succeed and cache when token is valid', async () => {
        metadata.set('deviceId', 'test-device');
        metadata.set('token', 'valid-token');

        getStateAsyncStub.onFirstCall().resolves({ val: true });
        getStateAsyncStub.onSecondCall().resolves({ val: 'hashed-key' });

        bcryptCompareStub.resolves(true);

        const result = await checkAuthentication(metadata, mockAdapter);

        expect(result.code).to.equal(grpc.status.OK);
        expect(result.deviceId).to.equal('test-device');

        // Second call should use cache (getStateAsync and bcrypt.compare shouldn't be called again)
        const resultCached = await checkAuthentication(metadata, mockAdapter);
        expect(resultCached.code).to.equal(grpc.status.OK);

        expect(getStateAsyncStub.callCount).to.equal(2); // Only called during first check
        expect(bcryptCompareStub.callCount).to.equal(1); // Only called during first check
    });

    it('should invalidate cache for specific device', async () => {
        metadata.set('deviceId', 'test-device');
        metadata.set('token', 'valid-token');

        getStateAsyncStub.resolves({ val: true });
        getStateAsyncStub.onSecondCall().resolves({ val: 'hashed-key' });
        getStateAsyncStub.onCall(3).resolves({ val: 'hashed-key' });

        bcryptCompareStub.resolves(true);

        // First successful call caches it
        await checkAuthentication(metadata, mockAdapter);

        // Invalidate
        invalidateDeviceTokens('test-device');

        // Second call should re-evaluate because cache was invalidated
        await checkAuthentication(metadata, mockAdapter);

        expect(getStateAsyncStub.callCount).to.equal(4);
        expect(bcryptCompareStub.callCount).to.equal(2);
    });
});
