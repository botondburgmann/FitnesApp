import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import {Table, Row, Rows} from 'react-native-table-component'
import { getTable, resetWeeklyExperience } from '../functions/databaseQueries';
import UserContext from '../contexts/UserContext';
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../FirebaseConfig';

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

  const [users, setUsers] = useState<User[]>()
/*   let user = getUser(userID);
  const [users, setUsers] = useState([])

   getUsers(userID)
    .then(response => {setUsers(response)})
    .then(()=>{
      users.map((user, index) => {
        let row = [index, user.name, user.level, user.weeklyExperience];
        table.tableData.push(row);  
      })
    }); */
    

const [userToCompareTo, setUserToCompareTo] = useState({
  gender: "",
  height: 0,
  weight: 0,
  level: 0,
  weeklyExperience: 0,
  name: ""
})

const [table, setTable] = useState({
  tableHead: ["Position", "Name", "Level", "XP this week"],
  tableData: []
})
const [isLoading, setIsLoading] = useState(true);


useEffect(() => {
  const fetchData =async () => {
      try {
          setUserToCompareTo({
              weeklyExperience: 0,
              gender: "",
              height: 0,
              level: 0,
              name: "",
              weight: 0
          });
          const usersCollectionRef = collection(FIRESTORE_DB, "Users");
          const currentUserQuery = query(usersCollectionRef, where("userID", "==", userID));
      
          onSnapshot(currentUserQuery, (snapshot) => {
              let data;
              snapshot.docs.forEach((doc) => {
                  data = {
                      weeklyExperience : doc.data().weeklyExperience,
                      gender: doc.data().gender,
                      height: doc.data().height,
                      level: doc.data().level,
                      name: doc.data().name,
                      weight: doc.data().weight
                  };
              });
              setUserToCompareTo(data);
          });

          const relatedUsersQuery = query(usersCollectionRef, where("gender", "==", userToCompareTo.gender));

          onSnapshot(relatedUsersQuery, async (snapshot) => {
              let row = [];
              snapshot.docs.forEach((doc, index) => {
                  if (doc.data().weight/((doc.data().height/100)**2) >= userToCompareTo.weight/((userToCompareTo.height/100)**2)-5 && 
                      doc.data().weight/((doc.data().height/100)**2) <= userToCompareTo.weight/((userToCompareTo.height/100)**2)+5) {
                      row.push([index,doc.data().name, doc.data().level, doc.data().weeklyExperience])
                  }
              })
              await setTable(prev => ({
                  ...prev,
                  tableData: row
              }))
              setIsLoading(false);

          })
      } catch (error) {
          alert("Couldn't retrieve exercises: " + error.message);
      }
  };
  
  fetchData()
  
}, [userID])
    


    
     // const q = query(workoutsCollectionRef, where("userID", "==", userID), where("date", "==", date.toDateString()));
/*       getDocs(usersCollectionRef)
        .then(snapshot => {
          let updatedRow = []
          snapshot.docs.forEach((doc,index) => {        
            updatedRow.push([index, doc.data().name, doc.data().level, doc.data().weeklyExperience])
            setTable((prevTable) => ({
              ...prevTable,
              tableData: updatedRow
            }));
        })
      }) */
  
  

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
{isLoading ? <ActivityIndicator/> : <Table>
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