import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {clearAuthError, initializeAuthGate, submitPin} from 'store/slices/authGateSlice';
import {useAppDispatch, useAppSelector} from 'store';
import type {RootState} from 'store';
import type {SavedStackParamList} from 'types/navigation';

/** PIN digit count enforced in UI and thunks. */
const PIN_LENGTH = 4;

interface GateCopy {
  title: string;
  subtitle: string;
}

interface UseSavedGateScreenResult {
  status: RootState['authGate']['status'];
  error: string | null;
  pinFailures: number;
  pin: string;
  pinLength: number;
  canSubmitPin: boolean;
  gateCopy: GateCopy | null;
  shouldShowPinInput: boolean;
  updatePin: (value: string) => void;
  submitPinCode: () => void;
}

/**
 * Saved-tab authentication only: runs biometric/PIN initialization, manages PIN entry state,
 * and navigates to SavedArticles once `authenticated` (see authGateSlice).
 */
export const useSavedGateScreen = (
  navigation: NativeStackNavigationProp<SavedStackParamList, 'SavedGate'>,
): UseSavedGateScreenResult => {
  const dispatch = useAppDispatch();
  const {status, error, pinFailures} = useAppSelector(state => state.authGate);
  const [pin, setPin] = useState('');

  useEffect(() => {
    // Determines biometric vs PIN setup vs PIN entry (async native APIs).
    dispatch(initializeAuthGate());
  }, [dispatch]);

  useEffect(() => {
    // Declarative navigation once Redux reports success (avoids calling navigate inside thunks).
    if (status === 'authenticated') {
      navigation.replace('SavedArticles');
    }
  }, [navigation, status]);

  const updatePin = useCallback((value: string) => {
    setPin(value.replace(/\D/g, '').slice(0, PIN_LENGTH));
  }, []);

  const submitPinCode = useCallback(() => {
    if (pin.length < PIN_LENGTH) {
      return;
    }

    dispatch(clearAuthError());
    dispatch(submitPin(pin));
    setPin('');
  }, [dispatch, pin]);

  const shouldShowPinInput =
    status === 'requiresPinSetup' || status === 'requiresPinEntry' || status === 'requiresPinConfirm';

  const gateCopy = useMemo(() => {
    if (status === 'requiresPinSetup') {
      return {
        title: 'Set a secure PIN',
        subtitle: 'Biometric auth unavailable. Create a PIN fallback.',
      };
    }

    if (status === 'requiresPinEntry') {
      return {
        title: 'Enter PIN',
        subtitle: 'Biometric auth failed or is unavailable.',
      };
    }

    if (status === 'requiresPinConfirm') {
      return {
        title: 'Confirm PIN',
        subtitle: 'Re-enter your PIN to complete setup.',
      };
    }

    return null;
  }, [status]);

  return {
    status,
    error,
    pinFailures,
    pin,
    pinLength: PIN_LENGTH,
    canSubmitPin: pin.length >= PIN_LENGTH,
    gateCopy,
    shouldShowPinInput,
    updatePin,
    submitPinCode,
  };
};
