import { View, StyleSheet, TextInput, ActivityIndicator, Pressable, Text } from 'react-native'
import React, { useState } from 'react'
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { signUp } from '../functions/databaseQueries';
import { RouterProps } from '../types and interfaces/interfaces';
import { globalStyles } from '../assets/styles';



const Registration = ({navigation}: RouterProps) => {
    const [name, setName] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;
    

    return (
        <View style={globalStyles.container}>
            <Text  style={[styles.logo]}>App Name</Text>
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
                    <Pressable style={globalStyles.button} onPress={() => signUp(name, setLoading, auth, email, password )}>
                        <Text style={globalStyles.buttonText}>Create new account</Text>
                    </Pressable>
                    <Text style={[styles.text, {marginTop: 30}]}>Not registered yet</Text>
                    <Pressable style={globalStyles.button} onPress={() => navigation.navigate('Login')}>
                        <Text style={globalStyles.buttonText}>Login here</Text>
                    </Pressable>
                </> 
            }
        </View>
    );
};

export default Registration

const styles = StyleSheet.create({
    text:{
        alignSelf: 'center',
        fontSize: 18,
        color: "#fff",
        textTransform: 'uppercase',
        paddingVertical: 10,
    },
    logo: {
        alignSelf: 'center',
        fontSize: 50,
        color: "#fff",
        textTransform: 'uppercase',
        marginBottom: 50
    }
  });