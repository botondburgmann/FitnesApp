import { View, Text, StyleSheet, TextInput, ActivityIndicator, Button, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { NavigationProp } from '@react-navigation/native';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const Registration = ({navigation}: RouterProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;


  const signUp =async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(auth, email,password);
      console.log(response);
      alert('Check your emails!');
    }catch (error:any) {
      console.log(error);
      alert('Registration failed: ' + error.message);
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
          <Button title="Create new account" onPress={signUp}/>
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