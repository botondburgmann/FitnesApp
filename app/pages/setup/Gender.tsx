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
  
  async function setGenderInFirebase(userID: string, gender: "Male" | "Female"): Promise<void> {
    try {
      const userDocRef = await getUserDocumentRef(userID);
      if (userDocRef === undefined)
        throw new Error("User doesn't exist in database");
      const newData = {"gender": gender.trim().toLowerCase()};
      updateDoc(userDocRef, newData);
      navigation.navigate("Birthday");
    } catch (error: any) {
      alert(`Error: Couldn't set your gender: ${error.message}`)
    }
  }


  return (
    <ImageBackground source={backgroundImage} style={globalStyles.image}>
      <View style={[setUpStyles.container]}>
        <Text style={setUpStyles.label}>Please, select your gender</Text>
        <Radiobutton selectedValue={gender} setselectedValue={setGender} options={options} />
        <Pressable style={setUpStyles.button} onPress={() => userID && setGenderInFirebase(userID, gender)}>
            <Text style={globalStyles.buttonText}>Next</Text>
        </Pressable>
      </View>
    </ImageBackground>
  )
}

export default Gender
