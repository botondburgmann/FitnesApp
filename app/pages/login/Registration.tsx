import { View, TextInput, ActivityIndicator, Pressable, Text, ImageBackground } from "react-native"
import React, { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, DocumentReference, DocumentData, getDocs, updateDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../FirebaseConfig";
import { RouterProps } from "../../types and interfaces/types";
import { backgroundImage, globalStyles } from "../../assets/styles";



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

            if (userDocRef === undefined) return;

            initializeExercisesForUser(userDocRef);
            
            alert("Registered successfully!");
        } catch (error:any) {
            alert(`Error: Registration failed: ${error.message}`);
        } finally{
            setLoading(false);
        }
    }

    function validateData(name:string, email: string, password: string, confirmPassword: string): void {
        try {
            if (name === "" || email === "" || password === "" || confirmPassword === "") 
                throw new Error("Please fill out all the fields")
            if (password !== confirmPassword) 
                throw new Error("Passwords do not match");
        } catch (error: any) {
            alert(`Error: Invalid data: ${error.message}`)
        }  
    }

    async function registerUserInFirebase(): Promise<DocumentReference<DocumentData, DocumentData> | undefined> {
        try {
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
        }   catch (error: any) {
            alert(`Error: Couldn't register user: ${error.message}`);
        }
    }

    async function initializeExercisesForUser(userDocRef: DocumentReference<DocumentData, DocumentData>): Promise<void> {
        try {
            const exercisesCollectionRef = collection(FIRESTORE_DB, "Exercises");
            const exercisesQuerySnapshot = await getDocs(exercisesCollectionRef);
            exercisesQuerySnapshot.forEach((exerciseDoc) => {
                const exerciseData = exerciseDoc.data();
                const userSubcollectionRef = collection(userDocRef, "exercises");
                addDoc(userSubcollectionRef, exerciseData);
            })
        } catch (error: any) {
            alert(`Error: couldn't initialize exercises for user: ${error.any}`);
        }
    }

    async function initializeAchievements (userID: string | null): Promise<void> {
        try {
            const achievementsCollectionRef = collection(FIRESTORE_DB, "Achievements");
            const achievementsSnapshot = await getDocs(achievementsCollectionRef);

            for (const achievementDoc of achievementsSnapshot.docs){
                const statuses = achievementDoc.data().statuses
                const updatedUserIds = [...statuses[0].userIDs, userID];
                const updatedStatuses:{name: string, userIDs: string[]}[] = statuses.map((item:{name: string, userIDs: string[]}, index: number) =>
                    index === 0 ? 
                        {name: item.name, userIDs: updatedUserIds}     
                    : item
                );  
                const updatedAchievementDoc = {
                    statuses: updatedStatuses
                };
                updateDoc(achievementDoc.ref, updatedAchievementDoc);
            }

            /*
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
                    updateDoc(achievementDoc.ref, updatedData);
                } */
        }   catch (error: any) {
            alert(`Couldn't initialize achievements: ${error}`)
        }
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

