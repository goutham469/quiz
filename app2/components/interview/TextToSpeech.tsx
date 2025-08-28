import * as Speech from "expo-speech";
import { View, Button } from "react-native";

export default function TextToSpeech() {
  const speak = () => {
    Speech.speak("Hello! This is text to speech in React Native.");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Speak" onPress={speak} />
    </View>
  );
}
