import { View, TextInput, ActivityIndicator, Pressable, Text, ImageBackground } from "react-native"
import React, { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, DocumentReference, DocumentData, getDocs, updateDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../FirebaseConfig";
import { RouterProps } from "../../types and interfaces/types";
import { backgroundImage, globalStyles } from "../../assets/styles";
import { initializeExercisesForUser } from "../../functions/firebaseFunctions";



const Registration = ({navigation}: RouterProps) => {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [loading, setLoading] = useState(false);
    
    async function signUp(): Promise<void> {
        try {
            validateData(name, email, password, confirmPassword);
            setLoading(true);
            const userDocRef = await registerUserInFirebase();
            initializeExercisesForUser(userDocRef);
            alert("Registered successfully!");
        }   
        catch (error:any) {
            alert(`Error: Registration failed: ${error.message}`);
        }   
        finally{
            setLoading(false);
        }
    }

    function validateData(name:string, email: string, password: string, confirmPassword: string): void {
        if (name === "" || email === "" || password === "" || confirmPassword === "")
            throw new Error("Please fill out all the fields")
        if (password !== confirmPassword)
            throw new Error("Passwords do not match");  
    }

    async function registerUserInFirebase(): Promise<DocumentReference<DocumentData, DocumentData>> {
        const auth = FIREBASE_AUTH;
            const response = await createUserWithEmailAndPassword(auth, email,password);
            const userData = {
                userID: response.user.uid, 
                name: name, 
                gender: "", 
                dateOfBirth: "", 
                weight: 0, 
                height: 0, 
                activityLevel: "", 
                set: false, 
                level: 1, 
                experience: 0,
                weeklyExperience: 0
            };
            const usersCollectionRef = collection(FIRESTORE_DB, "Users");
            const userDocRef = await addDoc(usersCollectionRef, userData);
            initializeAchievements(response.user.uid);
            return userDocRef;
    }
    async function initializeAchievements (userID: string | null): Promise<void> {
        try {
            const achievementsCollectionRef = collection(FIRESTORE_DB, "Achievements");
            const achievementsSnapshot = await getDocs(achievementsCollectionRef);
            let newOwner;
            for (const achievementDoc of achievementsSnapshot.docs) {
                switch (achievementDoc.data().name) {
                    case "Consistency Streak":
                        newOwner = {
                            color: "#808080",
                            description: "Workout for 10 days to unlock this achievement",
                            level: 0,
                            status: "locked",
                            userID: userID,
                            visibility: 0.5
                        }
                        break;
                    case "Endurance Master":
                        newOwner = {
                            color: "#808080",
                            description: "Do 20 repetitions for an exercise to unlock this achievement",
                            level: 0,
                            status: "locked",
                            userID: userID,
                            visibility: 0.5
                        }
                        break;
                    case "Dedicated Athlete":
                        newOwner = {
                            color: "#808080",
                            description: "Workout for a month consistently to unlock this achievement",
                            level: 0,
                            status: "locked",
                            userID: userID,
                            visibility: 0.5
                        }
                        break;
                    case "Climbing The Ranks":
                        newOwner = {
                            color: "#808080",
                            description: "Get in the top 10 users to unlock this achievement",
                            level: 0,
                            status: "locked",
                            userID: userID,
                            visibility: 0.5
                        }
                        break;
                    case "Strength Builder":
                        newOwner = {
                            color: "#808080",
                            description: "Lift 60 kg on an exercise to unlock this achievement",
                            level: 0,
                            status: "locked",
                            userID: userID,
                            visibility: 0.5
                        }
                        break
                    default:
                        break;
                    }
                    const updatedOwners = [...achievementDoc.data().owners, newOwner];
                    
                    const updatedData = {
                        owners: updatedOwners
                    }
                    await updateDoc(achievementDoc.ref, updatedData);
                }
        } catch (error: any) {
            alert(`Couldn't initialize achievements: ${error}`)
        }
    };

    return (
        <ImageBackground source={backgroundImage} style={globalStyles.image}>
            <View style={globalStyles.container}>
                <View style={{ backgroundColor: "rgba(255,0,0,0.7)", marginBottom: 20, paddingVertical: 20 }}>
                    <Text  style={[globalStyles.logo]}>Gym Gamer</Text>
                </View>                
                <TextInput
                    value={name}
                    style={globalStyles.input}
                    placeholder="Name"
                    autoCapitalize="none"
                    onChangeText={(text) => setName(text)}
                />
                <TextInput
                    value={email}
                    style={globalStyles.input}
                    placeholder="Email"
                    autoCapitalize="none"
                    onChangeText={(text) => setEmail(text)}
                />
                <TextInput
                    value={password}
                    secureTextEntry={true}
                    style={globalStyles.input}
                    placeholder="Password"
                    autoCapitalize="none"
                    onChangeText={(text) => setPassword(text)}
                />
                <TextInput
                    value={confirmPassword}
                    secureTextEntry={true}
                    style={globalStyles.input}
                    placeholder="Confirm password"
                    autoCapitalize="none"
                    onChangeText={(text) => setConfirmPassword(text)}
                />
                { loading ?
                    <ActivityIndicator size="large" color="#0000ff"/>
                :
                <>
                    <Pressable style={globalStyles.button} onPress={signUp}>
                        <Text style={globalStyles.buttonText}>Create new account</Text>
                    </Pressable>
                    <Text style={[globalStyles.text, {marginTop: 30, fontSize: 18, textTransform: "uppercase"}]}>Already have an account</Text>
                    <Pressable style={globalStyles.button} onPress={() => navigation.navigate("Login")}>
                        <Text style={globalStyles.buttonText}>Login here</Text>
                    </Pressable>
                </>
                }
            </View>
        </ImageBackground>
    );
};

export default Registration

