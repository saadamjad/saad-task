import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {canUseBiometrics, requestBiometricUnlock} from 'services/security/biometricService';
import {isPinConfigured, savePin, verifyPin} from 'services/security/pinSecurity';

export type GateStatus =
  | 'idle'
  | 'checking'
  | 'requiresPinSetup'
  | 'requiresPinConfirm'
  | 'requiresPinEntry'
  | 'authenticated'
  | 'failed';

export interface AuthGateState {
  status: GateStatus;
  error: string | null;
  pinSetupDraft: string | null;
  pinFailures: number;
}

const initialState: AuthGateState = {
  status: 'idle',
  error: null,
  pinSetupDraft: null,
  pinFailures: 0,
};

export const initializeAuthGate = createAsyncThunk('authGate/initialize', async () => {
  const hasBiometrics = await canUseBiometrics();
  const hasPin = await isPinConfigured();

  if (hasBiometrics) {
    const success = await requestBiometricUnlock();
    if (success) {
      return 'authenticated' as const;
    }
  }

  return hasPin ? ('requiresPinEntry' as const) : ('requiresPinSetup' as const);
});

interface SubmitPinResult {
  success: boolean;
  nextStatus: GateStatus;
  draftPin?: string;
}

const resolveSetupPinSubmission = (
  pin: string,
  state: AuthGateState,
): SubmitPinResult | null => {
  if (state.status === 'requiresPinSetup') {
    return {success: false, nextStatus: 'requiresPinConfirm', draftPin: pin};
  }

  if (state.status !== 'requiresPinConfirm') {
    return null;
  }

  if (state.pinSetupDraft !== pin) {
    return {success: false, nextStatus: 'requiresPinSetup'};
  }

  return {success: true, nextStatus: 'authenticated'};
};

export const submitPin = createAsyncThunk(
  'authGate/submitPin',
  async (pin: string, {getState}) => {
    const state = getState() as {authGate: AuthGateState};
    const setupFlowResult = resolveSetupPinSubmission(pin, state.authGate);

    if (setupFlowResult) {
      // PIN setup is intentionally two-step to avoid storing an unintended PIN typo.
      if (setupFlowResult.success) {
        await savePin(pin);
      }

      return setupFlowResult;
    }

    const verified = await verifyPin(pin);
    return {
      success: verified,
      nextStatus: verified ? ('authenticated' as const) : ('requiresPinEntry' as const),
    };
  },
);

const authGateSlice = createSlice({
  name: 'authGate',
  initialState,
  reducers: {
    lockSavedTab(state) {
      state.status = 'idle';
      state.error = null;
      state.pinSetupDraft = null;
    },
    clearAuthError(state) {
      state.error = null;
    },
    setGateStatus(state, action: PayloadAction<GateStatus>) {
      state.status = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(initializeAuthGate.pending, state => {
      state.status = 'checking';
      state.error = null;
      state.pinSetupDraft = null;
    });
    builder.addCase(initializeAuthGate.fulfilled, (state, action) => {
      state.status = action.payload;
      state.error = null;
      state.pinSetupDraft = null;
    });
    builder.addCase(initializeAuthGate.rejected, state => {
      state.status = 'failed';
      state.error = 'Authentication check failed';
    });
    builder.addCase(submitPin.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.status = 'authenticated';
        state.error = null;
        state.pinSetupDraft = null;
        state.pinFailures = 0;
      } else {
        state.status = action.payload.nextStatus;
        if (action.payload.nextStatus === 'requiresPinConfirm') {
          state.pinSetupDraft = action.payload.draftPin ?? null;
          state.error = null;
          return;
        }

        if (action.payload.nextStatus === 'requiresPinSetup') {
          // Mismatch in confirmation: clear draft to enforce a complete re-entry.
          state.pinSetupDraft = null;
          state.error = 'PINs do not match. Please set it again.';
          return;
        }

        state.pinFailures += 1;
        state.error = 'Invalid PIN';
      }
    });
  },
});

export const {lockSavedTab, clearAuthError, setGateStatus} = authGateSlice.actions;
export const authGateReducer = authGateSlice.reducer;
