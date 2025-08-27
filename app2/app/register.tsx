import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import React, { useState } from "react";
import ReactAsyncStorageAPI from '../services/storage'
import API from '../services/API'
import { useRouter } from "expo-router";

const Register = () => {
  const [step, setStep] = useState(1); // 1 = email, 2 = OTP, 3 = name
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [CORRECT_OTP, set_CORRECT_OTP] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const router = useRouter();

  const handleEmailSubmit = async () => {
    if (email.trim() === "") return;
    const response = await API.request_otp({email:email});
    if(response.success){
        set_CORRECT_OTP(response.data.otp)
        alert("otp has been sent.")
        setStep(2);
    }else{
        alert("failed to send OTP.")
    }
  };

  const handleOtpSubmit = () => {
    if (otp === CORRECT_OTP) {
      setStep(3);
    } else {
      alert("Invalid OTP, try again");
    }
  };

  const handlePasswordSubmit = () => {
    if (password ) {
      setStep(4);
    } else {
      alert("Invalid password, try again");
    }
  };

  const handleFinish = async () => {
    const user = { name, email, password };
    const response = await API.register(user);
    if (response.success) {
        alert("Registration success");
        await ReactAsyncStorageAPI.set("user", JSON.stringify(user));
        router.push("/dashboard/profile");
    } else {
        alert("Registration failed");
    }
    };

  return (
    <View style={styles.container}>
        <Text style={styles.title}>Register</Text>
        <Text style={{textAlign:"center"}}>step {step} / 4</Text>

        {step === 1 && (
            <>
            <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <Pressable style={styles.button} onPress={handleEmailSubmit}>
                <Text style={styles.buttonText}>Send OTP</Text>
            </Pressable>
            </>
        )}

        {step === 2 && (
            <>
            <Text style={styles.title}>Enter OTP</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter OTP"
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
            />
            <Pressable style={styles.button} onPress={handleOtpSubmit}>
                <Text style={styles.buttonText}>Verify OTP</Text>
            </Pressable>
            </>
        )}

        {step === 3 && (
            <>
            <Text style={styles.title}>Set a password:{password}</Text>
            <TextInput
                style={styles.input}
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
            />
            <Pressable style={styles.button} onPress={handlePasswordSubmit}>
                <Text style={styles.buttonText}>next</Text>
            </Pressable>
            </>
        )}

        {step === 4 && (
            <>
            <Text style={styles.title}>Your Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
            />
            <Pressable style={styles.button} onPress={handleFinish}>
                <Text style={styles.buttonText}>Finish</Text>
            </Pressable>
            </>
        )}


    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
