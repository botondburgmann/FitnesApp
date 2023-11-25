import { View, Text, StyleSheet, Pressable, ImageBackground } from 'react-native'
import React, { useContext, useState } from 'react'
import { setUpProfile } from '../functions/databaseQueries';
import Datepicker from '../components/Datepicker';
import UserContext from '../contexts/UserContext';
import { RouterProps } from '../types and interfaces/interfaces';
import { backgroundImage, globalStyles } from '../assets/styles';



const Age = ({navigation}: RouterProps) => {
  const userID = useContext(UserContext);
  const [birthDate, setBirthDate] = useState(new Date());


  return (
    <ImageBackground source={backgroundImage} style={globalStyles.image}>
      <View style={[globalStyles.container, {backgroundColor: "rgba(255,0,0,0.7)", paddingVertical: 20, paddingHorizontal: 20}]}>
        <Text style={[globalStyles.label, {marginHorizontal: 40}]}>Please, select your date of birth</Text>
        <View style={styles.icon}>
          <Datepicker date={birthDate} setDate={setBirthDate} />
        </View>
        <Text style={[globalStyles.text, {fontSize: 18, textTransform: "uppercase", fontWeight: "600"}]}>{birthDate.toDateString()}</Text>
        <View style={styles.buttonGroup}>
          <Pressable style={[globalStyles.button, {width: 100}]} onPress={() => navigation.navigate('Gender')}>
            <Text style={globalStyles.buttonText}>Go back</Text>
          </Pressable>
          <Pressable style={[globalStyles.button, {width: 100}]} onPress={() => setUpProfile('age', birthDate, userID, navigation, 'Weight')}>
            <Text style={globalStyles.buttonText}>Next</Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
};


export default Age

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
     marginHorizontal: 50,
     textAlign: 'center',
     lineHeight: 40
   },
   buttonGroup: {
    marginTop: 100,
    flexDirection: 'row',
    justifyContent: 'center'
   },
   icon: {
    alignSelf: 'center',
    fontSize: 18,
    color: "#fff",
    marginBottom: 50,
  }
});