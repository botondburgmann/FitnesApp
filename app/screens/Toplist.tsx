import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import {Table, Row, Rows} from 'react-native-table-component'
import { getSimilarUsers, getUser, resetWeeklyExperience } from '../functions/databaseQueries';
import UserContext from '../contexts/UserContext';
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../FirebaseConfig';
import { Account } from '../types and interfaces/types';

interface WeekRange{
  start: Date;
  end: Date;
}

interface User {
  activityLevel: string;
  age: number;
  weeklyExperience:number;
  experience: number;
  gender: string;
  height: number;
  level: number;
  name: string;
  weight: number;
}
const Toplist = () => {
  const userID = useContext(UserContext);


  const [table, setTable] = useState({
    tableHead: ["Position", "Name", "Level", "XP this week"],
    tableData: []
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const user = await getUser(userID);
        const data = await getSimilarUsers(user);
        if (Array.isArray(data)) {
          console.log(`getting ${data}`);
          
          setTable((prev) => ({
            ...prev,
            tableData: []
          }));            
          data.map((user, index) => {
              setTable((prev) => ({
                ...prev,
                tableData: [...prev.tableData, [index+1, user.name, user.level, user.weeklyExperience]],
              }));
            });
          }
        setLoading(false);
      } 
      catch (error) {
        alert(`Couldn't retrieve similar users: ${error.message}`);
      }
    };

    const unsubscribe = onSnapshot(
      query(collection(FIRESTORE_DB, "Users"), where("userID", "==", userID)), 
      () => fetchExercises());

    return () => {
      unsubscribe();
    };

  }, [userID]);
    

  

  const [week, setWeek] = useState({
    start: undefined,
    end: undefined
  })

  const [today, setToday] = useState(new Date());

  function update() {
    setToday(new Date());
  }

  //setTimeout(update, 1000);

  useEffect(() => {
    setWeek(calculateWeekRange(today))
    if (today.getDay() === 1)
      resetWeeklyExperience(userID);
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
{loading ? <ActivityIndicator/> : <Table>
  <Row data={table.tableHead} />
  <Rows data={table.tableData} />
</Table>}
    </View>
  )
}

export default Toplist

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ff0000'
  },
  input: {
    marginHorizontal: 10,
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff'
  },
  text:{
    alignSelf: 'center',
    fontSize: 18,
    color: "#fff",
    textTransform: 'uppercase',
    fontWeight: "600",
    paddingVertical: 10,
  },
  gridContainer:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 10,
    marginVertical: 20,
    justifyContent: 'center'
  },
  button:{
    width: 100,
    paddingHorizontal: 5,
    marginHorizontal: 20,
    alignSelf: "center",
    backgroundColor: "#000",
  },
  label: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    textTransform: 'uppercase',
    marginVertical: 10,
    textAlign: 'center',
    lineHeight: 40
  },
  selectMenuContainer: {
    backgroundColor: "#fff",
    padding: 5,
    marginHorizontal: 10,
    marginVertical: 4, 
},
});