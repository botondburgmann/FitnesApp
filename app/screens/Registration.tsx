import { View, TextInput, ActivityIndicator, Pressable, Text, ImageBackground } from "react-native"
import React, { useState } from "react"
import { signUp } from "../functions/firebaseFunctions";
import { RouterProps } from "../types and interfaces/types";
import { backgroundImage, globalStyles } from "../assets/styles";



const Registration = ({navigation}: RouterProps) => {
    const [name, setName] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [confirmPassword, setConfirmPassword] = useState<string>();
    const [loading, setLoading] = useState(false);
    
    function handleRegisterButtonPress(name:string | undefined, setLoading: Function, email: string | undefined, password: string | undefined) {
        if (name === undefined || email === undefined || password === undefined || confirmPassword === undefined)
            alert("Error: Please fill out all the fields")
        else if (password !== confirmPassword){
            alert("Error: Passwords do not match");
        }
        else{
            signUp(name, setLoading, email, password )
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
                    <Pressable style={globalStyles.button} onPress={() => handleRegisterButtonPress(name, setLoading, email, password) }>
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
