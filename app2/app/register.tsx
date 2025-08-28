import { View, Text, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import ReactAsyncStorageAPI from '../services/storage';
import API from '../services/API';
import { useRouter } from "expo-router";

const Register = () => {
  const [step, setStep] = useState(1); // 1 = email, 2 = OTP, 3 = password, 4 = name
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [correctOtp, setCorrectOtp] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const router = useRouter();

  // Email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation
  const isValidPassword = (password) => {
    return password.length >= 8;
  };

  // Clear error for specific field
  const clearError = (field) => {
    setErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleEmailSubmit = async () => {
    if (!email.trim()) {
      setErrors({ email: "Email is required" });
      return;
    }
    
    if (!isValidEmail(email)) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }

    clearError('email');
    setIsLoading(true);

    try {
      const response = await API.request_otp({ email: email.trim().toLowerCase() });
      
      if (response.success) {
        setCorrectOtp(response.data.otp);
        Alert.alert("Success", "OTP has been sent to your email");
        setStep(2);
      } else {
        Alert.alert("Error", response.message || "Failed to send OTP");
      }
    } catch (error) {
      Alert.alert("Error", "Network error. Please try again");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = () => {
    if (!otp.trim()) {
      setErrors({ otp: "OTP is required" });
      return;
    }

    if (otp.trim() === correctOtp) {
      clearError('otp');
      setStep(3);
    } else {
      setErrors({ otp: "Invalid OTP. Please try again" });
    }
  };

  const handlePasswordSubmit = () => {
    if (!password) {
      setErrors({ password: "Password is required" });
      return;
    }

    if (!isValidPassword(password)) {
      setErrors({ password: "Password must be at least 8 characters long" });
      return;
    }

    clearError('password');
    setStep(4);
  };

  const handleFinish = async () => {
    if (!name.trim()) {
      setErrors({ name: "Name is required" });
      return;
    }

    clearError('name');
    setIsLoading(true);

    try {
      const user = { 
        name: name.trim(), 
        email: email.trim().toLowerCase(), 
        password 
      };
      
      const response = await API.register(user);
      
      if (response.success) {
        await ReactAsyncStorageAPI.set("user", JSON.stringify(user));
        Alert.alert("Success", "Registration completed successfully", [
          { text: "OK", onPress: () => router.push("/dashboard/profile") }
        ]);
      } else {
        Alert.alert("Error", response.message || "Registration failed");
      }
    } catch (error) {
      Alert.alert("Error", "Network error. Please try again");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      // Clear current step errors
      setErrors({});
    }
  };

  const renderStepContent = () => {
  switch (step) {
    case 1:
      return (
        <>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="Enter your email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              clearError('email');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            editable={!isLoading}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <Pressable
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleEmailSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Send OTP</Text>
            )}
          </Pressable>
        </>
      );

    case 2:
      return (
        <>
          <Text style={styles.label}>OTP</Text>
          <Text style={styles.subtitle}>Enter the OTP sent to {email}</Text>
          <TextInput
            style={[styles.input, errors.otp && styles.inputError]}
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChangeText={(text) => {
              setOtp(text);
              clearError('otp');
            }}
            keyboardType="number-pad"
            maxLength={6}
            editable={!isLoading}
          />
          {errors.otp && <Text style={styles.errorText}>{errors.otp}</Text>}

          <Pressable style={styles.button} onPress={handleOtpSubmit}>
            <Text style={styles.buttonText}>Verify OTP</Text>
          </Pressable>
        </>
      );

    case 3:
      return (
        <>
          <Text style={styles.label}>Password</Text>
          <Text style={styles.subtitle}>Create a secure password</Text>
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="Create a password (min 8 characters)"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              clearError('password');
            }}
            secureTextEntry
            autoComplete="new-password"
            editable={!isLoading}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          <Pressable style={styles.button} onPress={handlePasswordSubmit}>
            <Text style={styles.buttonText}>Next</Text>
          </Pressable>
        </>
      );

    case 4:
      return (
        <>
          <Text style={styles.label}>Full Name</Text>
          <Text style={styles.subtitle}>What should we call you?</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            placeholder="Enter your full name"
            value={name}
            onChangeText={(text) => {
              setName(text);
              clearError('name');
            }}
            autoComplete="name"
            editable={!isLoading}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

          <Pressable
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleFinish}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Complete Registration</Text>
            )}
          </Pressable>
        </>
      );

    default:
      return null;
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.stepIndicator}>Step {step} of 4</Text>

      {renderStepContent()}

      {step > 1 && (
        <Pressable 
          style={styles.backButton} 
          onPress={handleBack}
          disabled={isLoading}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
      )}

      <Pressable
        onPress={() => router.push("/login")}
        style={styles.loginLink}
        disabled={isLoading}
      >
        <Text style={styles.loginLinkText}>
          Already have an account? <Text style={styles.loginLinkBold}>Log in</Text>
        </Text>
      </Pressable>
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
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  stepIndicator: {
    textAlign: "center",
    color: "#888",
    marginBottom: 30,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    marginBottom: 8,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  inputError: {
    borderColor: "#ff3333",
    backgroundColor: "#fff5f5",
  },
  errorText: {
    color: "#ff3333",
    fontSize: 12,
    marginBottom: 15,
    marginTop: -5,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
    minHeight: 50,
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    marginBottom: 20,
  },
  backButtonText: {
    color: "#007AFF",
    fontSize: 16,
  },
  loginLink: {
    alignItems: "center",
    paddingVertical: 15,
  },
  loginLinkText: {
    color: "#666",
    fontSize: 14,
  },
  loginLinkBold: {
    color: "#007AFF",
    fontWeight: "600",
  },
  label: {
  fontSize: 14,
  color: "#333",
  marginBottom: 5,
  fontWeight: "500",
},
});