import React, { useState } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet } from 'react-native';

const SpeechInput = ({ handleUserResponse }) => {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (!text.trim()) return;
    handleUserResponse(text.trim());
    setText(''); // clear input after submit
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Type or use mic on your keyboard..."
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleSubmit} // allows enter key submit
        returnKeyType="send"
      />

      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Send</Text>
      </Pressable>
    </View>
  );
};

export default SpeechInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginRight: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
