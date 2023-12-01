import { View, Pressable, Text, ImageBackground } from 'react-native'
import React, { useContext, useState } from 'react'
import SelectMenu from '../../components/SelectMenu';
import UserContext from '../../contexts/UserContext';
import { ActivityLevels, RouterProps, SelectItem } from '../../types and interfaces/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { backgroundImage, globalStyles } from '../../assets/styles';
import { setUpStyles } from './styles';
import { updateDoc } from 'firebase/firestore';
import { getUserDocumentRef } from '../../functions/firebaseFunctions';




const ActivityLevel = ({navigation}: RouterProps) => {
  const userID = useContext(UserContext);

  const [selectedActivityLevel, setSelectedActivityLevel] = useState<ActivityLevels>({label: 'Beginner', value: 'beginner'});
  const [activityLevels] = useState([
    {label: 'Beginner', value: 'beginner'},
    {label: 'Intermediate', value: 'intermediate'},
    {label: 'Advanced', value: 'advanced'}
  ]);

  async function setActivityLevelInFirebase(): Promise<void> {
    try {
      if (userID === null)
        throw new Error("User is not authorized");
      const userDocRef = await getUserDocumentRef(userID);
      if (userDocRef === undefined)
        throw new Error("User doesn't exist in database");
      const newData = {
        "activityLevel": selectedActivityLevel.value,
        "set": true
      };
      await updateDoc(userDocRef, newData);
      navigation.navigate("WorkoutsLayout");
    } 
    catch (error: any) {
      alert(`Error: Couldn't set your activity level: ${error}`)
    }
  }
  return (
    <ImageBackground source={backgroundImage} style={globalStyles.image}>
      <View style={setUpStyles.container}>
        <Text style={setUpStyles.label}>Please, select your activity level</Text>
        <View style={setUpStyles.icon}>
          <MaterialCommunityIcons name="weight-lifter" size={60} color="#FFF" />
        </View>
        <View style={setUpStyles.selectMenuContainer}>
          <SelectMenu data={activityLevels} setSelectedValue={setSelectedActivityLevel} title={selectedActivityLevel.label} />
        </View>
        <View style={setUpStyles.buttonGroup}>
          <Pressable style={setUpStyles.button} onPress={() => navigation.navigate('Height')}>
            <Text style={globalStyles.buttonText}>Go back</Text>
          </Pressable>
          <Pressable style={setUpStyles.button} onPress={setActivityLevelInFirebase}>
            <Text style={globalStyles.buttonText}>Finish</Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  )
}

export default ActivityLevel

