import { ActivityIndicator, ImageBackground, Pressable, ScrollView, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { getAllUsers, updateClimbingTheRanksAchievement } from '../../functions/firebaseFunctions';
import UserContext from '../../contexts/UserContext';
import { MyUser  } from '../../types and interfaces/types';
import { RouterProps } from '../../types and interfaces/types';
import { selectLoggedInUser, selectSimilarUsers, sortUsers } from '../../functions/otherFunctions';
import { backgroundImage, globalStyles } from '../../assets/styles';
import WeekContext from '../../contexts/WeekContext';



const Toplist = ({navigation}: RouterProps) => {
  const userID = useContext(UserContext);
  const week = useContext(WeekContext);
  const [users, setUsers] = useState<MyUser[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = getAllUsers((users: MyUser[]) => {
      const loggedInUser = selectLoggedInUser(users, userID );
      const similarUsers = selectSimilarUsers(users, loggedInUser);
      const sortedUsers = sortUsers(similarUsers);
      if (sortedUsers.length > 10){
        sortedUsers.splice(10,sortedUsers.length-10)
      }      
      updateClimbingTheRanksAchievement(loggedInUser, sortedUsers);
      setUsers(sortedUsers);
      setLoading(false);
    });

  
  
    return () => {
      unsubscribe();
      setUsers([])
    }
  }, []);


  const components: React.JSX.Element[] = [];
  users.forEach((user, index) => {
    components.push(
      <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, flexWrap:'wrap'}}>
        <Text style={[globalStyles.text, {textTransform: "uppercase", fontSize: 14, fontWeight: "600", paddingVertical: 10, paddingHorizontal: 5}]}>{index + 1}</Text>
        <Pressable onPress={()=>navigation.navigate('User', {userID: user.userID})}>
          <Text style={[globalStyles.text, {textTransform: "uppercase", fontSize: 14, fontWeight: "600", paddingVertical: 10, paddingHorizontal: 5}]}>{user.name}</Text>
        </Pressable>
        <Text style={[globalStyles.text, {textTransform: "uppercase", fontSize: 14, fontWeight: "600", paddingVertical: 10, paddingHorizontal: 5}]}>level {user.level}</Text>
        <Text style={[globalStyles.text, {textTransform: "uppercase", fontSize: 14, fontWeight: "600", paddingVertical: 10, paddingHorizontal: 5}]}>{user.weeklyExperience} XP</Text>

      </View>)
  })


  
  
  

  return (
    <ImageBackground source={backgroundImage} style={globalStyles.image}>
      <View style={[globalStyles.container, {flex: 1}]}>
        {week !== null && <Text style={[globalStyles.label, {marginTop: 100, marginBottom: 20, fontSize: 17}]}>{week.start} - {week.end}</Text>}
        {loading
        ? <ActivityIndicator/>
        :  <ScrollView contentContainerStyle={{ backgroundColor: "rgba(255,0,0,0.7)" }}>
            { components}
          </ScrollView>
        }
      </View>
    </ImageBackground>
  )
}

export default Toplist
