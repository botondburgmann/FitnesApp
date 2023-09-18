import React, { useState } from "react";
import { Text, View, Button } from "react-native";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import { NavigationProp } from '@react-navigation/native';
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { FIRESTORE_DB } from "../../FirebaseConfig";
import { useRoute } from '@react-navigation/native';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

interface RouteParams {
    userID: string;
  }
  


const Gender = ( {navigation}: RouterProps) => {
    const route = useRoute(); // Use the useRoute hook to get the route object

    const [loading, setLoading] = useState(false);

   const {userID} = route.params as RouteParams;
   console.log("Gender "+ userID);

    const [gender, setGender] = useState("");
    const handleData =async (gender) => {
        setLoading(true);
        try {
            const usersCollection = collection(FIRESTORE_DB, 'users');
            
            const q = query(usersCollection, where("userID", '==',userID));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (docSnapshot) => {
                const userDocRef = doc(FIRESTORE_DB, 'users', docSnapshot.id);
                const newData = { gender: gender }; 
                await updateDoc(userDocRef, newData);
              });        
              navigation.navigate('age');
        }catch (error:any) {
        alert('Adding data has failed: ' + error.message);
        } finally{
        setLoading(false);
        }
    }

    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <RadioButtonGroup
                containerStyle={{ marginBottom: 10 }}
                selected={gender}
                onSelected={(value) => setGender(value)}
                radioBackground="green"
            >
                <RadioButtonItem value="male" label="Male" />
                <RadioButtonItem value="female" label="Female"/>
      </RadioButtonGroup>
        <Button onPress={() =>handleData(gender) } title="Next"/>
    </View>
  )
}

export default Gender