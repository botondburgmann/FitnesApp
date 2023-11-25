import React, { useContext, useState } from "react";
import {  View, Pressable, Text, StyleSheet, ImageBackground } from "react-native";
import { setUpProfile } from "../functions/databaseQueries";
import Radiobutton from "../components/Radiobutton";
import UserContext from "../contexts/UserContext";
import { RouterProps } from "../types and interfaces/interfaces";
import { backgroundImage, globalStyles } from "../assets/styles";
import { SelectItem } from "../types and interfaces/types";
import { NavigationProp } from "@react-navigation/native";


const Gender = ( {navigation}: RouterProps) => {
  const userID = useContext(UserContext);
  const [gender, setGender] = useState<string>();
  const options = ["Male", "Female"];

  function handleNextButtonPress(field:string, value: string | undefined, userID: string, navigation:NavigationProp<any, any>, nextPage: string) {    
    if (value === undefined)
      alert("Error: Please select one of the options");
    else
      setUpProfile(field, value, userID, navigation, nextPage)
    
  }

  return (
    <ImageBackground source={backgroundImage} style={globalStyles.image}>
      <View style={[globalStyles.container, {backgroundColor: "rgba(255,0,0,0.7)", paddingVertical: 20, paddingHorizontal: 20}]}>
        <Text style={[globalStyles.label, {marginBottom: 50}]}>Please, select your gender</Text>
        <Radiobutton selectedValue={gender} setselectedValue={setGender} options={options} />
        <Pressable style={[globalStyles.button, {width: 100}]} onPress={() => handleNextButtonPress('gender', gender, userID, navigation, 'Age')}>
            <Text style={globalStyles.buttonText}>Next</Text>
        </Pressable>
      </View>
    </ImageBackground>
  )
}

export default Gender

const styles = StyleSheet.create({
    text:{
      alignSelf: 'center',
      fontSize: 18,
      color: "#fff",
      textTransform: 'uppercase',
      fontWeight: "600",
      paddingVertical: 10,
    },
    radioGroup :{
        marginVertical: 20,
        
    },
    label: {
        alignSelf: 'center',
        fontSize: 20,
        fontWeight: "800",
        color: "#fff",
        textTransform: 'uppercase',
        marginBottom: 50
      }
  });