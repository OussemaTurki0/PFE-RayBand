import React, { useState, useEffect, useRef } from "react";
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
  Modal,
  FlatList,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import logo2 from "../../../assets/images/logo2.png";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function LoginScreen({ onLogin, goToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [devModalVisible, setDevModalVisible] = useState(false);

  const bubbleCount = 20;
  const bubbles = useRef(
    [...Array(bubbleCount)].map(() => ({
      translateY: new Animated.Value(Math.random() * SCREEN_HEIGHT),
      opacity: new Animated.Value(Math.random() * 0.5 + 0.3),
    }))
  ).current;

  useEffect(() => {
    loadUsers(); // load users from AsyncStorage

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

  // Load users from AsyncStorage
  const loadUsers = async () => {
    try {
      const storedUsers = await AsyncStorage.getItem("users");
      if (storedUsers) setUsers(JSON.parse(storedUsers));
      else setUsers([]);
    } catch (e) {
      console.error("Failed to load users:", e);
    }
  };

  // Save a new user (for testing or signup)
  const saveUser = async (newUser) => {
    try {
      const updated = [...users, newUser];
      setUsers(updated);
      await AsyncStorage.setItem("users", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save user:", e);
    }
  };

  // Delete user by email
  const deleteUser = async (emailToDelete) => {
    try {
      const filtered = users.filter((u) => u.email !== emailToDelete);
      setUsers(filtered);
      await AsyncStorage.setItem("users", JSON.stringify(filtered));
    } catch (e) {
      console.error("Delete user error:", e);
    }
  };

  const showUsers = async () => {
    await loadUsers();
    setDevModalVisible(true);
  };

  // Handle login
  const onSubmit = () => {
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
      setTimeout(() => {
        setLoading(false);
        onLogin();
      }, 500);
    } else {
      setError("Incorrect email or password");
      setLoading(false);
    }
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
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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

            {/* Login Card */}
            <View style={styles.card}>
              <Image source={logo2} style={styles.logo} resizeMode="contain" />
              <Text style={styles.title}>Welcome to RayBand</Text>
              <Text style={styles.subtitle}>Caring for your loved ones starts here.</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  secureTextEntry
                  style={styles.input}
                />
              </View>

              {error && <Text style={styles.errorText}>{error}</Text>}

              <TouchableOpacity
                onPress={onSubmit}
                disabled={loading}
                style={[styles.button, loading && { backgroundColor: "#9ca3af" }]}
              >
                <Text style={styles.buttonText}>{loading ? "Signing in..." : "Sign In"}</Text>
              </TouchableOpacity>

              {/* Social buttons */}
              <View style={{ width: "100%", marginBottom: 16 }}>
                <TouchableOpacity style={styles.socialButton}>
                  <FontAwesome name="facebook" size={16} color="#000" />
                  <Text style={styles.socialText}>Continue with Facebook</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <FontAwesome name="apple" size={16} color="#000" />
                  <Text style={styles.socialText}>Continue with Apple</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <FontAwesome name="envelope" size={16} color="#000" />
                  <Text style={styles.socialText}>Continue with Email</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account?</Text>
                <TouchableOpacity onPress={goToSignup}>
                  <Text style={styles.signupButton}> Sign up</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.terms}>
                By signing in, you agree to the{" "}
                <Text style={{ textDecorationLine: "underline" }}>Terms of Use</Text> and{" "}
                <Text style={{ textDecorationLine: "underline" }}>Privacy Policy</Text>, including the use of cookies.
              </Text>

              {/* Dev Button */}
              <TouchableOpacity onPress={showUsers}>
                <Text style={styles.devButton}>For development purposes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Dev Users Modal */}
        <Modal
          visible={devModalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setDevModalVisible(false)}
        >
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}>
            <View style={{ width: "85%", backgroundColor: "#fff", borderRadius: 12, padding: 20, maxHeight: "70%" }}>
              <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>Registered Users</Text>
              <FlatList
                data={users}
                keyExtractor={(item) => item.email}
                renderItem={({ item }) => (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 12,
                    }}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <MaterialIcons name="person" size={24} color="#ef4444" />
                      <Text>{item.email} / {item.password || "-"}</Text>
                    </View>
                    <TouchableOpacity onPress={() => deleteUser(item.email)}>
                      <MaterialIcons name="delete" size={24} color="#dc2626" />
                    </TouchableOpacity>
                  </View>
                )}
              />
              <TouchableOpacity
                onPress={() => setDevModalVisible(false)}
                style={{ marginTop: 12, alignSelf: "center" }}
              >
                <Text style={{ color: "#ef4444", fontWeight: "bold" }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  inputGroup: { width: "100%", marginBottom: 16 },
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
  devButton: { fontSize: 12, color: "#ef4444", textAlign: "center", marginTop: 8, textDecorationLine: "underline" },
});
