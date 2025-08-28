import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import React, { useState } from "react";
import API from "@/services/API";
import ReactAsyncStorageAPI from "@/services/storage";
import { useRouter } from "expo-router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    const response = await API.login({ email, password });
    if (response.success) {
      const user = response.data.user;
      ReactAsyncStorageAPI.set("user", JSON.stringify(user));
      router.push("/dashboard/home");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.welcome}>Welcome to Interview Simulator</Text>
        <Text style={styles.title}>Login</Text>

        {/* Email Label */}
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Password Label */}
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
      </View>

      <Pressable onPress={() => router.push("/register")} style={styles.register}>
        <Text style={styles.registerText}>
          Don’t have an account? <Text style={styles.registerLink}>Register</Text>
        </Text>
      </Pressable>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f6fc",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  welcome: {
    fontSize: 18,
    color: "#555",
    marginBottom: 10,
    textAlign: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 25,
    textAlign: "center",
    color: "#222",
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
    fontWeight: "500",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    color: "#000",
  },
  button: {
    width: "100%",
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    elevation: 3,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  register: {
    marginTop: 20,
  },
  registerText: {
    color: "#555",
    fontSize: 14,
  },
  registerLink: {
    color: "#007AFF",
    fontWeight: "600",
  },
});
