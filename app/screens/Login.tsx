import { View, StyleSheet, TextInput, ActivityIndicator, Pressable, Text } from 'react-native'
import React, { useState } from 'react'
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { RouterProps } from '../types and interfaces/interfaces';
import { globalStyles } from '../assets/styles';



const Login = ({navigation}: RouterProps) => {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  async function signIn() {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } 
    catch (error:any) {
      alert(`Error: Sign in failed: ${error.message}`);
    }
    finally {
      setLoading(false);
    } 
  }


  return (
    <View style={[globalStyles.container, {flex: 1}]}>
      <Text  style={[styles.logo]}>App Name</Text>
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
          <Pressable style={globalStyles.button} onPress={signIn}>
            <Text  style={globalStyles.buttonText}>Login</Text>
          </Pressable>
          <Text style={[styles.text, {marginTop: 30}]}>Not registered yet</Text>
          <Pressable style={globalStyles.button} onPress={() => navigation.navigate('Register')}>
            <Text style={globalStyles.buttonText}>Create new account here</Text>
          </Pressable>
          <Text style={styles.copyright}>Copyright 2023 Botond Burgmann</Text>
        </> 
      }
    </View>
  );
};

export default Login

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
  },
  copyright: {
    alignSelf: 'center',
    color: "#fff",
  }
});