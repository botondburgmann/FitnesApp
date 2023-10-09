import { View, StyleSheet, TextInput, ActivityIndicator, Pressable, Text } from 'react-native'
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
            <View>
                <Text  style={[styles.logo]}>App Name</Text>
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
                        <Pressable style={styles.button} onPress={() => signUp(name, setLoading, auth, email, password )}>
                            <Text style={styles.text}>Create new account</Text>
                        </Pressable>
                        <Text style={[styles.text, {marginTop: 30}]}>Not registered yet</Text>
                        <Pressable style={styles.button} onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.text}>Login here</Text>
                        </Pressable>
                    </> 
                }
            </View>
        </View>
    );
};

export default Registration

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
    }
  });