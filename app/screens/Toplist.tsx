import { ActivityIndicator, Button, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import {Table, Row, Rows} from 'react-native-table-component'
import { getAllUsers, resetWeeklyExperience } from '../functions/databaseQueries';
import UserContext from '../contexts/UserContext';
import { MyUser  } from '../types and interfaces/types';

interface WeekRange{
  start: Date;
  end: Date;
}

type Columns = {
  levels: number[],
  names: string[],
  positions: number[],
  userIDs: string [],
  weeklyExperiences: number[]


}
const Toplist = () => {
  const [users, setUsers] = useState<MyUser[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = getAllUsers((users) => {
      const sortedUsers = sortUsers(users);
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
        <Pressable onPress={() => alert(user.userID)}>
          <Text style={styles.text}>{user.name}</Text>
        </Pressable>
        <Text style={styles.text}>level {user.level}</Text>
        <Text style={styles.text}>{user.weeklyExperience} XP</Text>

      </View>)
  })

  function sortUsers(users: MyUser[]): MyUser[] {
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
}

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
    <View style={styles.container}>
      <Text style={styles.label}>{week.start} - {week.end}</Text>
      {loading 
      ? <ActivityIndicator/> 
      :  <ScrollView>
          { components}
        </ScrollView>
      }
    </View>
  )
}

export default Toplist

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    backgroundColor: '#ff0000'
  },
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