import API from "@/services/API";
import ReactAsyncStorageAPI from "@/services/storage";
import React, { useState, useEffect } from "react";
import { View, Text, Pressable, FlatList, ScrollView, StyleSheet } from "react-native";

const IAttempts = () => {
  const [interviews, setInterviews] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const user = await ReactAsyncStorageAPI.get("user");
        const email = JSON.parse(user).email;

        const response = await API.get_interview_attempts({ email });
        if (response.success) {
          setInterviews(response.data);
        } else {
          alert(response.error);
        }
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading interviews...</Text>
      </View>
    );
  }

  if (selectedInterview) {
    // Conversation Screen
    return (
      <View style={styles.container}>
        <Pressable style={styles.backButton} onPress={() => setSelectedInterview(null)}>
          <Text style={styles.backText}>⬅ Back to Tests</Text>
        </Pressable>

        <Text style={styles.topicTitle}>{selectedInterview.topic}</Text>

        <ScrollView style={styles.chatContainer}>
          {selectedInterview.responses.map((msg, idx) => (
            <View
              key={idx}
              style={[
                styles.messageContainer,
                msg.speaker === "USER" ? styles.userAlign : styles.systemAlign,
              ]}
            >
              <View style={[styles.bubble, msg.speaker === "USER" ? styles.userBubble : styles.systemBubble]}>
                <Text style={msg.speaker === "USER" ? styles.userText : styles.systemText}>{msg.response}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  // Tests List Screen
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Interview Attempts</Text>

      <FlatList
        data={interviews}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable style={styles.testCard} onPress={() => setSelectedInterview(item)}>
            <Text style={styles.testTitle}>{item.topic}</Text>
            <Text style={styles.testSub}>
              Started at: {new Date(item.started_at).toLocaleString()}
            </Text>
            <Text style={styles.testSub}>
              Ended at: {item.ended_at ? new Date(item.ended_at).toLocaleString() : "Ongoing"}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
};

export default IAttempts;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", padding: 12 },
  heading: { fontSize: 22, fontWeight: "700", marginBottom: 12, textAlign: "center" },
  testCard: {
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  testTitle: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  testSub: { fontSize: 14, color: "#555" },
  backButton: { marginBottom: 10 },
  backText: { color: "#007AFF", fontWeight: "600", fontSize: 16 },
  topicTitle: { fontSize: 18, fontWeight: "700", marginVertical: 10, textAlign: "center" },
  chatContainer: { flex: 1 },
  messageContainer: { marginVertical: 6, flexDirection: "row" },
  userAlign: { justifyContent: "flex-end" },
  systemAlign: { justifyContent: "flex-start" },
  bubble: { maxWidth: "75%", padding: 12, borderRadius: 16 },
  userBubble: { backgroundColor: "#007AFF", borderBottomRightRadius: 2 },
  systemBubble: { backgroundColor: "#E5E5EA", borderBottomLeftRadius: 2 },
  userText: { color: "#fff", fontSize: 15 },
  systemText: { color: "#000", fontSize: 15 },
  loadingText: { fontSize: 16, textAlign: "center", marginTop: 50 },
});
