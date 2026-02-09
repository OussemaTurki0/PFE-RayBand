// components/LoadingScreen.tsx
import React, { useEffect, useState, useRef } from "react";
import { SafeAreaView, View, Text, Animated, Easing, StatusBar, StyleSheet, Image } from "react-native";
import Svg, { Polyline, Defs, LinearGradient, Stop, Rect } from "react-native-svg";

export default function LoadingScreen() {
  const [dotIndex, setDotIndex] = useState(0);
  const dotsArray = ["", ".", "..", "..."];

  // Heartbeat anim
  const strokeAnim = useRef(new Animated.Value(1000)).current;
  const fadeInAnim = useRef(new Animated.Value(0)).current;
  const fadeOutAnim = useRef(new Animated.Value(-1.2)).current;

  useEffect(() => {
    // Dot anim
    const interval = setInterval(() => {
      setDotIndex((prev) => (prev + 1) % dotsArray.length);
    }, 500);

    // Heartbeat line draw
    Animated.loop(
      Animated.timing(strokeAnim, {
        toValue: 0,
        duration: 2500,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();

    // Fade-in
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeInAnim, {
          toValue: 1,
          duration: 2500,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(fadeInAnim, {
          toValue: 1,
          duration: 2500,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Fade-out
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeOutAnim, {
          toValue: 0,
          duration: 4000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.delay(1000),
      ])
    ).start();

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.inner}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../assets/images/logo1.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>RayBand Health Monitor</Text>
        <Text style={styles.subtitle}>
          Protect your loved ones with RayBand
        </Text>

        {/* Heartbeat Line */}
        <View style={styles.heartbeatContainer}>
          <Svg width={150} height={73} viewBox="0 0 150 73">
            <Polyline
              points="0,45.486 38.514,45.486 44.595,33.324 50.676,45.486 57.771,45.486 62.838,55.622 71.959,9 80.067,63.729 84.122,45.486 97.297,45.486 103.379,40.419 110.473,45.486 150,45.486"
              fill="none"
              stroke="#ffffff"
              strokeWidth={3}
              strokeDasharray="1000"
              strokeDashoffset={strokeAnim}
            />
          </Svg>

          {/* Fade-in overlay */}
          <Animated.View
            style={[
              styles.fadeIn,
              {
                width: fadeInAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["100%", "0%"],
                }),
              },
            ]}
          />

          {/* Fade-out gradient sweep */}
          <Animated.View
            style={[
              styles.fadeOut,
              {
                left: fadeOutAnim.interpolate({
                  inputRange: [-1.2, 0],
                  outputRange: ["-120%", "0%"],
                }),
              },
            ]}
          >
            <Svg width="100%" height="100%">
              <Defs>
                <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <Stop offset="0%" stopColor="#ef4444" stopOpacity="1" />
                  <Stop offset="80%" stopColor="#ef4444" stopOpacity="1" />
                  <Stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </LinearGradient>
              </Defs>
              <Rect width="100%" height="100%" fill="url(#grad)" rx={8} ry={8} />
            </Svg>
          </Animated.View>
        </View>

        {/* Loading text with dots */}
        <View style={styles.loadingTextContainer}>
          <Text style={styles.loadingText}>Loading</Text>
          <Text style={styles.loadingTextDots}>{dotsArray[dotIndex]}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ef4444" },
  inner: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20 },
  logoContainer: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  logoImage: {
    width: 120,
    height: 120,
    borderRadius: 0,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#ffffff", textAlign: "center", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#ffffff", textAlign: "center", marginBottom: 40, opacity: 0.9 },
  heartbeatContainer: { marginBottom: 30, width: 150, height: 73 },
  fadeIn: { position: "absolute", height: "100%", top: 0, right: 0, backgroundColor: "#ef4444", borderRadius: 8 },
  fadeOut: { position: "absolute", height: "100%", width: "120%", top: 0, overflow: "hidden" },
  loadingTextContainer: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  loadingText: { fontSize: 18, color: "#ffffff", marginRight: 10 },
  loadingTextDots: { fontSize: 18, color: "#ffffff", minWidth: 30 },
});
