import React, { useContext, useState } from "react";
import {  View, Pressable, Text, StyleSheet } from "react-native";
import { NavigationProp } from '@react-navigation/native';
import { setUpProfile } from "../functions/databaseQueries";
import Radiobutton from "../components/Radiobutton";
import UserContext from "../contexts/UserContext";

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const Gender = ( {navigation}: RouterProps) => {
  const userID = useContext(UserContext);
  const [gender, setGender] = useState<string>();
  const options = ["Male", "Female"];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Please, select your gender</Text>
      <Radiobutton selectedValue={gender} setselectedValue={setGender} options={options} />

      <Pressable style={styles.button} onPress={() => setUpProfile('gender', gender, userID, navigation, 'Age')}>
          <Text style={styles.text}>Next</Text>
      </Pressable>
    </View>
  )
}

export default Gender

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
        width: 80,
        paddingHorizontal: 5,
        alignSelf: "center",
        backgroundColor: "#000",
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