import { View, StyleSheet, Pressable, Text, ImageBackground } from 'react-native'
import React, { useContext, useState } from 'react'
import { setUpProfile } from '../functions/databaseQueries';
import SelectMenu from '../components/SelectMenu';
import UserContext from '../contexts/UserContext';
import { SelectItem } from '../types and interfaces/types';
import { RouterProps } from '../types and interfaces/interfaces';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { backgroundImage, globalStyles } from '../assets/styles';
import { NavigationProp } from '@react-navigation/native';




const ActivityLevel = ({navigation}: RouterProps) => {
  const userID = useContext(UserContext);

  const [value, setValue] = useState<SelectItem>();
  const [items] = useState([
    {label: 'Beginner', value: 'beginner'},
    {label: 'Intermediate', value: 'intermediate'},
    {label: 'Advanced', value: 'advanced'}
  ]);

  function handleFinishButtonPress(field:string, value: SelectItem | undefined, userID: string, navigation:NavigationProp<any, any>, nextPage: string ) {
    if (value === undefined)
      alert("Error: Please select one of the options");
    else
      setUpProfile(field, value, userID, navigation, nextPage)
    
  }

  return (
    <ImageBackground source={backgroundImage} style={globalStyles.image}>
      <View style={[globalStyles.container, {backgroundColor: "rgba(255,0,0,0.7)", paddingVertical: 20, paddingHorizontal: 20}]}>
        <Text style={[globalStyles.label, {marginBottom: 50}]}>Please, select your activity level</Text>
        <View style={styles.icon}>
          <MaterialCommunityIcons name="weight-lifter" size={60} color="#fff" />
        </View>
        <View style={styles.selectMenuContainer}>
          <SelectMenu data={items} setSelectedValue={setValue} title={"Activity level"} />
        </View>
        <View style={styles.buttonGroup}>
          <Pressable style={[globalStyles.button, {width: 100}]} onPress={() => navigation.navigate('Height')}>
            <Text style={globalStyles.buttonText}>Go back</Text>
          </Pressable>
          <Pressable style={[globalStyles.button, {width: 100}]} onPress={() => handleFinishButtonPress('activityLevel', value, userID, navigation, 'InsideLayout')}>
            <Text style={globalStyles.buttonText}>Finish</Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  )
}

export default ActivityLevel

const styles = StyleSheet.create({
  text:{
    alignSelf: 'center',
    fontSize: 18,
    color: "#fff",
    textTransform: 'uppercase',
    fontWeight: "600",
    paddingVertical: 10,
  },
  label: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    textTransform: 'uppercase',
    marginTop: -80,
    marginBottom: 50,
    marginHorizontal: 50,
    textAlign: 'center',
    lineHeight: 40
  },
  buttonGroup: {
    marginTop: 80,
    flexDirection: 'row',
    justifyContent: 'space-evenly' 
  },
  
  selectMenuContainer: {
    backgroundColor: "#fff",
    padding: 5,
    marginHorizontal:40,
  },
  icon: {
    alignSelf: 'center',
    fontSize: 18,
    color: "#fff",
    marginBottom: 50,
  }
});