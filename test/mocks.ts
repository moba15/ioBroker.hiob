import type { SamartHomeHandyBis } from '../src/main';
import * as sinon from 'sinon';
import { EventEmitter } from 'events';

/**
 * Creates a mock of the SamartHomeHandyBis adapter class for testing purposes.
 * This mock provides the necessary properties and methods that LoginManager interacts with.
 */
export const createMockAdapter = (): SamartHomeHandyBis => {
    const listenerMock = new EventEmitter();
    sinon.spy(listenerMock, 'on');
    sinon.spy(listenerMock, 'once');
    const mock = {
        namespace: 'hiob.0',
        log: {
            info: sinon.stub(),
            warn: sinon.stub(),
            debug: sinon.stub(),
            error: sinon.stub(),
        },
        listener: listenerMock,
        setStateAsync: sinon.stub().resolves(),
        setObjectNotExistsAsync: sinon.stub().resolves(),
        setObjectAsync: sinon.stub().resolves(),
        setState: sinon.stub(),
        getStateAsync: sinon.stub().resolves(),
        checkPasswordAsync: sinon.stub().resolves(true),
        // You can extend this mock with more adapter properties and methods as needed for your tests
    };
    return mock as any;
};
