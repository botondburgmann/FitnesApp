import React from "react"
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Login from "./app/pages/login/Login";
import { useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH} from "./FirebaseConfig";
import Registration from "./app/pages/login/Registration";
import Age from "./app/pages/setup/Birthday";
import Weight from "./app/pages/setup/Weight";
import Gender from "./app/pages/setup/Gender";
import Height from "./app/pages/setup/Height";
import ActivityLevel from "./app/pages/setup/ActivityLevel";
import Log from "./app/pages/workouts/Log";
import AddWorkout from "./app/pages/workouts/AddWorkout";
import Account from "./app/pages/profile/Account";
import Routines from "./app/pages/workouts/Routines";
import { getSetUpValue } from "./app/functions/firebaseFunctions";
import Toplist from "./app/pages/toplist/Toplist";
import Exercises from "./app/pages/exercises/Exercises";
import UserContext from "./app/contexts/UserContext";
import CreateExercise from "./app/pages/exercises/CreateExercise";
import EditProfile from "./app/pages/profile/EditProfile";
import Details from "./app/pages/exercises/Details";
import { FontAwesome5 } from "@expo/vector-icons";
import Achievements from "./app/pages/profile/Achievements";
import WeekContext from "./app/contexts/WeekContext";
import { WeekRange } from "./app/types and interfaces/types";
import SetUpLayout from "./app/pages/setup/SetUplayout";



const SetupStack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();



function InsideLayout() {
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

function ToplistLayout() {
  return( 
    <SetupStack.Navigator>
        <Tab.Screen name="Leaderboard" component={Toplist} options={{ headerShown: false }}/>
        <Tab.Screen name="User" component={Account}/>
        <Tab.Screen name="Achievements" component={Achievements}/>

    </SetupStack.Navigator>
  )
}

function ProfileLayout() {
  const userID   = useContext(UserContext);
  return( 
    <SetupStack.Navigator>
        <Tab.Screen name="Account" component={Account} options={{ headerShown: false }} initialParams={{userID: userID  }}/>
        <Tab.Screen name="Edit profile" component={EditProfile}/>
        <Tab.Screen name="Achievements" component={Achievements}/>


    </SetupStack.Navigator>
  )
}


function ExercisesLayout() {
  return( 
    <SetupStack.Navigator>
      <SetupStack.Screen name="Exercise List" component={Exercises} options={{ headerShown: false }}/>
      <SetupStack.Screen name="Create Exercise" component={CreateExercise}  />
      <SetupStack.Screen name="Details" component={Details}  />
    </SetupStack.Navigator>
  )
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [alreadySetUp, setAlreadySetUp] = useState<boolean | null>(null);

  
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
      start: "",
      end: ""
    })
  
    const [today, setToday] = useState(new Date());
    useEffect(() => {
      setWeek(calculateWeekRange(today))
    }, [today, userID])
    
  
    function calculateWeekRange(today:Date): WeekRange {
      const week = {
        start: "",
        end: ""  
      };
      let moveBack = 0;
      let moveForward = 6;
      for (let i = 0; i <= 6; i++) {   
        if (today.getDay() === i) {
          week.start = addDaysToDate(today,-moveBack+1).toDateString()
          week.end = addDaysToDate(today,moveForward+1).toDateString()
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
