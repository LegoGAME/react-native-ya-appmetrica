import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import * as AppMetrica from 'react-native-ya-appmetrica';

const MyButton = ({
  text,
  description,
  onPress,
}: {
  text: string;
  description?: string;
  onPress: () => void;
}) => {
  return (
    <View style={styles.container}>
      {description && <Text style={styles.title}>{description}</Text>}
      <TouchableOpacity
        onPress={() => {
          try {
            onPress();
          } catch (error) {
            if (error instanceof Error) {
              console.log(error.message);
              AppMetrica.reportError(error);
            }
          }
        }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MyButton;

const styles = StyleSheet.create({
  container: {
    gap: 3,
  },
  title: {
    fontSize: 12,
    fontWeight: '400',
  },
  button: {
    backgroundColor: '#FF0060',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 7,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '500',
  },
});
