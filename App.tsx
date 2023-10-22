import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Login from './app/screens/Login';
import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH} from './FirebaseConfig';
import Registration from './app/screens/Registration';
import Age from './app/screens/Age';
import Weight from './app/screens/Weight';
import Gender from './app/screens/Gender';
import Height from './app/screens/Height';
import ActivityLevel from './app/screens/ActivityLevel';
import Workouts from './app/screens/Workouts';
import AddWorkout from './app/screens/AddWorkout';
import Account from './app/screens/Account';
import Routines from './app/screens/Routines';
import { getSetUpValue } from './app/functions/databaseQueries';
import Toplist from './app/screens/Toplist';
import Exercises from './app/screens/Exercises';
import Focus from './app/screens/Focus';
import UserContext from './app/contexts/UserContext';
import CurrentExercise from './app/screens/CurrentExercise';
import Rest from './app/screens/Rest';


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
      <Tab.Navigator screenOptions={{ tabBarStyle: {backgroundColor: '#ff0000'}, tabBarInactiveTintColor: '#fff'}}>
        <Tab.Screen name='Workouts' component={WorkoutLayout}  options={{ headerShown: false }} />
        <Tab.Screen name='Toplist' component={Toplist}  options={{ headerShown: false }} />
        <Tab.Screen name='Exercises' component={Exercises} options={{ headerShown: false }} />
        <Tab.Screen name='Account' component={Account} options={{ headerShown: false }} />
      </Tab.Navigator>
  );
}

function WorkoutLayout() {
  return( 
    <SetupStack.Navigator>
      <SetupStack.Screen name="Log" component={Workouts} options={{ headerShown: false }}/>
      <SetupStack.Screen name="Add" component={AddWorkout}  />
      <SetupStack.Screen name="Routine" component={Routines } />
      <SetupStack.Screen name="Focus" component={Focus }/>
      <SetupStack.Screen name="CurrentExercise" component={CurrentExercise }/>
      <SetupStack.Screen name="Rest" component={Rest }/>
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
        const setUpValue = getSetUpValue(user.uid);
        setAlreadySetUp(await setUpValue)
      }
    });
  }, [])
  
    let userID;
    if (user !== null) {
      userID = user.uid;
    }

  return (
    <UserContext.Provider value={userID}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Login'>
          {user && alreadySetUp === true ? 
            (<Stack.Screen name='Inside' component={ InsideLayout} options={{ headerShown: false }}/>)
          : user && alreadySetUp === false ?
            (<Stack.Screen name='SetUp' component={ SetUpLayout} options={{ headerShown: false } }/>) 
          : (
            <>
              <Stack.Screen name='Login' component={ Login} options={{ headerShown: false }}/>
              <Stack.Screen name='Register' component={ Registration} options={{ headerShown: false }}/>
            </>
            )
          }
        </Stack.Navigator>
      </NavigationContainer>
    </UserContext.Provider>

  );
}
