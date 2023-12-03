import React, { useContext, useState } from "react";
import {  View, Pressable, Text, ImageBackground } from "react-native";
import Radiobutton from "../../components/Radiobutton";
import UserContext from "../../contexts/UserContext";
import { backgroundImage, globalStyles } from "../../assets/styles";
import { updateDoc } from "firebase/firestore";
import { setUpStyles } from "./styles";
import { getUserDocumentRef } from "../../functions/firebaseFunctions";
import { RouterProps } from "../../types and interfaces/types";


const Gender = ({navigation}: RouterProps) => {
  const userID = useContext(UserContext);
  const [gender, setGender] = useState<"Male" | "Female">("Male");
  const options:  ["Male", "Female"] = ["Male", "Female"];
  async function setGenderInFirebase(): Promise<void> {
    try {
      if (userID === null) 
        throw new Error("User is not authorized");
      if (gender.trim().toLowerCase() !== "male" && gender.trim().toLowerCase() !== "female")
        throw new Error("Gender must be either male or female");
      
      const userDocRef = await getUserDocumentRef(userID);
      if (userDocRef === undefined)
        throw new Error("User doesn't exist in database");
      const newData = {"gender": gender.trim().toLowerCase()};
      await updateDoc(userDocRef, newData);
      navigation.navigate("Birthday");
    } 
    catch (error: any) {
      alert(`Error: Couldn't set your gender: ${error}`)
    }
  }


  return (
    <ImageBackground source={backgroundImage} style={globalStyles.image}>
      <View style={[setUpStyles.container]}>
        <Text style={setUpStyles.label}>Please, select your gender</Text>
        <Radiobutton selectedValue={gender} setselectedValue={setGender} options={options} />
        <Pressable style={setUpStyles.button} onPress={setGenderInFirebase}>
            <Text style={globalStyles.buttonText}>Next</Text>
        </Pressable>
      </View>
    </ImageBackground>
  )
}

export default Gender
