import {configureStore} from '@reduxjs/toolkit';
import {authGateReducer, initializeAuthGate, submitPin} from 'store/slices/authGateSlice';

jest.mock('services/security/biometricService', () => ({
  canUseBiometrics: jest.fn(),
  requestBiometricUnlock: jest.fn(),
}));

jest.mock('services/security/pinSecurity', () => ({
  isPinConfigured: jest.fn(),
  savePin: jest.fn(),
  verifyPin: jest.fn(),
}));

const biometricService = jest.requireMock('services/security/biometricService') as {
  canUseBiometrics: jest.Mock;
  requestBiometricUnlock: jest.Mock;
};

const pinSecurity = jest.requireMock('services/security/pinSecurity') as {
  isPinConfigured: jest.Mock;
  savePin: jest.Mock;
  verifyPin: jest.Mock;
};

describe('authGateSlice', () => {
  it('falls back to pin entry when biometrics fail and pin exists', async () => {
    biometricService.canUseBiometrics.mockResolvedValue(true);
    biometricService.requestBiometricUnlock.mockResolvedValue(false);
    pinSecurity.isPinConfigured.mockResolvedValue(true);

    const store = configureStore({
      reducer: {authGate: authGateReducer},
    });

    await store.dispatch(initializeAuthGate());
    expect(store.getState().authGate.status).toBe('requiresPinEntry');
  });

  it('requires confirmation then authenticates for first-time pin setup', async () => {
    const store = configureStore({
      reducer: {authGate: authGateReducer},
      preloadedState: {
        authGate: {
          status: 'requiresPinSetup' as const,
          error: null,
          pinSetupDraft: null,
          pinFailures: 0,
        },
      },
    });

    await store.dispatch(submitPin('1234'));
    expect(store.getState().authGate.status).toBe('requiresPinConfirm');

    await store.dispatch(submitPin('1234'));
    expect(store.getState().authGate.status).toBe('authenticated');
  });
});
