import { View, TextInput, StyleSheet, Pressable, Text, ImageBackground } from 'react-native'
import React, { useContext, useState } from 'react'
import { setUpProfile } from '../functions/databaseQueries';
import SelectMenu from '../components/SelectMenu';
import UserContext from '../contexts/UserContext';
import { RouterProps } from '../types and interfaces/interfaces';
import { SelectItem } from '../types and interfaces/types';
import { FontAwesome5 } from '@expo/vector-icons';
import { backgroundImage, globalStyles } from '../assets/styles';
import { NavigationProp } from '@react-navigation/native';



const Weight = ({navigation}: RouterProps) => {
  const userID = useContext(UserContext);

  const [weight, setWeight] = useState<string>();
  const [value, setValue] = useState<string>();
  const [items] = useState<SelectItem[]>([
    {label: 'Metric (kg)', value: 'kg'},
    {label: 'Imperial (lbs)', value: 'lbs'}
  ]);

  function handleNextButtonPress(field:string, value: number, userID: string, navigation:NavigationProp<any, any>, nextPage: string, system: string | undefined ) {    
    if (system === undefined)
      alert("Error: Please select one of the options");
    else
      setUpProfile(field, value, userID, navigation, nextPage, system["value"])
    
  }
  
  return (
    <ImageBackground source={backgroundImage} style={globalStyles.image}>
      <View style={[globalStyles.container, {backgroundColor: "rgba(255,0,0,0.7)", paddingVertical: 20, paddingHorizontal: 20}]}>
        <Text style={[globalStyles.label, {marginBottom: 50}]}>Please, select your weight</Text>
        <View style={styles.icon}>
          <FontAwesome5 name="weight" size={60} color="#fff"/>
        </View>
        <View style={styles.inputGroup}>
          <TextInput
            keyboardType='numeric'
            value={weight}
            style={globalStyles.input}
            placeholder={value["value"] === "lbs" ? "Weight (lbs)" : "Weight (kg)" }
            autoCapitalize='none'
            onChangeText={(text) => setWeight(text)}
          />
          <View style={styles.selectMenuContainer}>
            <SelectMenu data={items} setSelectedValue={setValue} title={"System"} />
          </View>
          </View>
        <View style={styles.buttonGroup}>
          <Pressable style={[globalStyles.button, {width: 100}]} onPress={() => navigation.navigate('Age')}>
            <Text style={globalStyles.buttonText}>Go back</Text>
          </Pressable>
          <Pressable style={[globalStyles.button, {width: 100}]} onPress={() => handleNextButtonPress('weight', parseFloat(weight),  userID, navigation, 'Height', value)}>
            <Text style={globalStyles.buttonText}>Next</Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  )
}

export default Weight

const styles = StyleSheet.create({  buttonGroup: {
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
    flex: 0.7, //
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