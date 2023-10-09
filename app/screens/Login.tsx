import { View, StyleSheet, TextInput, ActivityIndicator, Button, KeyboardAvoidingView, Pressable, Text } from 'react-native'
import React, { useState } from 'react'
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { NavigationProp } from '@react-navigation/native';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const Login = ({navigation}: RouterProps) => {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const auth = FIREBASE_AUTH;

  const signIn =async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email,password);
    } catch (error: any) {
      alert('Sign In failed: ' + error.message);
    } finally{
      setLoading(false);
    }
  }


  return (
    <View style={styles.container}>
      <View>
      <Text  style={[styles.logo]}>App Name</Text>
        <TextInput 
          value={email}
          style={styles.input} 
          placeholder='Email' 
          autoCapitalize='none' 
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput 
          value={password}
          secureTextEntry={true}
          style={styles.input} 
          placeholder='Password' 
          autoCapitalize='none' 
          onChangeText={(text) => setPassword(text)}
        />

        { loading ? 
          <ActivityIndicator size="large" color="#0000ff"/>
        : 
          <>
            <Pressable style={styles.button} onPress={signIn}>
              <Text  style={styles.text}>Login</Text>
            </Pressable>
            <Text style={[styles.text, {marginTop: 30}]}>Not registered yet</Text>
            <Pressable style={styles.button} onPress={() => navigation.navigate('Register')}>
              <Text style={styles.text}>Create new account here</Text>
            </Pressable>
            <Text style={styles.copyright}>Copyright 2023 Botond Burgmann</Text>

          </> 
        }
      </View>
    </View>
  );
};

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ff0000'
  },
  input: {
    marginHorizontal: 10,
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff'
  },
  text:{
    alignSelf: 'center',
    fontSize: 18,
    color: "#fff",
    textTransform: 'uppercase',
    paddingVertical: 10,
  },
  button:{
    marginHorizontal: 10,
    marginVertical: 20,
    backgroundColor: "#000",
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