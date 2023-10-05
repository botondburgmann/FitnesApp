import { View, StyleSheet, TextInput, ActivityIndicator, Button, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { NavigationProp } from '@react-navigation/native';
import { signUp } from '../functions/databaseQueries';


interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const Registration = ({navigation}: RouterProps) => {
   
    const [name, setName] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const auth = FIREBASE_AUTH;
    

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

                { loading ? 
                    <ActivityIndicator size="large" color="#0000ff"/>
                : 
                    <>
                        <Button title="Create new account" onPress={() => signUp(name, setLoading, auth, email, password )}/>
                        <Button onPress={() => navigation.navigate('Login')} title="Login here"/>
                    </> 
                }
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