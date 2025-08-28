import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import SpeechToText from '@/components/interview/SpeechToText';
import Conversation from '@/components/interview/Conversation';
import ReactAsyncStorageAPI from '@/services/storage';
import API from '@/services/API';
import * as Speech from "expo-speech";

const Interview = () => {
  const [state, setState] = useState(0); // 0 = intro, 1 = interview
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [isUserTurn, setUserTurn] = useState(true);

  const [interviewId, setInterviewId] = useState<number | null>(null);
  const [interviewTopic, setInterviewTopic] = useState<string | null>(null);

  // ---- Start Interview ----
  async function startInterview() {
    const user = await ReactAsyncStorageAPI.get("user");
    const email = JSON.parse(user).email;

    const response = await API.start_interview({ email });
    if (response.success) {
      setInterviewId(response.data.insertStatus.insertId);
      setInterviewTopic(response.data.topic);
      Speech.speak(`Your topic for GD is ${response.data.topic}`);

      setState(1);
      Speech.speak("First turn is yours");
      
    } else {
      alert(response.error);
    }
  }

  // ---- Submit User Response ----
  async function submitAndGetResponse(userResponse: string) {
    setUserTurn(false);

    const payload = {
      interview_id: interviewId,
      response: userResponse,
      topic: interviewTopic,
      conversation: chatHistory.slice(-5).concat({ "role":"USER", "text":userResponse }) // send last 6 turns
    };

    const response = await API.submit_user_response(payload);
    if (response.success) {
      setChatHistory(prev => [
        ...prev,
        { role: "SYSTEM", text: response.data.aiResponse }
      ]);
      setUserTurn(true);
      // read aloud
      Speech.speak(response.data.aiResponse);
    } else {
      alert(response.error);
      setUserTurn(true);
    }
  }

  // ---- Finish Interview ----
  async function finishInterview() {
    const user = await ReactAsyncStorageAPI.get("user");
    const email = JSON.parse(user).email;

    const response = await API.finish_interview({ email });
    if (response.success) {
      alert("Interview saved");
      setState(0);
      setChatHistory([]);
    } else {
      alert(response.error);
    }
  }

  return (
    <View style={styles.container}>
      {state === 0 && (
        <View style={styles.centerBox}>
          <Text style={styles.title}>Interview Simulator</Text>
          <Text style={styles.subtitle}>
            Practice your GD interview skills with AI.
          </Text>
          <Pressable style={styles.button} onPress={startInterview}>
            <Text style={styles.buttonText}>🚀 Start Interview</Text>
          </Pressable>
        </View>
      )}

      {state === 1 && (
        <View style={{ flex: 1, width: "100%" }}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.topic}>Topic: {interviewTopic}</Text>
            
            <Pressable style={styles.finishBtn} onPress={finishInterview}>
              <Text style={styles.finishText}>Finish Interview</Text>
            </Pressable>
          </View>

          {/* Chat Area */}
          <ScrollView
            style={styles.chatArea}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            <Conversation chat={chatHistory} />
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            {isUserTurn ? (
              <SpeechToText
                handleUserResponse={async (userResponse: string) => {
                  if (userResponse) {
                    setChatHistory(prev => [
                      ...prev,
                      { role: "USER", text: userResponse }
                    ]);
                    await submitAndGetResponse(userResponse);
                  }
                }}
              />
            ) : (
              <Text style={styles.systemText}>🤖 System is responding...</Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default Interview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  centerBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 10,
    color: "#222",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 25,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  header: {
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  topic: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  finishBtn: {
    backgroundColor: "#ff4d4f",
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin:10,
    borderRadius: 8,
  },
  finishText: {
    color: "#fff",
    fontWeight: "600",
  },
  chatArea: {
    flex: 1,
    padding: 12,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  systemText: {
    fontSize: 16,
    fontStyle: "italic",
    color: "gray",
    textAlign: "center",
  },
});
