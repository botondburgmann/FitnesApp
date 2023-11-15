import { View, TextInput, StyleSheet, Pressable, Text } from 'react-native'
import React, { useContext, useState } from 'react'
import { setUpProfile } from '../functions/databaseQueries';
import SelectMenu from '../components/SelectMenu';
import UserContext from '../contexts/UserContext';
import { RouterProps } from '../types and interfaces/interfaces';
import { SelectItem } from '../types and interfaces/types';
import { FontAwesome5 } from '@expo/vector-icons';
import { globalStyles } from '../assets/styles';



const Weight = ({navigation}: RouterProps) => {
  const userID = useContext(UserContext);

  const [weight, setWeight] = useState<string>();
  const [value, setValue] = useState<string>();
  const [items] = useState<SelectItem[]>([
    {label: 'Metric (kg)', value: 'kg'},
    {label: 'Imperial (lbs)', value: 'lbs'}
  ]);

  
  
  return (
    <View style={globalStyles.container}>
      <Text style={styles.label}>Please, select your weight</Text>
      <View style={styles.icon}>
        <FontAwesome5 name="weight" size={60} color="#fff"/>
      </View>
      <View style={styles.inputGroup}>
        <TextInput
          keyboardType='numeric'
          value={weight}
          style={globalStyles.input}
          placeholder={value === "lbs" ? "Weight (lbs)" : "Weight (kg)" }
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
        <Pressable style={[globalStyles.button, {width: 100}]} onPress={() => setUpProfile('weight', parseFloat(weight),  userID, navigation, 'Height', value)}>
          <Text style={globalStyles.buttonText}>Next</Text>
        </Pressable>
      </View>        
    </View>
  )
}

export default Weight

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
    flex: 0.5, //
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