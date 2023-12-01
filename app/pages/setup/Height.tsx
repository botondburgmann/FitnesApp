import { View, TextInput, Pressable, Text, ImageBackground } from 'react-native'
import React, { useContext, useState } from 'react'
import SelectMenu from '../../components/SelectMenu';
import UserContext from '../../contexts/UserContext';
import { RouterProps, SelectItem } from '../../types and interfaces/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { backgroundImage, globalStyles } from '../../assets/styles';
import { updateDoc } from 'firebase/firestore';
import { setUpStyles } from './styles';
import { getUserDocumentRef } from '../../functions/firebaseFunctions';
import { validateHeight, convertFtToCm } from '../../functions/globalFunctions';


const Height = ({navigation}: RouterProps) => {
  const userID = useContext(UserContext);

  const [height, setHeight] = useState<string>("");
  const [selectedSystem, setSelectedSystem] = useState<SelectItem>({label: 'Metric (cm)', value: 'm'});
  const [systems] = useState<SelectItem[]>([
    {label: 'Metric (cm)', value: 'm'},
    {label: 'Imperial (ft)', value: 'ft'}
  ]);

  async function setHeightInFirebase(): Promise<void>{
    try {
      if (userID === null)
        throw new Error("User is not authorized");
      validateHeight(parseFloat(height));
      const userDocRef = await getUserDocumentRef(userID);
      if (userDocRef === undefined)
        throw new Error("User doesn't exist in database");
      if (selectedSystem.value === "ft"){
        const newData = {"weight": convertFtToCm(parseFloat(height))};
        await updateDoc(userDocRef, newData);
      }
      else{
        const newData = {"height": parseFloat(height)};
        await updateDoc(userDocRef, newData);
      }      
      navigation.navigate("Activity level");
    } 
    catch (error: any) {
      alert(`Error: Couldn't set your weight: ${error}`)
    }
  }

  

  return (
    <ImageBackground source={backgroundImage} style={globalStyles.image}>
      <View style={setUpStyles.container}>
      <Text style={setUpStyles.label}>Please, select your height</Text>
        <View style={setUpStyles.icon}>
          <MaterialCommunityIcons name="human-male-height" size={60} color="#FFF" />
        </View>
        <View style={setUpStyles.inputGroup}>
          <TextInput
            keyboardType='numeric'
            value={height}
            style={globalStyles.input}
            placeholder="Height"
            autoCapitalize='none'
            onChangeText={(text: string) => setHeight(text)}
          />
          <View style={setUpStyles.selectMenuContainer}>
            <SelectMenu data={systems} setSelectedValue={setSelectedSystem} title={selectedSystem.label} />
          </View>
        </View>
        <View style={setUpStyles.buttonGroup}>
          <Pressable style={setUpStyles.button} onPress={() => navigation.navigate('Weight')}>
            <Text style={globalStyles.buttonText}>Go back</Text>
          </Pressable>
          <Pressable style={setUpStyles.button} onPress={setHeightInFirebase}>
            <Text style={globalStyles.buttonText}>Next</Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  )
}

export default Height