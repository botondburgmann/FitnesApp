import { View, TextInput, Pressable, Text, ImageBackground } from 'react-native'
import React, { useContext, useState } from 'react'
import SelectMenu from '../../components/SelectMenu';
import UserContext from '../../contexts/UserContext';
import { RouterProps, SelectItem } from '../../types and interfaces/types';
import { FontAwesome5 } from '@expo/vector-icons';
import { backgroundImage, globalStyles } from '../../assets/styles';
import { updateDoc } from 'firebase/firestore';
import { setUpStyles } from './styles';
import { getUserDocumentRef } from '../../functions/firebaseFunctions';
import { validateWeight, convertLbsToKg } from '../../functions/globalFunctions';



const Weight = ({navigation}: RouterProps) => {
  const userID = useContext(UserContext);
  const [weight, setWeight] = useState<string>("");
  const [selectedSystem, setSelectedSystem] = useState<SelectItem>({label: 'Metric (kg)', value: 'kg'});
  const [systems] = useState<SelectItem[]>([
    {label: 'Metric (kg)', value: 'kg'},
    {label: 'Imperial (lbs)', value: 'lbs'}
  ]);

  async function setWeightInFirebase(userID: string, weight: number, selectedSystem: SelectItem): Promise<void>{
    try {
      validateWeight(weight);
      const userDocRef = await getUserDocumentRef(userID);
      if (userDocRef === undefined)
        throw new Error("User doesn't exist in database");
      if (selectedSystem.value === "lbs"){
        const newData = {"weight": convertLbsToKg(weight)};
        updateDoc(userDocRef, newData);
      }
      else{
        const newData = {"weight": weight};
        updateDoc(userDocRef, newData);
      }      
      navigation.navigate("Height");

    } catch (error: any) {
      alert(`Error: Couldn't set your weight: ${error.message}`)
    }
  }




  return (
    <ImageBackground source={backgroundImage} style={globalStyles.image}>
      <View style={setUpStyles.container}>
        <Text style={setUpStyles.label}>Please, select your weight</Text>
        <View style={setUpStyles.icon}>
          <FontAwesome5 name="weight" size={60} color="#FFF"/>
        </View>
        <View style={setUpStyles.inputGroup}>
          <TextInput
            keyboardType='numeric'
            value={weight}
            style={globalStyles.input}
            placeholder="Weight"
            autoCapitalize='none'
            onChangeText={(text) => setWeight(text)}
          />
          <View style={setUpStyles.selectMenuContainer}>
            <SelectMenu data={systems} setSelectedValue={setSelectedSystem} title={selectedSystem.label} />
          </View>
          </View>
        <View style={setUpStyles.buttonGroup}>
          <Pressable style={setUpStyles.button} onPress={() => navigation.navigate("Birthday")}>
            <Text style={globalStyles.buttonText}>Go back</Text>
          </Pressable>
          <Pressable style={setUpStyles.button} onPress={() => userID && setWeightInFirebase(userID, parseFloat(weight), selectedSystem)}>
            <Text style={globalStyles.buttonText}>Next</Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  )
}

export default Weight
