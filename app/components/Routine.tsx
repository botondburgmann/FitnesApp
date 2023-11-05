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
      const unsubscribeFromUsers = getUser(userID, (user) => {
        setGender(user.gender);
        setLoading(false);

      })
      return () => {
        unsubscribeFromUsers();
      }
    }, [userID]);
    

    const workoutType = props.workoutType;
  return (
    <Pressable style={styles.container} onPress={() => navigation.navigate('Focus',{workoutType: workoutType})}>
       {/*  <Image style={styles.image} source={imageSource} /> */}
        <Text>{workoutType}</Text>
    </Pressable>
  )
}

export default Routine

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flexDirection:'row',
    justifyContent: 'space-evenly',
    backgroundColor:'green',    
    alignItems: 'center',
    borderWidth: 5,
    borderColor: 'red'
  },
  image: {
    width: 50,
    height: 100,
  },
});