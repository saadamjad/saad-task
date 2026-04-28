import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { JSX } from 'react';
import { useSavedGateScreen } from 'features/saved/hooks/useSavedGateScreen';
import { useTheme } from 'styled-components/native';
import type { SavedStackParamList } from 'types/navigation';
import {
  Card,
  ErrorText,
  InfoText,
  PinInput,
  ScreenSafe,
  SubmitButton,
  SubmitButtonText,
  Subtitle,
  Title,
} from './SavedGateScreen.styled';

type Props = NativeStackScreenProps<SavedStackParamList, 'SavedGate'>;

export const SavedGateScreen = ({ navigation }: Props): JSX.Element => {
  const theme = useTheme();
  const {
    status,
    error,
    pinFailures,
    pin,
    pinLength,
    canSubmitPin,
    gateCopy,
    shouldShowPinInput,
    updatePin,
    submitPinCode,
  } = useSavedGateScreen(navigation);

  return (
    <ScreenSafe>
      <Card>
        {status === 'checking' ? (
          <InfoText>Checking authentication options...</InfoText>
        ) : null}

        {/* Title/subtitle come from hook based on gate status (setup vs entry vs confirm). */}
        {gateCopy ? (
          <>
            <Title>{gateCopy.title}</Title>
            <Subtitle>{gateCopy.subtitle}</Subtitle>
          </>
        ) : null}

        {shouldShowPinInput ? (
          <>
            <PinInput
              value={pin}
              onChangeText={updatePin}
              placeholder="4-digit PIN"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="number-pad"
              secureTextEntry
              maxLength={pinLength}
            />
            <SubmitButton
              onPress={submitPinCode}
              disabled={!canSubmitPin}
              $disabled={!canSubmitPin}>
              <SubmitButtonText>Continue</SubmitButtonText>
            </SubmitButton>
          </>
        ) : null}

        {error ? <ErrorText>{error}</ErrorText> : null}
        {status === 'requiresPinEntry' && pinFailures > 0 ? (
          <InfoText>Failed attempts: {pinFailures}</InfoText>
        ) : null}
      </Card>
    </ScreenSafe>
  );
};
