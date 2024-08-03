import { StyleSheet, Text, View } from 'react-native';

const InfoArg = ({ title, text }: { title: string; text?: string }) => {
  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export default InfoArg;

const styles = StyleSheet.create({
  title: {
    fontSize: 15,
    fontWeight: '500',
  },
  text: {
    fontSize: 14,
  },
});
