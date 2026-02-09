import React, { useState, useEffect, useRef } from "react";
import { ScrollView, View, Text, Dimensions } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import vitalsData from "./12hours_vitals_3s.json";

export default function HomePage({ alerts = [], pairedDevices = [] }) {
  const [vitals, setVitals] = useState({
    heartRate: 80,
    oxygenLevel: 98,
    temperature: 37,
  });
  const [aiFeedback, setAiFeedback] = useState("");
  const [dailyTip, setDailyTip] = useState("");

  const indexRef = useRef(0);

  // Playback 3 s
  useEffect(() => {
    const interval = setInterval(() => {
      const dataPoint = vitalsData[indexRef.current];
      if (dataPoint) {
        setVitals({
          heartRate: dataPoint.heartRate,
          oxygenLevel: dataPoint.oxygenLevel,
          temperature: dataPoint.temperature,
        });
        indexRef.current = (indexRef.current + 1) % vitalsData.length;
      }
    }, 3000); // 3 
    return () => clearInterval(interval);
  }, []);

  // AI Feedback
  useEffect(() => {
    const { heartRate, oxygenLevel, temperature } = vitals;
    let feedback = "✅ Normal readings.";

    if (heartRate > 100) feedback = "⚠️ High heart rate detected.";
    else if (heartRate < 60) feedback = "⚠️ Low heart rate detected.";

    if (oxygenLevel < 95) feedback += "\n⚠️ Oxygen level is low.";
    if (temperature > 37.8) feedback += "\n🤒 Possible fever detected.";

    setAiFeedback(feedback);
  }, [vitals]);

  // Daily Tip
  useEffect(() => {
    const tips = [
      "💧 Drink enough water today.",
      "🚶 Take a short walk for fresh air.",
      "🥗 Eat a light and balanced meal.",
      "🧘 Take a moment to breathe deeply.",
    ];
    setDailyTip(tips[new Date().getDay() % tips.length]);
  }, []);

  const screenWidth = Dimensions.get("window").width - 40; // chart-width

  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [78, 80, 76, 85, 74, 82, vitals.heartRate],
        color: (opacity = 1) => `rgba(220, 38, 38, ${opacity})`,
        strokeWidth: 4,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(220, 38, 38, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    propsForDots: { r: "4", strokeWidth: "2", stroke: "#dc2626" },
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ padding: 20 }}>
        {/* Title */}
        <View style={{ alignItems: "center", marginBottom: 30 }}>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#dc2626" }}>
            <FontAwesome5 name="heartbeat" size={22} color="#dc2626" /> Health Monitor
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#dcfce7",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
              marginTop: 8,
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                backgroundColor: "#10b981",
                borderRadius: 4,
                marginRight: 8,
              }}
            />
            <Text style={{ fontSize: 12, color: "#166534", fontWeight: "500" }}>
              Live Monitoring
            </Text>
          </View>
        </View>

        {/* Weekly Line Chart */}
        <View style={cardStyle}>
          <Text style={cardTitle}>Weekly Heart Rate</Text>
          <LineChart
            data={chartData}
            width={screenWidth - 22}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{ borderRadius: 16 }}
            fromZero
            yAxisSuffix=" BPM"
          />
        </View>

        {/* Health Overview */}
        <View style={cardStyle}>
          <Text style={cardTitle}>Health Overview</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <MetricCard label="Heart Rate" value={`${vitals.heartRate}`} icon="heartbeat" />
            <MetricCard label="Oxygen" value={`${vitals.oxygenLevel}%`} icon="lungs" />
            <MetricCard label="Temperature" value={`${vitals.temperature}°C`} icon="thermometer-half" />
          </View>
        </View>

        {/* General Health Standards */}
        <View style={cardStyle}>
          <Text style={cardTitle}>🧬 General Health Standards :</Text>
          <Text style={listText}><Text style={{ fontWeight: "bold" }}>Heart Rate:</Text> 60–100 BPM (normal)</Text>
          <Text style={listText}>• Below 60 may indicate bradycardia, which can be normal for athletes but may need medical attention if accompanied by dizziness or fatigue.</Text>
          <Text style={listText}>• Above 100 could indicate tachycardia, possibly due to exercise or stress, but persistent high rates may require a check-up.</Text>
          <Text style={listText}><Text style={{ fontWeight: "bold" }}>Oxygen Level:</Text> 95–100% (normal)</Text>
          <Text style={listText}>• If it drops below 90%, it can be a sign that your body isn’t getting enough oxygen, which may need medical attention.</Text>
          <Text style={listText}><Text style={{ fontWeight: "bold" }}>Temperature:</Text> 36.5–37.5°C (normal)</Text>
          <Text style={listText}>• Above 38°C usually indicates a fever, often linked to infection or inflammation.</Text>
        </View>

        {/* Alerts, Devices, AI Feedback, Daily Tip */}
        <View style={cardStyle}>
          <Text style={cardTitle}>Recent Alerts</Text>
          {alerts.map((alert) => (
            <View
              key={alert.id}
              style={{
                backgroundColor: alert.type === "info" ? "#eff6ff" : "#f0fdf4",
                padding: 12,
                borderRadius: 8,
                marginBottom: 8,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FontAwesome5
                  name={alert.type === "info" ? "info-circle" : "check-circle"}
                  size={16}
                  color={alert.type === "info" ? "#3b82f6" : "#10b981"}
                  style={{ marginRight: 6 }}
                />
                <Text style={{ fontSize: 14, color: "#374151" }}>{alert.message}</Text>
              </View>
              <Text style={{ fontSize: 12, color: "#6b7280" }}>{alert.time}</Text>
            </View>
          ))}
        </View>

        <View style={cardStyle}>
          <Text style={cardTitle}>Connected Devices</Text>
          {pairedDevices.map((device) => (
            <View
              key={device.id}
              style={{
                backgroundColor: "#f9fafb",
                padding: 12,
                borderRadius: 8,
                marginBottom: 8,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "500" }}>{device.name}</Text>
              <Text style={{ fontSize: 12, color: "#6b7280" }}>Last sync: {device.lastSync}</Text>
              <Text style={{ fontSize: 12, color: "#10b981" }}>
                <FontAwesome5 name="circle" size={8} color="#10b981" /> Connected
              </Text>
            </View>
          ))}
        </View>

        <View style={cardStyle}>
          <Text style={cardTitle}>AI Advisor</Text>
          <Text style={{ fontSize: 14, color: "#374151", marginTop: 8 }}>{aiFeedback}</Text>
        </View>

        <View style={cardStyle}>
          <Text style={cardTitle}>🩺 Daily Tip</Text>
          <Text style={{ fontSize: 14, color: "#374151", marginTop: 8 }}>{dailyTip}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

//Metric Card
const MetricCard = ({ label, value, icon }) => (
  <View
    style={{
      backgroundColor: "#fef2f2",
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
      flex: 1,
      marginHorizontal: 4,
    }}
  >
    <FontAwesome5 name={icon} size={22} color="#dc2626" style={{ marginBottom: 8 }} />
    <Text style={{ fontSize: 18, fontWeight: "bold", color: "#1f2937" }}>{value}</Text>
    <Text style={{ fontSize: 12, color: "#6b7280" }}>{label}</Text>
  </View>
);

//Styles
const cardStyle = {
  backgroundColor: "#ffffff",
  borderRadius: 16,
  padding: 20,
  marginBottom: 20,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
};

const cardTitle = {
  fontSize: 18,
  fontWeight: "600",
  color: "#1f2937",
  marginBottom: 12,
};

const listText = {
  fontSize: 14,
  color: "#374151",
  marginBottom: 4,
};
