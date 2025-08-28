import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

const Conversation = ({ chat = [] }) => {
  return (
    <View style={styles.container}>
      {chat.map((data, index) => (
        <Card key={index} data={data} />
      ))}
    </View>
  );
};

function Card({ data }) {
  const isUser = data.role === 'USER';

  return (
    <View
      style={[
        styles.messageContainer,
        isUser ? styles.userAlign : styles.systemAlign,
      ]}
    >
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.systemBubble]}>
        <Text style={[styles.text, isUser ? styles.userText : styles.systemText]}>
          {data.text}
        </Text>
      </View>
    </View>
  );
}

export default Conversation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingVertical: 10,
  },
  messageContainer: {
    marginVertical: 6,
    flexDirection: 'row',
  },
  userAlign: {
    justifyContent: 'flex-end',
  },
  systemAlign: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 2,
  },
  systemBubble: {
    backgroundColor: '#E5E5EA',
    borderBottomLeftRadius: 2,
  },
  text: {
    fontSize: 15,
  },
  userText: {
    color: '#fff',
  },
  systemText: {
    color: '#000',
  },
});
