import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import logo2 from "../../../assets/images/logo2.png";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function SignupScreen({ goToLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const bubbleCount = 20;
  const bubbles = useRef(
    [...Array(bubbleCount)].map(() => ({
      translateY: new Animated.Value(Math.random() * SCREEN_HEIGHT),
      opacity: new Animated.Value(Math.random() * 0.5 + 0.3),
    }))
  ).current;

  useEffect(() => {
    bubbles.forEach((bubble, i) => {
      const animate = () => {
        const startY = Math.random() * SCREEN_HEIGHT;
        bubble.translateY.setValue(startY);
        bubble.opacity.setValue(0.3);

        const duration =
          i % 3 === 0
            ? 30000
            : i % 5 === 0
            ? 22000
            : i % 2 === 0
            ? 25000
            : 20000;

        Animated.parallel([
          Animated.timing(bubble.translateY, {
            toValue: -200,
            duration,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(bubble.opacity, {
              toValue: 0.6,
              duration: duration / 2,
              useNativeDriver: true,
            }),
            Animated.timing(bubble.opacity, {
              toValue: 0,
              duration: duration / 2,
              useNativeDriver: true,
            }),
          ]),
        ]).start(() => animate());
      };
      animate();
    });
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async () => {
    setLoading(true);
    setError(null);

    const { email, password, confirmPassword } = formData;

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const usersData = await AsyncStorage.getItem("users");
      const users = usersData ? JSON.parse(usersData) : [];

      if (users.some((u) => u.email === email)) {
        setError("Email already registered");
        setLoading(false);
        return;
      }

      const newUser = { email, password };
      users.push(newUser);
      await AsyncStorage.setItem("users", JSON.stringify(users));

      goToLogin(); // back to login screen
    } catch (err) {
      setError("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient
        colors={["rgba(239,68,68,0.1)", "rgba(239,68,68,0.2)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20 }}>
            {/* Bubbles */}
            {bubbles.map((bubble, i) => {
              const size = i % 3 === 0 ? 200 : i % 5 === 0 ? 120 : i % 2 === 0 ? 100 : 150;
              const left = ((i * 5 + 10) / 100) * SCREEN_WIDTH;
              const scale = i % 3 === 0 ? 0.8 : i % 2 === 0 ? 0.6 : 1;
              return (
                <Animated.View
                  key={i}
                  style={{
                    position: "absolute",
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: "rgba(239,68,68,0.2)",
                    left,
                    transform: [{ translateY: bubble.translateY }, { scale }],
                    opacity: bubble.opacity,
                  }}
                />
              );
            })}

            {/* Signup Card */}
            <View style={styles.card}>
              <Image source={logo2} style={styles.logo} resizeMode="contain" />
              <Text style={styles.title}>Create an Account</Text>
              <Text style={styles.subtitle}>Be there - even when you’re not.</Text>

              {error && <Text style={styles.errorText}>{error}</Text>}

              {/* Form Inputs */}
              {["email", "password", "confirmPassword"].map((field) => {
                const label = field === "confirmPassword" ? "Confirm Password" : field.charAt(0).toUpperCase() + field.slice(1);
                return (
                  <View key={field} style={{ marginBottom: 16, width: "100%" }}>
                    <Text style={styles.label}>{label}</Text>
                    <TextInput
                      value={formData[field]}
                      onChangeText={(value) => handleInputChange(field, value)}
                      placeholder={`Enter your ${label.toLowerCase()}`}
                      style={styles.input}
                      secureTextEntry={field !== "email"}
                      keyboardType={field === "email" ? "email-address" : "default"}
                    />
                  </View>
                );
              })}

              <TouchableOpacity
                onPress={onSubmit}
                disabled={loading}
                style={[styles.button, loading && { backgroundColor: "#9ca3af" }]}
              >
                <Text style={styles.buttonText}>{loading ? "Signing Up..." : "Sign Up"}</Text>
              </TouchableOpacity>

              {/* Social Buttons */}
              <View style={{ width: "100%", marginBottom: 16 }}>
                {["facebook", "apple", "envelope"].map((icon, idx) => (
                  <TouchableOpacity key={idx} style={styles.socialButton}>
                    <FontAwesome name={icon} size={16} color="#000" />
                    <Text style={styles.socialText}>
                      Sign up with {icon.charAt(0).toUpperCase() + icon.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Already have an account?</Text>
                <TouchableOpacity onPress={goToLogin}>
                  <Text style={styles.signupButton}> Sign in</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.terms}>
                By signing up, you agree to the <Text style={{ textDecorationLine: "underline" }}>Terms of Use</Text> and{" "}
                <Text style={{ textDecorationLine: "underline" }}>Privacy Policy</Text>, including the use of cookies.
              </Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    alignItems: "center",
    zIndex: 10,
    width: "90%",
  },
  logo: { width: 80, height: 80, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: "bold", color: "#1f2937", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#6b7280", textAlign: "center", marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "500", color: "#374151", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#ffffff",
  },
  errorText: { color: "#dc2626", fontSize: 14, textAlign: "center", marginBottom: 16 },
  button: { backgroundColor: "#ef4444", paddingVertical: 16, borderRadius: 10, width: "100%", alignItems: "center", marginBottom: 16 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingVertical: 12,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  socialText: { marginLeft: 8, fontSize: 14, color: "#000" },
  signupContainer: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  signupText: { fontSize: 14, color: "#6b7280" },
  signupButton: { fontSize: 14, color: "#ef4444", fontWeight: "500" },
  terms: { fontSize: 10, color: "#6b7280", textAlign: "center", marginTop: 16 },
});
