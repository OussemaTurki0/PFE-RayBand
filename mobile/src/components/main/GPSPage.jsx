import React, { useEffect, useState, useRef } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
} from "react-native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import * as Linking from "expo-linking";

export default function GPSPage({ pairedDevices }) {
  const screenWidth = Dimensions.get("window").width;
  const [currentLocation, setCurrentLocation] = useState(null);
  const [MapViewModule, setMapViewModule] = useState(null);
  const blinkAnim = useRef(new Animated.Value(0)).current;

  // Blinking animation
  useEffect(() => {
    if (Platform.OS !== "web") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.timing(blinkAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
        ])
      ).start();
    }
  }, []);

  // Fetch current location
  useEffect(() => {
    if (Platform.OS === "web") {
      //browser geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setCurrentLocation({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              accuracy: pos.coords.accuracy,
              timestamp: new Date().toLocaleTimeString(),
            });
          },
        );
      }

      import("react-native-maps").then((mod) => setMapViewModule(mod));
    }
  }, []);

  const displayLocation = currentLocation || {
    lat: 34.769366,
    lng: 10.787124,
    accuracy: 10,
    timestamp: new Date().toLocaleTimeString(),
  };

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${displayLocation.lat},${displayLocation.lng}`;
    Linking.openURL(url);
  };

  // API
  useEffect(() => {
    if (Platform.OS === "web" && currentLocation) {
      if (!window.google) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=*****************************`;
        script.async = true;
        script.onload = () => initWebMap();
        document.body.appendChild(script);
      } else {
        initWebMap();
      }

      function initWebMap() {
        const map = new window.google.maps.Map(document.getElementById("web-map"), {
          center: { lat: displayLocation.lat, lng: displayLocation.lng },
          zoom: 18,
        });

        // blinking 
        const markerDiv = document.createElement("div");
        markerDiv.style.width = "20px";
        markerDiv.style.height = "20px";
        markerDiv.style.backgroundColor = "#dc2626";
        markerDiv.style.borderRadius = "50%";
        markerDiv.style.border = "2px solid white";
        markerDiv.style.animation = "blink 1s infinite";

        const overlay = new window.google.maps.OverlayView();
        overlay.onAdd = function () {
          const panes = this.getPanes();
          panes.overlayMouseTarget.appendChild(markerDiv);
          this.draw = () => {
            const point = this.getProjection().fromLatLngToDivPixel(
              new window.google.maps.LatLng(displayLocation.lat, displayLocation.lng)
            );
            markerDiv.style.left = `${point.x - 10}px`;
            markerDiv.style.top = `${point.y - 10}px`;
            markerDiv.style.position = "absolute";
          };
        };
        overlay.setMap(map);
      }
    }
  }, [currentLocation]);

  // MapView
  const MapView = MapViewModule?.default;
  const Marker = MapViewModule?.Marker;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <View style={{ padding: 20 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#dc2626",
            textAlign: "center",
            marginBottom: 30,
          }}
        >
          <FontAwesome5 name="map-marker-alt" size={28} color="#dc2626" /> GPS Tracking
        </Text>

        {/* Map */}
        {Platform.OS === "web" ? (
          <div
            id="web-map"
            style={{
              width: "100%",
              height: 450,
              borderRadius: 16,
              overflow: "hidden",
              marginBottom: 20,
            }}
          />
        ) : (
          MapView &&
          Marker && (
            <View
              style={{
                borderRadius: 16,
                overflow: "hidden",
                marginBottom: 20,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <MapView
                provider="google"
                style={{ width: screenWidth - 40, height: 450 }}
                region={{
                  latitude: displayLocation.lat,
                  longitude: displayLocation.lng,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker coordinate={{ latitude: displayLocation.lat, longitude: displayLocation.lng }}>
                  <Animated.View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: "#dc2626",
                      opacity: blinkAnim,
                      borderWidth: 2,
                      borderColor: "#fff",
                    }}
                  />
                </Marker>
              </MapView>
            </View>
          )
        )}

        {/* Open in Google Maps */}
        <TouchableOpacity
          style={{
            backgroundColor: "#dc2626",
            padding: 16,
            borderRadius: 12,
            alignItems: "center",
            marginBottom: 20,
            flexDirection: "row",
            justifyContent: "center",
          }}
          onPress={openInGoogleMaps}
        >
          <FontAwesome name="map" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>Open in Google Maps</Text>
        </TouchableOpacity>

        {/* Location Details */}
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
          <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 16 }}>Location Details</Text>
          <View style={{ backgroundColor: "#f9fafb", padding: 16, borderRadius: 12 }}>
            {["Latitude", "Longitude", "Accuracy", "Last Update"].map((label, idx) => (
              <View
                key={idx}
                style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: idx < 3 ? 8 : 0 }}
              >
                <Text style={{ fontSize: 14, color: "#6b7280" }}>{label}:</Text>
                <Text style={{ fontSize: 14, fontWeight: "500", color: "#1f2937" }}>
                  {label === "Latitude"
                    ? displayLocation.lat.toFixed(6)
                    : label === "Longitude"
                    ? displayLocation.lng.toFixed(6)
                    : label === "Accuracy"
                    ? `±${Math.round(displayLocation.accuracy)}m`
                    : displayLocation.timestamp}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Connected Devices */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 20,
            marginBottom: 100,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 16 }}>Connected Devices</Text>
          {pairedDevices.map((device) => (
            <View
              key={device.id}
              style={{
                backgroundColor: "#f9fafb",
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
                <Text style={{ fontSize: 14, color: "#6b7280" }}>
                  Location: {device.location.lat.toFixed(4)}, {device.location.lng.toFixed(4)}
                </Text>
                <Text style={{ fontSize: 14, color: "#6b7280" }}>Last sync: {device.lastSync}</Text>
              </View>
              <View style={{ alignItems: "center" }}>
                <FontAwesome5 name="location-arrow" size={20} color="#dc2626" />
                <Text style={{ fontSize: 12, color: "#10b981", fontWeight: "500" }}>Connected</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Web blinking marker CSS */}
      {Platform.OS === "web" && (
        <style>
          {`
            @keyframes blink {
              0%, 100% { opacity: 0; }
              50% { opacity: 1; }
            }
          `}
        </style>
      )}
    </ScrollView>
  );
}
