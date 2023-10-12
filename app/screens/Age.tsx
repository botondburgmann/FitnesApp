import { View, Text, StyleSheet, Pressable } from 'react-native'
import React, { useContext, useState } from 'react'
import { NavigationProp } from '@react-navigation/native';
import { setUpProfile } from '../functions/databaseQueries';
import Datepicker from '../components/Datepicker';
import UserContext from '../contexts/UserContext';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}



const Age = ({navigation}: RouterProps) => {
  const userID = useContext(UserContext);
  const [birthDate, setBirthDate] = useState(new Date());


  return (
    <View style={styles.container}>
      <Text style={styles.label}>Please, select your date of birth</Text>
      <Datepicker date={birthDate} setDate={setBirthDate} />
      <Text>{birthDate.toDateString()}</Text>
      <View style={styles.buttonGroup}>
        <Pressable style={styles.button} onPress={() => navigation.navigate('Gender')}>
          <Text style={styles.text}>Go back</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => setUpProfile('age', birthDate, userID, navigation, 'Weight')}>
          <Text style={styles.text}>Next</Text>
        </Pressable>
      </View>
    </View>
  );
};


export default Age

const styles = StyleSheet.create({
  container: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
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
     marginBottom: 50,
     marginHorizontal: 50,
     textAlign: 'center',
     lineHeight: 40
   },
   buttonGroup: {
    marginTop: 100,
    flexDirection: 'row'
   }
});