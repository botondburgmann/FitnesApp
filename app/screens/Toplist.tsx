import { ActivityIndicator, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { getAllUsers, updateClimbingTheRanksAchievement } from '../functions/databaseQueries';
import UserContext from '../contexts/UserContext';
import { MyUser  } from '../types and interfaces/types';
import { RouterProps } from '../types and interfaces/interfaces';
import { selectLoggedInUser, selectSimilarUsers, sortUsers } from '../functions/otherFunctions';
import { backgroundImage, globalStyles } from '../assets/styles';

interface WeekRange{
  start: Date;
  end: Date;
}

const Toplist = ({navigation}: RouterProps) => {
  const userID = useContext(UserContext);
  const [users, setUsers] = useState<MyUser[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = getAllUsers((users) => {
      const loggedInUser = selectLoggedInUser(users, userID );
      const similarUsers = selectSimilarUsers(users, loggedInUser);
      const sortedUsers = sortUsers(similarUsers);
      if (sortedUsers.length > 10){
        sortedUsers.splice(10,sortedUsers.length-10)
        updateClimbingTheRanksAchievement(loggedInUser, sortedUsers);
      }
      setUsers(sortedUsers);
      setLoading(false);
    });

  
  
    return () => {
      unsubscribe();
      setUsers([])
    }
  }, []);


  const components = [];
  users.forEach((user, index) => {
    components.push(
      <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, flexWrap:'wrap'}}>
        <Text style={styles.text}>{index + 1}</Text>
        <Pressable onPress={()=>navigation.navigate('User', {userID: user.userID})}>
          <Text style={styles.text}>{user.name}</Text>
        </Pressable>
        <Text style={styles.text}>level {user.level}</Text>
        <Text style={styles.text}>{user.weeklyExperience} XP</Text>

      </View>)
  })


  const [week, setWeek] = useState({
    start: undefined,
    end: undefined
  })

  const [today, setToday] = useState(new Date());
/*   function update(callback) {
    const timeUntilMonday = ((1 - today.getDay() + 7) % 7) * 24 * 60 * 60 * 1000;
    const timeUntilMidnight = (24 - today.getHours()) * 60 * 60 * 1000 - today.getMinutes() * 60 * 1000 - today.getSeconds() * 1000;
    const initialDelay = timeUntilMonday + timeUntilMidnight;
    callback();
    setInterval(() => {
      callback();
    }, 7 * 24 * 60 * 60 * 1000);

    setTimeout(() => {
      setInterval(() => {
        callback();
      }, 7 * 24 * 60 * 60 * 1000);
    }, initialDelay);

  }

  update(() => resetWeeklyExperience(userID)) */
  useEffect(() => {
    setWeek(calculateWeekRange(today))
  }, [today])
  

  function calculateWeekRange(today:Date): WeekRange {
    const week = {
      start: undefined,
      end: undefined  
    };
    let moveBack = 0;
    let moveForward = 6;
    for (let i = 1; i <= 7; i++) {      
      if (today.getDay() === i) {
        week.start = addDaysToDate(today,-moveBack).toDateString()
        week.end = addDaysToDate(today,moveForward).toDateString()
        break;
      }
      moveBack++;
      moveForward--;
    }
    
    return week;
  }

  function addDaysToDate(date:Date, daysToAdd:number) {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + daysToAdd);
    return newDate;
  }
  
  

  return (
    <ImageBackground source={backgroundImage} style={globalStyles.image}>
      <View style={[globalStyles.container, {flex: 1}]}>
        <Text style={styles.label}>{week.start} - {week.end}</Text>
        {loading
        ? <ActivityIndicator/>
        :  <ScrollView>
            { components}
          </ScrollView>
        }
      </View>
    </ImageBackground>
  )
}

export default Toplist

const styles = StyleSheet.create({
  label: {
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
    textTransform: 'uppercase',
    marginTop: 100,
    marginBottom: 20
  },
  text:{
    fontSize: 14,
    color: "#fff",
    textTransform: 'uppercase',
    fontWeight: "600",
    paddingVertical: 10,
    paddingHorizontal: 5
  },
});