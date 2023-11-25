import React from "react"
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Login from "./app/screens/Login";
import { useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH} from "./FirebaseConfig";
import Registration from "./app/screens/Registration";
import Age from "./app/screens/Age";
import Weight from "./app/screens/Weight";
import Gender from "./app/screens/Gender";
import Height from "./app/screens/Height";
import ActivityLevel from "./app/screens/ActivityLevel";
import Log from "./app/screens/Log";
import AddWorkout from "./app/screens/AddWorkout";
import Account from "./app/screens/Account";
import Routines from "./app/screens/Routines";
import { getSetUpValue } from "./app/functions/databaseQueries";
import Toplist from "./app/screens/Toplist";
import Exercises from "./app/screens/Exercises";
import Focus from "./app/screens/Focus";
import UserContext from "./app/contexts/UserContext";
import CurrentExercise from "./app/screens/CurrentExercise";
import CreateExercise from "./app/screens/CreateExercise";
import EditSet from "./app/screens/EditSet";
import EditProfile from "./app/screens/EditProfile";
import Details from "./app/screens/Details";
import { FontAwesome5 } from "@expo/vector-icons";
import Achievements from "./app/screens/Achievements";


const Stack = createNativeStackNavigator();

const SetupStack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

function SetUpLayout() {
  return( 
      <SetupStack.Navigator>
        <SetupStack.Screen name="Gender" component={Gender} options={{ headerShown: false }}/>
        <SetupStack.Screen name="Age" component={Age}  options={{ headerShown: false }}/>
        <SetupStack.Screen name="Weight" component={Weight}   options={{ headerShown: false }} />
        <SetupStack.Screen name="Height" component={Height} options={{ headerShown: false }} />
        <SetupStack.Screen name="ActivityLevel" component={ActivityLevel }options={{ headerShown: false }} />
        <SetupStack.Screen name="InsideLayout" component={ InsideLayout }  options={{ headerShown: false }} />
      </SetupStack.Navigator>
  );
}

function InsideLayout() {
  return( 
    <Tab.Navigator
    screenOptions={({ route } ) => ({
      tabBarIcon: ({ color, size }) => {
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

function WorkoutsLayout() {
  return( 
    <SetupStack.Navigator>
      <SetupStack.Screen name="Log" component={Log} options={{ headerShown: false }}/>
      <SetupStack.Screen name="Add" component={AddWorkout}  />
      <SetupStack.Screen name="Edit set" component={EditSet}  />
      <SetupStack.Screen name="Routines" component={Routines } />
      <SetupStack.Screen name="Focus" component={Focus }/>
      <SetupStack.Screen name="CurrentExercise" component={CurrentExercise }/>
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

  return (
    <UserContext.Provider value={userID}>
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
    </UserContext.Provider>

  );
}
