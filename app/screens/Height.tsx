import { View, TextInput, StyleSheet, Pressable, Text, ImageBackground } from 'react-native'
import React, { useContext, useState } from 'react'
import { setUpProfile } from '../functions/databaseQueries';
import SelectMenu from '../components/SelectMenu';
import UserContext from '../contexts/UserContext';
import { SelectItem } from '../types and interfaces/types';
import { RouterProps } from '../types and interfaces/interfaces';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { backgroundImage, globalStyles } from '../assets/styles';


const Height = ({navigation}: RouterProps) => {
  const userID = useContext(UserContext);

  const [height, setHeight] = useState<string>();
  const [value, setValue] = useState<string>();
  const [items] = useState<SelectItem[]>([
    {label: 'Metric (cm)', value: 'm'},
    {label: 'Imperial (ft)', value: 'ft'}
  ]);

  return (
    <ImageBackground source={backgroundImage} style={globalStyles.image}>
      <View style={globalStyles.container}>
        <Text style={styles.label}>Please, select your height</Text>
        <View style={styles.icon}>
          <MaterialCommunityIcons name="human-male-height" size={60} color="#fff" />
        </View>
        <View style={styles.inputGroup}>
          <TextInput
            keyboardType='numeric'
            value={height}
            style={globalStyles.input}
            placeholder={value === "ft" ? "Height (ft)" : "Height (cm)" }
            autoCapitalize='none'
            onChangeText={(text) => setHeight(text)}
          />
          <View style={styles.selectMenuContainer}>
            <SelectMenu data={items} setSelectedValue={setValue} title={"System"} />
          </View>
        </View>
        <View style={styles.buttonGroup}>
          <Pressable style={[globalStyles.button, {width: 100}]} onPress={() => navigation.navigate('Weight')}>
            <Text style={styles.text}>Go back</Text>
          </Pressable>
          <Pressable style={[globalStyles.button, {width: 100}]} onPress={() => setUpProfile('height', parseFloat(height), userID, navigation, 'ActivityLevel', value)}>
            <Text style={globalStyles.buttonText}>Next</Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  )
}

export default Height

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
    textAlign: 'center',
    lineHeight: 40
  },
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
   flex: 0.5,
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