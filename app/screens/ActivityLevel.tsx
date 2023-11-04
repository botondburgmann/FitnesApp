import { View, StyleSheet, Pressable, Text } from 'react-native'
import React, { useContext, useState } from 'react'
import { setUpProfile } from '../functions/databaseQueries';
import SelectMenu from '../components/SelectMenu';
import UserContext from '../contexts/UserContext';
import { SelectItem } from '../types and interfaces/types';
import { RouterProps } from '../types and interfaces/interfaces';




const ActivityLevel = ({navigation}: RouterProps) => {
  const userID = useContext(UserContext);

  const [value, setValue] = useState<SelectItem>();
  const [items] = useState([
    {label: 'Beginner', value: 'beginner'},
    {label: 'Intermediate', value: 'intermediate'},
    {label: 'Advanced', value: 'advanced'}
  ]);


  return (
    <View style={styles.container}>
      <Text style={styles.label}>Please, select your activity level</Text>
      <Text style={styles.icon}>Icon here</Text>

      <View style={styles.selectMenuContainer}>
        <SelectMenu data={items} setSelectedValue={setValue} title={"Activity level"} />
      </View>      
      <View style={styles.buttonGroup}>
        <Pressable style={styles.button} onPress={() => navigation.navigate('Height')}>
          <Text style={styles.text}>Go back</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => setUpProfile('activityLevel', value, userID, navigation, 'InsideLayout')}>
          <Text style={styles.text}>Finish</Text>
        </Pressable>
      </View>  
    </View>
  )
}

export default ActivityLevel

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ff0000'
  },
  text:{
    alignSelf: 'center',
    fontSize: 18,
    color: "#fff",
    textTransform: 'uppercase',
    fontWeight: "600",
    paddingVertical: 10,
  },
  button:{
    width: 100,
    paddingHorizontal: 5,
    marginHorizontal: 20,
    alignSelf: "center",
    backgroundColor: "#000",
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