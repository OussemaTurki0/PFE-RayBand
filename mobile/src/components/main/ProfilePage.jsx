import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  LayoutAnimation,
  UIManager,
  Platform,
  Dimensions,
  Image,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function ProfilePage() {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkTheme, setDarkTheme] = useState(false);
  const [appLock, setAppLock] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (key) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedItems({ ...expandedItems, [key]: !expandedItems[key] });
  };

  const renderItem = (key, icon, title, description, toggle = false, value = null, setValue = null) => {
    const expanded = expandedItems[key];
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        activeOpacity={0.8}
        onPress={() => (toggle ? null : toggleExpand(key))}
      >
        <View style={styles.itemLeft}>
          {icon && <FontAwesome5 name={icon} size={20} color="#ef4444" style={{ marginRight: 15 }} />}
          <View style={{ flexShrink: 1 }}>
            <Text style={styles.itemTitle}>{title}</Text>
            {(expanded || description) && <Text style={styles.itemDesc}>{description}</Text>}
          </View>
        </View>
        {toggle && <Switch value={value} onValueChange={setValue} />}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 90 }} // padding
    >
      {/* Avatar Header */}
      <View style={styles.avatarContainer}>
        <Image
          source={require("../../../assets/images/oussema.jpeg")}
          style={styles.avatar}
        />
        <Text style={styles.userName}>Oussema</Text>
        <Text style={styles.userEmail}>oussematurki0@Gmail.com</Text>
      </View>

      {/* Account & Profile */}
      <Text style={styles.sectionTitle}>Account & Profile</Text>
      {renderItem("editInfo", "user", "Edit personal information ")}
      {renderItem("profilePic", "camera", "Update your profile picture")}
      {renderItem("password", "key", "Change or reset your password")}
      {renderItem("linked", "link", "Connect Google, Apple, or social accounts")}
      {renderItem("delete", "trash", "Deactivate or delete your account")}

      {/* App Preferences */}
      <Text style={styles.sectionTitle}>App Preferences</Text>
      {renderItem("language", "language", "Select your preferred language")}
      {renderItem("theme", "adjust", "Switch between light and dark theme", true, darkTheme, setDarkTheme)}
      {renderItem("font", "font", "Adjust font size and accessibility options")}
      {renderItem("home", "home", "Select default home screen/page")}
      {renderItem("notificationsPref", "bell", "Manage push, email, and SMS notifications")}

      {/* Privacy & Security */}
      <Text style={styles.sectionTitle}>Privacy & Security</Text>
      {renderItem("permissions", "unlock", "Manage permissions")}
      {renderItem("2fa", "shield-alt", "Enable two-factor authentication")}
      {renderItem("dataShare", "share-alt", "Control what data you share")}
      {renderItem("blocked", "ban", "Manage blocked users or content")}
      {renderItem("lockApp", "lock", "Enable app lock using PIN or biometrics", true, appLock, setAppLock)}

      {/* Notifications */}
      <Text style={styles.sectionTitle}>Notifications</Text>
      {renderItem("pushNotif", "bell", "Enable or disable push notifications", true, pushNotifications, setPushNotifications)}
      {renderItem("notifCategories", "list", "Select categories of notifications to receive")}
      {renderItem("soundVibration", "volume-up", "Control notification sounds and vibration")}

      {/* Connectivity & Sync */}
      <Text style={styles.sectionTitle}>Connectivity & Sync</Text>
      {renderItem("wifi", "wifi", "Control Wi-Fi and mobile data usage")}
      {renderItem("cloudSync", "cloud", "Sync your data across devices")}
      {renderItem("backup", "save", "Backup and restore your data")}
      {renderItem("bluetooth", "bluetooth", "Pair with other devices")}

      {/* App Information */}
      <Text style={styles.sectionTitle}>App Information</Text>
      {renderItem("version", "info-circle", "App version 1.0.0")}
      {renderItem("terms", "file-alt", "View Terms of Service & Privacy Policy")}
      {renderItem("about", "info", "About the app and developer info")}
      {renderItem("licenses", "certificate", "Open-source licenses and acknowledgments")}
      {renderItem("update", "sync-alt", "Check for the latest updates")}

      {/* Support & Feedback */}
      <Text style={styles.sectionTitle}>Support & Feedback</Text>
      {renderItem("support", "headset", "Contact support or report a bug")}
      {renderItem("faq", "question-circle", "FAQs and Help Center")}
      {renderItem("feedback", "comments", "Send feedback or suggestions")}
      {renderItem("rate", "star", "Rate the app")}

      {/* Advanced / Developer Options */}
      <Text style={styles.sectionTitle}>Advanced / Developer Options</Text>
      {renderItem("beta", "bezier-curve", "Join beta program")}
      {renderItem("experimental", "flask", "Enable experimental features")}
      {renderItem("reset", "redo-alt", "Reset app to default settings")}
      {renderItem("clearCache", "trash-alt", "Clear cache and local data")}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f7f7cc" },
  avatarContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    marginBottom: 10,
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "#ef4444",
  },
  userName: { fontSize: 20, fontWeight: "bold", marginTop: 10, color: "#111827" },
  userEmail: { fontSize: 14, color: "#6b7280" },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 15,
    marginLeft: 15,
    color: "#1f2937",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginVertical: 6,
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  itemLeft: { flexDirection: "row", alignItems: "center" },
  itemTitle: { fontSize: 16, fontWeight: "600", color: "#111827" },
  itemDesc: { fontSize: 13, color: "#6b7280", marginTop: 3 },
});
