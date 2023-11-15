import { View, StyleSheet, Pressable, Text } from 'react-native'
import React, { useContext, useState } from 'react'
import { setUpProfile } from '../functions/databaseQueries';
import SelectMenu from '../components/SelectMenu';
import UserContext from '../contexts/UserContext';
import { SelectItem } from '../types and interfaces/types';
import { RouterProps } from '../types and interfaces/interfaces';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyles } from '../assets/styles';




const ActivityLevel = ({navigation}: RouterProps) => {
  const userID = useContext(UserContext);

  const [value, setValue] = useState<SelectItem>();
  const [items] = useState([
    {label: 'Beginner', value: 'beginner'},
    {label: 'Intermediate', value: 'intermediate'},
    {label: 'Advanced', value: 'advanced'}
  ]);


  return (
    <View style={[globalStyles.container, {flex: 1}]}>
      <Text style={styles.label}>Please, select your activity level</Text>
      <View style={styles.icon}>
        <MaterialCommunityIcons name="weight-lifter" size={60} color="#fff" />
      </View>

      <View style={styles.selectMenuContainer}>
        <SelectMenu data={items} setSelectedValue={setValue} title={"Activity level"} />
      </View>      
      <View style={styles.buttonGroup}>
        <Pressable style={globalStyles.button} onPress={() => navigation.navigate('Height')}>
          <Text style={globalStyles.buttonText}>Go back</Text>
        </Pressable>
        <Pressable style={globalStyles.button} onPress={() => setUpProfile('activityLevel', value, userID, navigation, 'InsideLayout')}>
          <Text style={globalStyles.buttonText}>Finish</Text>
        </Pressable>
      </View>  
    </View>
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