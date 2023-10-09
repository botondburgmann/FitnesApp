import { View, Button, StyleSheet, Pressable, Text } from 'react-native'
import React, { useState } from 'react'
import { NavigationProp, useRoute } from '@react-navigation/native';
import { setUpProfile } from '../functions/databaseQueries';
import SelectMenu from '../components/SelectMenu';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

interface RouteParams {
  userID: string;
}

const ActivityLevel = ({navigation}: RouterProps) => {
  const route = useRoute();
  const [value, setValue] = useState<string>(null);
  const [items, setItems] = useState<Array<Object>>([
    {label: 'Beginner', value: 'beginner'},
    {label: 'Intermediate', value: 'intermediate'},
    {label: 'Advanced', value: 'advanced'}
  ]);
  const {userID} = route.params as RouteParams;

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
 input: {
 marginHorizontal: 10,
 marginVertical: 4,
 height: 50,
 borderWidth: 1,
 borderRadius: 4,
 padding: 10,
 backgroundColor: '#fff'
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
  inputGroup:{
   flexDirection: 'row',
   justifyContent: 'space-around',
   alignItems: 'center',
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