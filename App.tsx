import React from "react"
import { NavigationContainer } from "@react-navigation/native";
import Login from "./app/pages/login/Login";
import { useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH, FIRESTORE_DB} from "./FirebaseConfig";
import Registration from "./app/pages/login/Registration";
import UserContext from "./app/contexts/UserContext";
import { FontAwesome5 } from "@expo/vector-icons";
import WeekContext from "./app/contexts/WeekContext";
import { WeekRange } from "./app/types and interfaces/types";
import SetUpLayout from "./app/pages/setup/SetUplayout";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { collection, query, where, getDocs } from "firebase/firestore";
import ExercisesLayout from "./app/pages/exercises/ExercisesLayout";
import ProfileLayout from "./app/pages/profile/ProfileLayout";
import ToplistLayout from "./app/pages/toplist/ToplistLayout";
import WorkoutsLayout from "./app/pages/workouts/WorkoutsLayout";
import { createNativeStackNavigator } from "@react-navigation/native-stack";







const Tab = createBottomTabNavigator();
export function InsideLayout() {

  return( 
    <Tab.Navigator
    screenOptions={({ route }:any ) => ({
      tabBarIcon: ({ color, size }: any) => {
        let iconName;

        if (route.name === "Workouts") {
          iconName = "dumbbell";
        } else if (route.name === "Toplist") {
          iconName = "trophy";
        } else if (route.name === "Exercises") {
          iconName = "list";
        } else if (route.name === "Profile") {
          iconName = "user-alt";
        }

        return <FontAwesome5 name={iconName} size={size} color={color} />;
      },
      tabBarStyle: { backgroundColor: "#FF0000" },
      tabBarInactiveTintColor: "#FFF",
      tabBarActiveTintColor: "lightgrey",
    })}
  >
    <Tab.Screen name="Workouts" component={WorkoutsLayout} options={{ headerShown: false }} />
    <Tab.Screen name="Toplist" component={ToplistLayout} options={{ headerShown: false }} />
    <Tab.Screen name="Exercises" component={ExercisesLayout} options={{ headerShown: false }} />
    <Tab.Screen name="Profile" component={ProfileLayout} options={{ headerShown: false }} />
  </Tab.Navigator>
  );
}







export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [alreadySetUp, setAlreadySetUp] = useState<boolean | null>(null);
  
  async function getSetUpValue (userID: string): Promise<boolean | undefined> {
    try {
        const usersCollectionRef = collection(FIRESTORE_DB, "Users");
        const usersQuery = query(usersCollectionRef, where("userID", "==", userID));
        const usersSnapshot = await getDocs(usersQuery);
        const userDoc = usersSnapshot.docs[0];
        return userDoc.data().set;
    } 
    catch (error: any) {
        alert(`Error: Couldn't find set field: ${error.message}`);
    }
};
  
  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, async (user)=>{
      setUser(user);
      if(user){
        const setUpValue = await getSetUpValue(user.uid);
        if (typeof setUpValue === "boolean")
          setAlreadySetUp(setUpValue)
      }
    });
  }, [])
  
    let userID: string = "";
    if (user !== null) {
      userID = user.uid;
    }
    const [week, setWeek] = useState<WeekRange>({
      start: new Date(),
      end: new Date()
    })
  
    const [today, setToday] = useState(new Date());
    useEffect(() => {
      setWeek(calculateWeekRange(today))
    }, [today, userID])
    
  
    function calculateWeekRange(today:Date): WeekRange {
      const week = {
        start: new Date(),
        end: new Date()  
      };
      const currentDayOfWeek = today.getDay()
      const millisecondsInDay = 86400000;
      const daysUntilMonday = (currentDayOfWeek === 0) ? 6 : currentDayOfWeek - 1;
      const millisecondsUntilMonday = daysUntilMonday * millisecondsInDay;
      week.start = new Date(today.getTime() - millisecondsUntilMonday);
      week.start.setHours(0, 0, 0, 0);

      week.end = new Date(week.start.getTime() + 6 * millisecondsInDay);
      week.end.setHours(23, 59, 59, 999);
      return week;
    }

    const Stack = createNativeStackNavigator();

  return (
    <UserContext.Provider value={userID}>
      <WeekContext.Provider value={week}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            {user && alreadySetUp === true ?
              (<Stack.Screen name="Inside" component={ InsideLayout} options={{ headerShown: false }}/>)
            : user && alreadySetUp === false ?
              (<Stack.Screen name="SetUp" component={ SetUpLayout} options={{ headerShown: false } }/>)
            : (
              <>
                <Stack.Screen name="Login" component={ Login} options={{ headerShown: false }}/>
                <Stack.Screen name="Register" component={ Registration} options={{ headerShown: false }}/>
              </>
              )
            }
          </Stack.Navigator>
        </NavigationContainer>
      </WeekContext.Provider>
    </UserContext.Provider>

  );
}
