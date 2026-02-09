import React, { useState, useEffect, useCallback } from "react";

const dotsArray = ["", ".", "..", "..."];

export const useAppLogic = () => {
    const [appPhase, setAppPhase] = useState("initial-loading");
    const [dotIndex, setDotIndex] = useState(0);
    const [activePage, setActivePage] = useState("home");
    const [showEmergencyModal, setShowEmergencyModal] = useState(false);
    const [vitals, setVitals] = useState({
        heartRate: 75,
        oxygenLevel: 98,
        temperature: 36.8,
    });
    const [alerts, setAlerts] = useState([]);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [editMode, setEditMode] = useState(false);

    const [userInfo, setUserInfo] = useState({
        firstName: "Weal",
        lastName: "Baklouti",
        age: "25",
        gender: "Male",
        bloodType: "o+",
        email: "oussematurki0@email.com",
        phone: "+216 29 843 949",
        language: "English",
        notifications: true,
        darkMode: false,
        idNumber: "99561324",
        height: "175",
        weight: "68",

        passportNumber: "H608952",
        homeLocation: "Rue du Lac Victoria, Les Berges du Lac 2, Tunis, Tunisia",
    });

    const [medicalInfo, setMedicalInfo] = useState({
        conditions: ["Type 2 Diabetes", "Hypertension"],
        allergies: ["Penicillin", "Peanuts"],
        medications: [
            { name: "Metformin", dosage: "500mg - 2x daily" },
            { name: "Lisinopril", dosage: "10mg - 1x daily" },
        ],
    });

    const [emergencyContacts, setEmergencyContacts] = useState([
        {
            id: 1,
            name: "Dr. Slimen Labyad",
            relation: "Primary Doctor",
            phone: "+216 99 521 963",
        },
        {
            id: 2,
            name: "Lina Ellech",
            relation: "Daughter",
            phone: "+216 26 597 224",
        },
    ]);

    const [pairedDevices, setPairedDevices] = useState([
        {
            id: 1,
            name: "Health Monitor",
            status: "Connected",
            lastSync: "5 minutes ago",
            location: { lat: 36.8065, lng: 10.1815 },
        },
    ]);

    const [currentLocation, setCurrentLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setDotIndex((prev) => (prev + 1) % dotsArray.length);
        }, 500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (appPhase === "initial-loading") {
            const timeout = setTimeout(() => setAppPhase("login"), 10000);
            return () => clearTimeout(timeout);
        }
        if (appPhase === "signing-in") {
            const timeout = setTimeout(() => setAppPhase("home"), 5000);
            return () => clearTimeout(timeout);
        }
    }, [appPhase]);

    useEffect(() => {
        setAlerts([
            {
                id: 1,
                message: "Heart rate is normal",
                time: "14:30",
                type: "info",
            },
            {
                id: 2,
                message: "Oxygen levels stable",
                time: "14:25",
                type: "success",
            },
        ]);
    }, []);

    const refreshHeartRate = useCallback(() => {
        const newHeartRate = Math.floor(Math.random() * (85 - 65) + 65);
        setVitals((prev) => ({ ...prev, heartRate: newHeartRate }));
    }, []);

    const refreshOxygenAndTemp = useCallback(() => {
        const newOxygenLevel = Math.floor(Math.random() * (100 - 95) + 95);
        const newTemperature = (Math.random() * (37.2 - 36.5) + 36.5).toFixed(1);
        setVitals((prev) => ({
            ...prev,
            oxygenLevel: newOxygenLevel,
            temperature: newTemperature,
        }));
    }, []);

    useEffect(() => {
        if (activePage === "home") {
            const interval1 = setInterval(refreshHeartRate, 2000);
            const interval2 = setInterval(refreshOxygenAndTemp, 10000);
            return () => {
                clearInterval(interval1);
                clearInterval(interval2);
            };
        }
    }, [activePage, refreshHeartRate, refreshOxygenAndTemp]);

    const handleSOS = () => {
        setShowEmergencyModal(true);
    };

    return {
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
        editMode,
        setEditMode,
        userInfo,
        setUserInfo,
        medicalInfo,
        emergencyContacts,
        pairedDevices,
        currentLocation,
        setCurrentLocation,
        locationError,
        handleSOS,
    };
};
