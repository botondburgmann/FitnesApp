import { View, TextInput, ActivityIndicator, Pressable, Text, ImageBackground } from 'react-native'
import React, { useState } from 'react'
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { signUp } from '../functions/databaseQueries';
import { RouterProps } from '../types and interfaces/interfaces';
import { backgroundImage, globalStyles } from '../assets/styles';
import { Auth } from 'firebase/auth';



const Registration = ({navigation}: RouterProps) => {
    const [name, setName] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;
    
    function handleRegisterButtonPress(name:string, setLoading: Function, auth: Auth, email: string, password: string) {
        if (name === undefined || email === undefined || password === undefined)
            alert("Error: Please fill out all the fields")
        else{
            signUp(name, setLoading, auth, email, password )
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
                    placeholder='Name'
                    autoCapitalize='none'
                    onChangeText={(text) => setName(text)}
                />
                <TextInput
                    value={email}
                    style={globalStyles.input}
                    placeholder='Email'
                    autoCapitalize='none'
                    onChangeText={(text) => setEmail(text)}
                />
                <TextInput
                    value={password}
                    secureTextEntry={true}
                    style={globalStyles.input}
                    placeholder='Password'
                    autoCapitalize='none'
                    onChangeText={(text) => setPassword(text)}
                />
                { loading ?
                    <ActivityIndicator size="large" color="#0000ff"/>
                :
                    <>
                        <Pressable style={globalStyles.button} onPress={() => handleRegisterButtonPress(name, setLoading, auth, email, password) }>
                            <Text style={globalStyles.buttonText}>Create new account</Text>
                        </Pressable>
                        <Text style={[globalStyles.text, {marginTop: 30, fontSize: 18, textTransform: "uppercase"}]}>Not registered yet</Text>
                        <Pressable style={globalStyles.button} onPress={() => navigation.navigate('Login')}>
                            <Text style={globalStyles.buttonText}>Login here</Text>
                        </Pressable>
                    </>
                }
            </View>
        </ImageBackground>
    );
};

export default Registration
