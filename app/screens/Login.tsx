import { View, StyleSheet, TextInput, ActivityIndicator, Pressable, Text, ImageBackground } from 'react-native'
import React, { useState } from 'react'
import { backgroundImage, globalStyles } from '../assets/styles';
import { signIn } from '../functions/firebaseFunctions';
import { RouterProps } from '../types and interfaces/types';



const Login = ({navigation}: RouterProps) => {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [loading, setLoading] = useState(false);




  return (
    <ImageBackground source={backgroundImage} style={globalStyles.image}>
      <View style={[globalStyles.container, {flex: 1}]}>
        <View style={{ backgroundColor: "rgba(255,0,0,0.7)", marginBottom: 20, paddingVertical: 20 }}>
          <Text  style={[globalStyles.logo]}>Gym Gamer</Text>
        </View>
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
            <Pressable style={globalStyles.button} onPress={() => signIn(setLoading, email, password)}>
              <Text  style={globalStyles.buttonText}>Login</Text>
            </Pressable>
            <Text style={[globalStyles.text, {marginTop: 30, fontSize: 18, textTransform: "uppercase"}]}>Not registered yet</Text>
            <Pressable style={globalStyles.button} onPress={() => navigation.navigate('Register')}>
              <Text style={globalStyles.buttonText}>Create new account here</Text>
            </Pressable>
            <Text style={styles.copyright}>Copyright 2023 Botond Burgmann</Text>
          </>
        }
      </View>
    </ImageBackground>
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
 
  copyright: {
    alignSelf: 'center',
    color: "#fff",
  }
});