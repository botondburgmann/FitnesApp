import { ActivityIndicator, ImageBackground, Pressable, ScrollView, Text, View, StyleSheet } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { updateAchievementStatus } from '../../functions/firebaseFunctions';
import UserContext from '../../contexts/UserContext';
import { Achievement, User  } from '../../types and interfaces/types';
import { RouterProps } from '../../types and interfaces/types';
import { backgroundImage, globalStyles } from '../../assets/styles';
import WeekContext from '../../contexts/WeekContext';
import { Unsubscribe } from 'firebase/auth';
import { collection, onSnapshot, DocumentData } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../FirebaseConfig';



const Toplist = ({navigation}: RouterProps) => {
  const userID = useContext(UserContext);
  const week = useContext(WeekContext);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  function getAllUsers (callback: Function): Unsubscribe | undefined { 
    try {    
        const usersCollectionRef = collection(FIRESTORE_DB, "Users");
        const unsubscribeFromUsers = onSnapshot(usersCollectionRef, usersSnapshot => {
            const users: DocumentData[] = [];
            usersSnapshot.docs.forEach(usersDoc => {
                users.push(usersDoc.data())
            })        
            callback(users);    
        })
        return unsubscribeFromUsers;
    } catch (error: any) {
        alert(`Error: Couldn't fetch users: ${error}`)
    }
  };

  function sortUsers (users: User[]): User[] {
    const sortedUsers = [...users];
    const n = sortedUsers.length;
  
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (sortedUsers[j].weeklyExperience < sortedUsers[j + 1].weeklyExperience) {
                [sortedUsers[j], sortedUsers[j + 1]] = [sortedUsers[j + 1], sortedUsers[j]];
            }
        }
    }
  
    return sortedUsers;
  };
  
  function selectLoggedInUser(users:User[], userID: string | null) : User {
    let loggedInUser:User = users[0];
    for (const user of users) {
      if (user.userID === userID) {
        loggedInUser = user;
      }
    }
    return loggedInUser;
  };
  
  function selectSimilarUsers (users: User[], loggedInUser: User): User[] {
    const similarUsers = [];
    const loggedInUserBMI = loggedInUser.weight / loggedInUser.height**2;
    for (const user of users) {
      let userBMI = user.weight / user.height**2;
      if (user.gender === loggedInUser.gender && userBMI >= loggedInUserBMI-5 && userBMI <= loggedInUserBMI+ 5) {
        similarUsers.push(user);
      }
    }
    return similarUsers;
  };
  function updateClimbingTheRanksAchievement (loggedInUser: User, users: User[]): void  {
    try {
        if (users.slice(3,10).includes(loggedInUser) && loggedInUser.weeklyExperience > 0){
            const updatedAchievement: Achievement = {
                color: "#BBC2CC",
                description: "Reach the top 3 place in the leaderboard to unlock next stage",
                icon: "arrow-up",
                level: 1,
                name: "Climbing The Ranks",
                status: "Top 10 Challenger",
                visibility: 1
            }
            updateAchievementStatus(loggedInUser.userID, updatedAchievement);
        }
        else if (users.slice(1,3).includes(loggedInUser) && loggedInUser.weeklyExperience > 0){
            const updatedAchievement: Achievement = {
                color: "#BBC2CC",
                description: "Reach the top 1 place in the leaderboard to unlock next stage",
                icon: "arrow-up",
                level: 2,
                name: "Climbing The Ranks",
                status: "Top 3 Contender",
                visibility: 1
            }
            updateAchievementStatus(loggedInUser.userID, updatedAchievement);
        }
        if (users[0] === loggedInUser && loggedInUser.weeklyExperience > 0){
            
            const updatedAchievement: Achievement = {
                color: "#FFDD43",
                description: "Max level achieved: Reach top 1 place in the leaderboard",
                icon: "arrow-up",
                level: 3,
                name: "Climbing The Ranks",
                status: "Leaderboard Dominator",
                visibility: 1
            }
            updateAchievementStatus(loggedInUser.userID, updatedAchievement);
        }
    } catch (error: any) {
        alert(`Error: Couldn't update achievement: ${error}`)
    }
};

  useEffect(() => {
    const unsubscribeFromUers = getAllUsers((users: User[]) => {
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
      if (unsubscribeFromUers !== undefined)
        unsubscribeFromUers();
      setUsers([])
    }
  }, []);


  const components: React.JSX.Element[] = [];
  users.forEach((user, index) => {
    components.push(
      <View key={index} style={styles.row}>
        <Text style={styles.text}>{index + 1}</Text>
        <Pressable onPress={()=>navigation.navigate('User', {userID: user.userID})}>
          <Text style={styles.text}>{user.name}</Text>
        </Pressable>
        <Text style={styles.text}>level {user.level}</Text>
        <Text style={styles.text}>{user.weeklyExperience} XP</Text>

      </View>)
  })


  
  
  

  return (
    <ImageBackground source={backgroundImage} style={globalStyles.image}>
      <View style={styles.container}>
        {week !== null && <Text style={styles.label}>{week.start.toDateString()} - {week.end.toDateString()}</Text>}
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(128,128,128,0.5)',
    flex:1,
    justifyContent: "center",
  },
  label: {
    alignSelf: 'center',
    fontSize: 17,
    fontWeight: "800",
    color: "#fff",
    textTransform: 'uppercase',
    marginTop: 100,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 40,
    textShadowOffset:{
        height: 2,
        width: 2
    },
    textShadowColor: "#000",
    textShadowRadius: 10
  },
  row: { 
    flexDirection: 'row', 
    flexWrap:'wrap',
    justifyContent: 'space-between', 
    marginHorizontal: 20, 
  },

  text:{
    alignSelf: 'center',
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",  
    paddingHorizontal: 5,
    paddingVertical: 10,
    textTransform: 'uppercase',
  },
});
