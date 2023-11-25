import { StyleSheet, Text, Pressable, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { NavigationProp } from "@react-navigation/native";
import { getUser } from '../functions/databaseQueries';
import UserContext from '../contexts/UserContext';
import NavigationContext from '../contexts/NavigationContext';
import { globalStyles } from '../assets/styles';


const Routine = (props) => {
  const userID = useContext(UserContext);
  const navigation = useContext(NavigationContext);
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(true);
    useEffect(() => {
      const unsubscribe = getUser(userID, (user) => {
        setGender(user.gender);
        setLoading(false);

      })
      return () => {
        unsubscribe();
        setGender("");
      }
    }, [userID]);
    

    const workoutType = props.workoutType;
  return (
    <Pressable style={styles.container} onPress={() => navigation.navigate('Focus',{workoutType: workoutType})}>
        <Text style={[globalStyles.text, {textTransform: "uppercase", paddingVertical: 30, fontWeight: "800"}]}>{workoutType} workout</Text>
    </Pressable>
  )
}

export default Routine

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    flexDirection:'row',
    justifyContent: 'space-evenly',
    backgroundColor:'rgba(255,0,0,0.7)',    
    alignItems: 'center',
  },
});