import { View, Button, TextInput, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { NavigationProp, useRoute } from '@react-navigation/native';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../FirebaseConfig';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

interface RouteParams {
  userID: string;
}


const Height = ({navigation}: RouterProps) => {
    const route = useRoute();

    const [height, setHeight] = useState('');
    const {userID} = route.params as RouteParams;

    const handleData =async (height) => {
        try {
          console.log("works");
          
            const usersCollection = collection(FIRESTORE_DB, 'users');
            const q = query(usersCollection, where("userID", '==',userID));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (docSnapshot) => {
                const userDocRef = doc(FIRESTORE_DB, 'users', docSnapshot.id);
                const newData = { height: Number(height) }; 
                await updateDoc(userDocRef, newData);
              });        
              navigation.navigate('activityLevel');
        }catch (error:any) {
        console.log(error);
        alert('Adding data has failed: ' + error.message);
        }
    }
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TextInput 
                keyboardType='numeric'
                value={height}
                style={styles.input} 
                placeholder='Height (kg)' 
                autoCapitalize='none' 
                onChangeText={(text) => setHeight(text)}/>
        <Button onPress={() => navigation.navigate('weight')} title="Go back"/>
        <Button onPress={() => handleData(height)} title="Next"/>
    </View>
  )
}

export default Height

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