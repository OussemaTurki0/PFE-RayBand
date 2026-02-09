import React from "react";
import { SafeAreaView, View, StatusBar } from "react-native";
import { useAppLogic } from "../hooks/useAppLogic";
import LoginScreen from "../components/auth/LoginScreen";
import SignupScreen from "../components/auth/SignupScreen";
import LoadingScreen from "../components/main/LoadingScreen";
import HomePage from "../components/main/HomePage";
import ProfilePage from "../components/main/ProfilePage";
import BraceletHolderPage from "../components/main/BraceletHolderPage";
import GPSPage from "../components/main/GPSPage";
import QRPage from "../components/main/QRPage";
import AIPage from "../components/main/AIPage";
import BottomNav from "../components/nav/BottomNav";
import EmergencyModal from "../components/modals/EmergencyModal";

export default function MainComponent() {
  const {
    appPhase,
    setAppPhase,
    dotIndex,
    dotsArray,
    activePage,
    setActivePage,
    showEmergencyModal,
    setShowEmergencyModal,
    vitals,
    alerts,
    profilePhoto,
    setProfilePhoto,
    userInfo,
    setUserInfo,
    editMode,
    setEditMode,
    medicalInfo,
    emergencyContacts,
    pairedDevices,
    currentLocation,
    setCurrentLocation,
    locationError,
    handleSOS,
  } = useAppLogic();

  if (appPhase === "initial-loading" || appPhase === "signing-in") {
    return <LoadingScreen dotIndex={dotIndex} dotsArray={dotsArray} />;
  }

  if (appPhase === "login") {
    return (
      <LoginScreen
        onLogin={() => setAppPhase("signing-in")}
        goToSignup={() => setAppPhase("signup")}
      />
    );
  }

  if (appPhase === "signup") {
    return <SignupScreen goToLogin={() => setAppPhase("login")} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <StatusBar style="dark" />
      <View style={{ flex: 1 }}>
        {activePage === "home" && (
          <HomePage
            vitals={vitals}
            alerts={alerts}
            pairedDevices={pairedDevices}
          />
        )}
        {activePage === "settings" && (
          <ProfilePage
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            profilePhoto={profilePhoto}
            setProfilePhoto={setProfilePhoto}
            editMode={editMode}
            setEditMode={setEditMode}
          />
        )}
        {activePage === "bracelet" && (
          <BraceletHolderPage
            userInfo={userInfo}
            medicalInfo={medicalInfo}
            emergencyContacts={emergencyContacts}
          />
        )}
        {activePage === "gps" && (
          <GPSPage
            pairedDevices={pairedDevices}
            currentLocation={currentLocation}
            setCurrentLocation={setCurrentLocation}
            locationError={locationError}
          />
        )}
        {activePage === "qr" && <QRPage pairedDevices={pairedDevices} />}
        {activePage === "ai" && <AIPage />}
      </View>

      <BottomNav activePage={activePage} setActivePage={setActivePage} />

      {showEmergencyModal && (
        <EmergencyModal
          setShowEmergencyModal={setShowEmergencyModal}
          handleSOS={handleSOS}
        />
      )}
    </SafeAreaView>
  );
}
