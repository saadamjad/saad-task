import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {JSX} from 'react';
import {Pressable, SafeAreaView, Text, TextInput, View} from 'react-native';
import {useSavedGateScreen} from 'features/saved/hooks/useSavedGateScreen';
import {styles} from './SavedGateScreen.styles';
import {colors} from 'theme';
import type {SavedStackParamList} from 'types/navigation';

type Props = NativeStackScreenProps<SavedStackParamList, 'SavedGate'>;

export const SavedGateScreen = ({navigation}: Props): JSX.Element => {
  // Screen stays presentational; gate flow + navigation live in useSavedGateScreen.
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
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        {status === 'checking' ? (
          <Text style={styles.infoText}>Checking authentication options...</Text>
        ) : null}

        {/* Title/subtitle come from hook based on gate status (setup vs entry vs confirm). */}
        {gateCopy ? (
          <>
            <Text style={styles.title}>{gateCopy.title}</Text>
            <Text style={styles.subtitle}>{gateCopy.subtitle}</Text>
          </>
        ) : null}

        {shouldShowPinInput ? (
          <>
            <TextInput
              value={pin}
              onChangeText={updatePin}
              placeholder="4-digit PIN"
              placeholderTextColor={colors.textSecondary}
              keyboardType="number-pad"
              secureTextEntry
              maxLength={pinLength}
              style={styles.input}
            />
            <Pressable
              onPress={submitPinCode}
              style={[styles.button, !canSubmitPin ? styles.buttonDisabled : undefined]}
              disabled={!canSubmitPin}>
              <Text style={styles.buttonText}>Continue</Text>
            </Pressable>
          </>
        ) : null}

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {status === 'requiresPinEntry' && pinFailures > 0 ? (
          <Text style={styles.infoText}>Failed attempts: {pinFailures}</Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
};
