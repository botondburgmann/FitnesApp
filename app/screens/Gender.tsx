import React, { useState } from "react";
import {  View, Button } from "react-native";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import { NavigationProp } from '@react-navigation/native';
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { FIRESTORE_DB } from "../../FirebaseConfig";
import { useRoute } from '@react-navigation/native';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

interface RouteParams {
    userID: string;
  }
  


const Gender = ( {navigation}: RouterProps) => {
    const route = useRoute();
    const [gender, setGender] = useState("");
    const {userID} = route.params as RouteParams;

    const handleData =async (gender) => {
        try {
            // Set the gender field's value of the current's user's document      
            const usersCollection = collection(FIRESTORE_DB, 'users');
            const q = query(usersCollection, where("userID", '==',userID));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (docSnapshot) => {
                const userDocRef = doc(FIRESTORE_DB, 'users', docSnapshot.id);
                const newData = { gender: gender }; 
                await updateDoc(userDocRef, newData);
            });  

            // Navigate to the next page (Age)        
            navigation.navigate('age');
        }
        catch (error:any) {
            alert('Adding data has failed: ' + error.message);
        }
    }

    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <RadioButtonGroup
                containerStyle={{ marginBottom: 10 }}
                selected={gender}
                onSelected={(value) => setGender(value)}
                radioBackground="green">

                <RadioButtonItem value="male" label="Male" />
                <RadioButtonItem value="female" label="Female"/>
            </RadioButtonGroup>
            
        <Button onPress={() =>handleData(gender) } title="Next"/>
    </View>
  )
}

export default Gender