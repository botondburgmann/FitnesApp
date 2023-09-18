import { View, Text, StyleSheet, TextInput, ActivityIndicator, Button, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { NavigationProp } from '@react-navigation/native';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const Login = ({navigation}: RouterProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const signIn =async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email,password);
        (response);
    }catch (error: any) {
        (error);
      alert('Sign In failed: ' + error.message);
    } finally{
      setLoading(false);
    }
  }


  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior='padding'>
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
          <Button title="Login" onPress={signIn}/>
          <Button onPress={() => navigation.navigate('Register')} title="Register here"/>
          </> }
        </KeyboardAvoidingView>
    </View>
  );
};

export default Login

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