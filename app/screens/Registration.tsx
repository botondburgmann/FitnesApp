import { View, Text, StyleSheet, TextInput, ActivityIndicator, Button, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { NavigationProp } from '@react-navigation/native';
import { addDoc, collection } from 'firebase/firestore';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const Registration = ({navigation}: RouterProps) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;


    const signUp =async (name) => {
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email,password);
            await addDoc(collection(FIRESTORE_DB, 'users'), {userID: response.user.uid, name: name, gender: "", age: 0, weight: 0, height: 0, activityLevel: "", set: false});
            

        alert('Check your emails!');
        }catch (error:any) {
        alert('Registration failed: ' + error.message);
        } finally{
        setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
        <KeyboardAvoidingView behavior='padding'>
            <TextInput 
                value={name}
                style={styles.input} 
                placeholder='Name' 
                autoCapitalize='none' 
                onChangeText={(text) => setName(text)}/>
            <TextInput 
                value={email}
                style={styles.input} 
                placeholder='Email' 
                autoCapitalize='none' 
                onChangeText={(text) => setEmail(text)}/>
            <TextInput 
                value={password}
                secureTextEntry={true}
                style={styles.input} 
                placeholder='Password' 
                autoCapitalize='none' 
                onChangeText={(text) => setPassword(text)}/>

            { loading ? <ActivityIndicator size="large" color="#0000ff"/>
            : <>
            <Button title="Create new account" onPress={() => signUp(name)}/>
            <Button onPress={() => navigation.navigate('Login')} title="Login here"/>
            </> }
            </KeyboardAvoidingView>
        </View>
    );
};

export default Registration

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: 'center'
  },
  input: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff'
  }
});