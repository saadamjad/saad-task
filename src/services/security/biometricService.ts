import ReactNativeBiometrics from 'react-native-biometrics';

const biometrics = new ReactNativeBiometrics();

export const canUseBiometrics = async (): Promise<boolean> => {
  try {
    const {available} = await biometrics.isSensorAvailable();
    return available;
  } catch {
    return false;
  }
};

export const requestBiometricUnlock = async (): Promise<boolean> => {
  try {
    const {success} = await biometrics.simplePrompt({
      promptMessage: 'Unlock Saved Articles',
      cancelButtonText: 'Use PIN',
    });
    return success;
  } catch {
    return false;
  }
};
