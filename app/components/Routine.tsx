import { StyleSheet, Text, Pressable, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { NavigationProp } from "@react-navigation/native";
import { getUser } from '../functions/databaseQueries';
import UserContext from '../contexts/UserContext';
import NavigationContext from '../contexts/NavigationContext';


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
        <Text style={styles.text}>{workoutType} workout</Text>
    </Pressable>
  )
}

export default Routine

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    flexDirection:'row',
    justifyContent: 'space-evenly',
    backgroundColor:'#808080',    
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  image: {
    width: 50,
    height: 100,
  },
  text:{
    alignSelf: 'flex-start',
    fontSize: 18,
    color: "#fff",
    textTransform: 'uppercase',
    fontWeight: "800",
    paddingVertical: 30,
  },
});