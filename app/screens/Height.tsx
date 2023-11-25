import { View, TextInput, StyleSheet, Pressable, Text, ImageBackground } from 'react-native'
import React, { useContext, useState } from 'react'
import { setUpProfile } from '../functions/databaseQueries';
import SelectMenu from '../components/SelectMenu';
import UserContext from '../contexts/UserContext';
import { SelectItem } from '../types and interfaces/types';
import { RouterProps } from '../types and interfaces/interfaces';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { backgroundImage, globalStyles } from '../assets/styles';
import { NavigationProp } from '@react-navigation/native';


const Height = ({navigation}: RouterProps) => {
  const userID = useContext(UserContext);

  const [height, setHeight] = useState<string>();
  const [value, setValue] = useState<SelectItem>();
  const [items] = useState<SelectItem[]>([
    {label: 'Metric (cm)', value: 'm'},
    {label: 'Imperial (ft)', value: 'ft'}
  ]);

  function handleNextButtonPress(field:string, value: number, userID: string | null, navigation:NavigationProp<any, any>, nextPage: string, system: SelectItem | undefined ) {    
    if (system === undefined)
      alert("Error: Please select one of the options");
    else
      setUpProfile(field, value, userID, navigation, nextPage, system["value"])
    
  }

  return (
    <ImageBackground source={backgroundImage} style={globalStyles.image}>
      <View style={[globalStyles.container, {backgroundColor: "rgba(255,0,0,0.7)", paddingVertical: 20, paddingHorizontal: 20}]}>
      <Text style={[globalStyles.label, {marginBottom: 50}]}>Please, select your height</Text>
        <View style={styles.icon}>
          <MaterialCommunityIcons name="human-male-height" size={60} color="#fff" />
        </View>
        <View style={styles.inputGroup}>
          <TextInput
            keyboardType='numeric'
            value={height}
            style={globalStyles.input}
            placeholder={value && value["value"] === "ft" ? "Height (ft)" : "Height (cm)" }
            autoCapitalize='none'
            onChangeText={(text: string) => setHeight(text)}
          />
          <View style={styles.selectMenuContainer}>
            <SelectMenu data={items} setSelectedValue={setValue} title={"System"} />
          </View>
        </View>
        <View style={styles.buttonGroup}>
          <Pressable style={[globalStyles.button, {width: 100}]} onPress={() => navigation.navigate('Weight')}>
            <Text style={globalStyles.buttonText}>Go back</Text>
          </Pressable>
          <Pressable style={[globalStyles.button, {width: 100}]} onPress={() => handleNextButtonPress('height', parseFloat(height ?? "0"), userID, navigation, 'ActivityLevel', value)}>
            <Text style={globalStyles.buttonText}>Next</Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  )
}

export default Height

const styles = StyleSheet.create({
  buttonGroup: {
   marginTop: 100,
   flexDirection: 'row',
   justifyContent: 'space-evenly' 
  },
  inputGroup:{
   flexDirection: 'row',
   justifyContent: 'space-around',
   alignItems: 'center',
  },
  selectMenuContainer: {
   flex: 0.7,
   backgroundColor: "#fff",
   padding: 5
  },
  icon: {
   alignSelf: 'center',
   fontSize: 18,
   color: "#fff",
   marginBottom: 50,
  }
});