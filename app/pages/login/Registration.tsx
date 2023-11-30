import { View, TextInput, ActivityIndicator, Pressable, Text, ImageBackground } from "react-native"
import React, { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, DocumentReference, DocumentData } from "firebase/firestore";
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
                age: 0, 
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
            return userDocRef;
    }

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

