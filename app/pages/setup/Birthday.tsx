import { View, Text, StyleSheet, Pressable, ImageBackground } from 'react-native'
import React, { useContext, useState } from 'react'
import Datepicker from '../../components/Datepicker';
import UserContext from '../../contexts/UserContext';
import { backgroundImage, globalStyles } from '../../assets/styles';
import { updateDoc } from 'firebase/firestore';
import { setUpStyles } from './styles';
import { getUserDocumentRef } from '../../functions/firebaseFunctions';
import { RouterProps } from '../../types and interfaces/types';
import { validateBirthday } from '../../functions/globalFunctions';



const Birthday = ({navigation}: RouterProps) => {
  const userID = useContext(UserContext);
  const [birthDate, setBirthDate] = useState(new Date());

  async function setBirthDateInFirebase(): Promise<void> {
    try {
      if (userID === null)
        throw new Error("User is not authorized");
      validateBirthday(birthDate);
      const userDocRef = await getUserDocumentRef(userID);
      if (userDocRef === undefined) 
        throw new Error("User doesn't exist in database");
      const newData = {"dateOfBirth": birthDate.toDateString()};
      await updateDoc(userDocRef, newData);
      navigation.navigate("Weight");
    } 
    catch (error: any) {
      alert(`Errpr: Couldn't set your date of birth: ${error}`)
    }
  }

  

  return (
    <ImageBackground source={backgroundImage} style={globalStyles.image}>
      <View style={setUpStyles.container}>
        <Text style={setUpStyles.label}>Please, select your date of birth</Text>
        <View style={styles.icon}>
          <Datepicker date={birthDate} setDate={setBirthDate} />
        </View>
        <Text style={styles.text}>{birthDate.toDateString()}</Text>
        <View style={styles.buttonGroup}>
          <Pressable style={setUpStyles.button} onPress={() => navigation.navigate('Gender')}>
            <Text style={globalStyles.buttonText}>Go back</Text>
          </Pressable>
          <Pressable style={setUpStyles.button} onPress={setBirthDateInFirebase}>
            <Text style={globalStyles.buttonText}>Next</Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
};


export default Birthday

const styles = StyleSheet.create({
  text:{
    alignSelf: "center",
    fontSize: 18,
    color: "#FFF",
    textShadowOffset:{
        height: 2,
        width: 2
    },
    textShadowColor: "#000",
    textShadowRadius: 10,
    textTransform: "uppercase", 
    fontWeight: "600"
  },
  buttonGroup: {
    marginTop: 100,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  icon : {
    marginTop: -60,
    marginBottom: 30
  },
});
