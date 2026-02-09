import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Picker,
  Platform,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

export default function BraceletHolderPage({ userInfo, medicalInfo, emergencyContacts }) {
  const [editMode, setEditMode] = useState(false);

  const [localUser, setLocalUser] = useState({ ...userInfo });
  const [localMedical, setLocalMedical] = useState({ ...medicalInfo });
  const [localContacts, setLocalContacts] = useState([...emergencyContacts]);

  const handleInputChange = (field, value) => {
    setLocalUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log("Saved data:", localUser, localMedical, localContacts);
    setEditMode(false);
  };

  const handleCancel = () => {
    setLocalUser({ ...userInfo });
    setLocalMedical({ ...medicalInfo });
    setLocalContacts([...emergencyContacts]);
    setEditMode(false);
  };

  const renderPills = (items) => {
    return (
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
        {items.map((item, i) => (
          <View
            key={i}
            style={{
              backgroundColor: "#fef2f2",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 16,
              marginBottom: 6,
            }}
          >
            <Text style={{ fontSize: 12, color: "#dc2626" }}>{item}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "ios" ? 50 : 20,
        paddingHorizontal: 20,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <FontAwesome5 name="id-card" size={20} color="#dc2626" />
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#dc2626" }}>
            Wearer Information
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setEditMode(!editMode)}
          style={{
            borderWidth: 1,
            borderColor: "#dc2626",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 6,
            backgroundColor: editMode ? "#dc2626" : "transparent",
          }}
        >
          <Text style={{ color: editMode ? "#fff" : "#dc2626", fontWeight: "600" }}>
            {editMode ? "Cancel" : "Edit"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Personal Info */}
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 20,
          marginBottom: 20,
          elevation: 3,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 16 }}>
          Personal Information
        </Text>
        {[
          "firstName",
          "lastName",
          "age",
          "gender",
          "bloodType",
          "idNumber",
          "passportNumber",
          "height",
          "weight",
          "homeLocation",
        ].map((field) => (
          <View
            key={field}
            style={{ flexDirection: "row", marginBottom: 12, alignItems: "flex-start" }}
          >
            <Text style={{ width: 100, color: "#6b7280", flexShrink: 0 }}>
              {field === "firstName" && "First Name:"}
              {field === "lastName" && "Last Name:"}
              {field === "age" && "Age:"}
              {field === "gender" && "Gender:"}
              {field === "bloodType" && "Blood Type:"}
              {field === "idNumber" && "ID:"}
              {field === "passportNumber" && "Passport:"}
              {field === "height" && "Height:"}
              {field === "weight" && "Weight:"}
              {field === "homeLocation" && "Home:"}
            </Text>

            {editMode ? (
              field === "gender" ? (
                <Picker
                  selectedValue={localUser.gender}
                  style={{ flex: 1 }}
                  onValueChange={(val) => handleInputChange("gender", val)}
                >
                  <Picker.Item label="Male" value="male" />
                  <Picker.Item label="Female" value="female" />
                </Picker>
              ) : (
                <TextInput
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    borderRadius: 6,
                    padding: 6,
                    minHeight: field === "homeLocation" ? 40 : 0,
                    textAlignVertical: field === "homeLocation" ? "top" : "center",
                  }}
                  value={String(localUser[field] || "")}
                  keyboardType={["age", "height", "weight"].includes(field) ? "numeric" : "default"}
                  onChangeText={(val) => handleInputChange(field, val)}
                  multiline={field === "homeLocation"} // wrap long addresses
                />
              )
            ) : (
              <Text
                style={{
                  fontWeight: "500",
                  color: "#1f2937",
                  flexShrink: 1,
                  flexWrap: "wrap",
                }}
              >
                {field === "firstName"
                  ? localUser.firstName
                  : field === "lastName"
                  ? localUser.lastName
                  : field === "age"
                  ? localUser.age + " years"
                  : field === "height"
                  ? localUser.height + " cm"
                  : field === "weight"
                  ? localUser.weight + " kg"
                  : localUser[field]}
              </Text>
            )}
          </View>
        ))}
      </View>

      {/* Medical Info */}
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 20,
          marginBottom: 20,
          elevation: 3,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 16 }}>
          Medical Information
        </Text>

        {/* Conditions */}
        <Text style={{ fontWeight: "500", marginBottom: 8 }}>Conditions:</Text>
        {editMode ? (
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#e5e7eb",
              borderRadius: 6,
              padding: 6,
              marginBottom: 12,
            }}
            value={localMedical.conditions.join(", ")}
            onChangeText={(val) =>
              setLocalMedical((prev) => ({
                ...prev,
                conditions: val.split(",").map((i) => i.trim()),
              }))
            }
          />
        ) : (
          renderPills(localMedical.conditions)
        )}

        {/* Allergies */}
        <Text style={{ fontWeight: "500", marginBottom: 8, marginTop: 12 }}>Allergies:</Text>
        {editMode ? (
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#e5e7eb",
              borderRadius: 6,
              padding: 6,
              marginBottom: 12,
            }}
            value={localMedical.allergies.join(", ")}
            onChangeText={(val) =>
              setLocalMedical((prev) => ({
                ...prev,
                allergies: val.split(",").map((i) => i.trim()),
              }))
            }
          />
        ) : (
          renderPills(localMedical.allergies)
        )}

        {/* Medications */}
        <Text style={{ fontWeight: "500", marginBottom: 8, marginTop: 12 }}>Medications:</Text>
        {localMedical.medications.map((med, index) => (
          <View
            key={index}
            style={{ backgroundColor: "#f9fafb", padding: 12, borderRadius: 8, marginBottom: 8 }}
          >
            {editMode ? (
              <>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    borderRadius: 6,
                    padding: 6,
                    marginBottom: 4,
                  }}
                  value={med.name}
                  placeholder="Name"
                  onChangeText={(val) => {
                    const updated = [...localMedical.medications];
                    updated[index].name = val;
                    setLocalMedical({ ...localMedical, medications: updated });
                  }}
                />
                <TextInput
                  style={{ borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 6, padding: 6 }}
                  value={med.dosage}
                  placeholder="Dosage"
                  onChangeText={(val) => {
                    const updated = [...localMedical.medications];
                    updated[index].dosage = val;
                    setLocalMedical({ ...localMedical, medications: updated });
                  }}
                />
              </>
            ) : (
              <>
                <Text style={{ fontWeight: "500", color: "#1f2937" }}>{med.name}</Text>
                <Text style={{ color: "#6b7280" }}>{med.dosage}</Text>
              </>
            )}
          </View>
        ))}
      </View>

      {/* Emergency Contacts */}
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 20,
          marginBottom: 120,
          elevation: 3,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 16 }}>
          Emergency Contacts
        </Text>
        {localContacts.map((contact, index) => (
          <View
            key={contact.id}
            style={{
              backgroundColor: "#f9fafb",
              padding: 16,
              borderRadius: 12,
              marginBottom: 12,
            }}
          >
            {editMode ? (
              <>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    borderRadius: 6,
                    padding: 6,
                    marginBottom: 4,
                  }}
                  value={contact.name}
                  placeholder="Name"
                  onChangeText={(val) => {
                    const updated = [...localContacts];
                    updated[index].name = val;
                    setLocalContacts(updated);
                  }}
                />
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    borderRadius: 6,
                    padding: 6,
                    marginBottom: 4,
                  }}
                  value={contact.relation}
                  placeholder="Relation"
                  onChangeText={(val) => {
                    const updated = [...localContacts];
                    updated[index].relation = val;
                    setLocalContacts(updated);
                  }}
                />
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    borderRadius: 6,
                    padding: 6,
                  }}
                  value={contact.phone}
                  placeholder="Phone"
                  onChangeText={(val) => {
                    const updated = [...localContacts];
                    updated[index].phone = val;
                    setLocalContacts(updated);
                  }}
                />
              </>
            ) : (
              <>
                <Text style={{ fontWeight: "500", color: "#1f2937" }}>{contact.name}</Text>
                <Text style={{ color: "#6b7280", marginBottom: 4 }}>{contact.relation}</Text>
                <Text style={{ color: "#dc2626" }}>{contact.phone}</Text>
              </>
            )}
          </View>
        ))}
      </View>

      {/* Save / Cancel Buttons */}
      {editMode && (
        <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 12, marginBottom: 40 }}>
          <TouchableOpacity
            onPress={handleCancel}
            style={{ paddingHorizontal: 16, paddingVertical: 10, backgroundColor: "#e5e7eb", borderRadius: 8 }}
          >
            <Text>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSave}
            style={{ paddingHorizontal: 16, paddingVertical: 10, backgroundColor: "#dc2626", borderRadius: 8 }}
          >
            <Text style={{ color: "#fff" }}>Save</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}
