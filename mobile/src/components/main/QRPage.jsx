import React from "react";
import { ScrollView, View, Text, TouchableOpacity, Dimensions } from "react-native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";

export default function QRPage({ pairedDevices, showScanner, setShowScanner }) {
  const screenWidth = Dimensions.get("window").width;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <View style={{ padding: 20 }}>
        {/* Header */}
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#dc2626",
            textAlign: "center",
            marginBottom: 30,
          }}
        >
          <FontAwesome5 name="qrcode" size={28} color="#dc2626" /> QR Scanner
        </Text>

        {/* QR Scanner Section */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 16 }}>Scan QR Code</Text>

          {showScanner ? (
            <View
              style={{
                width: screenWidth - 40,
                height: screenWidth - 40,
                backgroundColor: "#f3f4f6",
                borderRadius: 16,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FontAwesome name="camera" size={48} color="#9ca3af" />
              <Text style={{ color: "#6b7280", marginTop: 8 }}>Camera activating...</Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => setShowScanner(true)}
              style={{
                width: "100%",
                backgroundColor: "#dc2626",
                padding: 16,
                borderRadius: 12,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
              }}
            >
              <FontAwesome name="qrcode" size={20} color="#fff" />
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>Scan New Device</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Paired Devices */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 16 }}>Associated Devices</Text>

          {pairedDevices.map((device) => (
            <View
              key={device.id}
              style={{
                backgroundColor: "#f3f4f6",
                padding: 16,
                borderRadius: 12,
                marginBottom: 12,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View>
                <Text style={{ fontSize: 16, fontWeight: "500", color: "#1f2937" }}>{device.name}</Text>
                <Text style={{ fontSize: 14, color: "#6b7280" }}>Last sync: {device.lastSync}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text style={{ fontSize: 14, color: "#10b981", fontWeight: "500" }}>{device.status}</Text>
                <TouchableOpacity>
                  <FontAwesome name="trash" size={20} color="#9ca3af" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
