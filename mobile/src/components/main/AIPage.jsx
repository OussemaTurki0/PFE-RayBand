import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";

const API_URL = "https://4214-197-14-219-208.ngrok-free.app";

export default function AIPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();

  const BOTTOM_NAV_HEIGHT = 90;

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        type: "info",
        content:
           "👋 Hi! I’m your Medical Health AI Assistant.\n🩺 I can run a quick diagnosis based on your weekly health data, or answer any medical-related questions you may have.\n⚠️ Please note: I respond to medical topics only.",
      },
    ]);
  }, []);

  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loopAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    loopAnim.start();
    return () => loopAnim.stop();
  }, []);

  const Dot = ({ delay }) => {
    const opacity = anim.interpolate({
      inputRange: [0, 0.25, 0.5, 0.75, 1],
      outputRange: [0, 1, 0, 1, 0],
    });

    const shiftedOpacity = Animated.add(opacity, delay).interpolate({
      inputRange: [0, 1, 2],
      outputRange: [0, 1, 0],
    });

    return (
      <Animated.View
        style={{
          width: 6,
          height: 6,
          backgroundColor: "#9ca3af",
          borderRadius: 3,
          opacity: shiftedOpacity,
          marginHorizontal: 2,
        }}
      />
    );
  };

  const showTyping = () => {
    setMessages((p) => [
      ...p,
      { role: "assistant", type: "typing", content: "typing" },
    ]);
  };

  const removeTyping = () => {
    setMessages((p) => p.filter((m) => m.type !== "typing"));
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const text = input;
    setInput("");
    setMessages((p) => [...p, { role: "user", type: "user", content: text }]);
    setLoading(true);

    showTyping();

    try {
      const res = await fetch(`${API_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });

      const data = await res.json();

      let reply = data.answer;

      if (data.sources?.length) {
        reply += "\n\n📚 Sources:\n";
        data.sources.forEach((s) => {
          reply += `• ${s.book} — page ${s.page}\n`;
        });
      }

      removeTyping();

      setMessages((p) => [
        ...p,
        { role: "assistant", type: "answer", content: reply },
      ]);
    } catch {
      removeTyping();
      setMessages((p) => [
        ...p,
        { role: "assistant", type: "error", content: "⚠️ Server error" },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const getDiagnosis = async () => {
    if (loading) return;

    setLoading(true);
    showTyping();

    try {
      const res = await fetch(`${API_URL}/diagnose`);
      const data = await res.json();

      removeTyping();

      setMessages((p) => [
        ...p,
        {
          role: "assistant",
          type: "diagnosis",
          content: `🩺 Diagnosis:\n${data.diagnosis}`,
        },
      ]);
    } catch {
      removeTyping();
      setMessages((p) => [
        ...p,
        { role: "assistant", type: "error", content: "⚠️ Server error" },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={{ backgroundColor: "#dc2626", padding: 14 }}>
          <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>
            RayBand AI
          </Text>
          <Text style={{ color: "#fff", opacity: 0.9 }}>
            Medical Assistant
          </Text>
        </View>

        <ScrollView
          ref={scrollRef}
          style={{ flex: 1, padding: 12 }}
          contentContainerStyle={{ paddingBottom: BOTTOM_NAV_HEIGHT + 90 }}
        >
          {messages.map((m, i) => (
            <View
              key={i}
              style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                backgroundColor:
                  m.type === "diagnosis"
                    ? "#FFE0CC"
                    : m.type === "typing"
                    ? "#e5e7eb"
                    : m.role === "user"
                    ? "#dc2626"
                    : "#e5e7eb",
                padding: 10,
                borderRadius: 8,
                marginBottom: 8,
                maxWidth: "85%",
              }}
            >
              {m.type === "typing" ? (
                <View style={{ flexDirection: "row" }}>
                  <Dot delay={0} />
                  <Dot delay={0.5} />
                  <Dot delay={1} />
                </View>
              ) : (
                <Text
                  style={{
                    color:
                      m.type === "diagnosis"
                        ? "#000"
                        : m.role === "user"
                        ? "#fff"
                        : "#111",
                  }}
                >
                  {m.content}
                </Text>
              )}
            </View>
          ))}
        </ScrollView>

        <View
          style={{
            flexDirection: "row",
            gap: 8,
            padding: 10,
            paddingBottom: BOTTOM_NAV_HEIGHT,
            borderTopWidth: 1,
            borderColor: "#ddd",
            backgroundColor: "#fff",
          }}
        >
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask a medical question..."
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 10,
            }}
            multiline
            editable={!loading}
          />

          <TouchableOpacity
            onPress={sendMessage}
            disabled={loading}
            style={{
              backgroundColor: loading ? "#a1a1aa" : "#dc2626",
              paddingHorizontal: 14,
              borderRadius: 8,
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#fff" }}>Send</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={getDiagnosis}
            disabled={loading}
            style={{
              backgroundColor: loading ? "#a1a1aa" : "#f59e0b",
              paddingHorizontal: 12,
              borderRadius: 8,
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#fff" }}>Diagnosis</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
