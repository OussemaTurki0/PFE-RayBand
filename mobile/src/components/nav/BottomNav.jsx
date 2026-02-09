import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

export default function BottomNav({ activePage, setActivePage }) {
  const navItems = [
    { name: "home", icon: "home", label: "Home" },
    { name: "bracelet", icon: "id-card", label: "Wearer" },
    { name: "gps", icon: "map-marker-alt", label: "GPS" },
    { name: "qr", icon: "qrcode", label: "QR" },
    { name: "ai", icon: "brain", label: "AI" },
    { name: "settings", icon: "cog", label: "Settings" },
  ];

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#dc2626",
        paddingVertical: 12,
        paddingHorizontal: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.name}
            onPress={() => setActivePage(item.name)}
            style={{
              flex: 1,
              alignItems: "center",
              paddingVertical: 8,
              opacity: activePage === item.name ? 1 : 0.7,
              transform: [{ scale: activePage === item.name ? 1.1 : 1 }],
            }}
          >
            <FontAwesome5
              name={item.icon}
              size={20}
              color="#ffffff"
              style={{ marginBottom: 4 }}
            />
            <Text
              style={{
                color: "#ffffff",
                fontSize: 10,
                fontWeight: activePage === item.name ? "600" : "400",
              }}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
