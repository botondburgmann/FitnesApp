import { View, TextInput, StyleSheet, Pressable, Text, ImageBackground } from 'react-native'
import React, { useContext, useState } from 'react'
import SelectMenu from '../components/SelectMenu';
import UserContext from '../contexts/UserContext';
import { RouterProps } from '../types and interfaces/types';
import { SelectItem } from '../types and interfaces/types';
import { FontAwesome5 } from '@expo/vector-icons';
import { backgroundImage, globalStyles } from '../assets/styles';
import { handleNextButtonPress } from '../functions/otherFunctions';



const Weight = ({navigation}: RouterProps) => {
  const userID = useContext(UserContext);

  const [weight, setWeight] = useState<string>();
  const [value, setValue] = useState<SelectItem>();
  const [items] = useState<SelectItem[]>([
    {label: 'Metric (kg)', value: 'kg'},
    {label: 'Imperial (lbs)', value: 'lbs'}
  ]);

  
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
            placeholder="Weight"
            autoCapitalize='none'
            onChangeText={(text: string) => setWeight(text)}
          />
          <View style={styles.selectMenuContainer}>
            <SelectMenu data={items} setSelectedValue={setValue} title={"System"} />
          </View>
          </View>
        <View style={styles.buttonGroup}>
          <Pressable style={[globalStyles.button, {width: 100}]} onPress={() => navigation.navigate('Age')}>
            <Text style={globalStyles.buttonText}>Go back</Text>
          </Pressable>
          <Pressable style={[globalStyles.button, {width: 100}]} onPress={() => {value !== undefined && handleNextButtonPress('weight', parseFloat(weight ?? "0"),  userID, navigation, 'Height', value["value"])}}>
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