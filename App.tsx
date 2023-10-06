import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Login from './app/screens/Login';
import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH, FIRESTORE_DB} from './FirebaseConfig';
import Registration from './app/screens/Registration';
import Age from './app/screens/Age';
import Weight from './app/screens/Weight';
import Gender from './app/screens/Gender';
import Height from './app/screens/Height';
import ActivityLevel from './app/screens/ActivityLevel';
import Home from './app/screens/Home';
import AddWorkout from './app/screens/AddWorkout';
import Account from './app/screens/Account';
import Routines from './app/screens/Routines';
import { getSetUpValue } from './app/functions/databaseQueries';

const Stack = createNativeStackNavigator();

const SetupStack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

function SetUpLayout({route}) {
  const {userID} = route.params;
  return( 
    <SetupStack.Navigator>
      <SetupStack.Screen name="gender" component={Gender} initialParams={{userID: userID} }  options={{ headerShown: false }}/>
      <SetupStack.Screen name="age" component={Age} initialParams={{userID: userID} } options={{ headerShown: false }}/>
      <SetupStack.Screen name="weight" component={Weight} initialParams={{userID: userID} }  options={{ headerShown: false }} />
      <SetupStack.Screen name="height" component={Height} initialParams={{userID: userID} } options={{ headerShown: false }} />
      <SetupStack.Screen name="activityLevel" component={ActivityLevel } initialParams={{userID: userID} } options={{ headerShown: false }} />
      <SetupStack.Screen name="insideLayout" component={ InsideLayout } initialParams={{userID: userID} } options={{ headerShown: false }} />
    </SetupStack.Navigator>
  );
}

function InsideLayout({route}) {
  const {userID} = route.params;
  
  return( 
    <Tab.Navigator>
      <Tab.Screen name='home' component={Home} initialParams={{userID: userID} } options={{ headerShown: false }} />
      <Tab.Screen name='Add' component={AddWorkout} initialParams={{userID: userID} } options={{ headerShown: false }} />
      <Tab.Screen name='Routines' component={Routines} initialParams={{userID: userID} } options={{ headerShown: false }} />
      <Tab.Screen name='Account' component={Account} initialParams={{userID: userID} } options={{ headerShown: false }} />
    </Tab.Navigator>
  );
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



  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        {user && alreadySetUp === true ? 
          (<Stack.Screen name='Inside' component={ InsideLayout} initialParams={{userID: user.uid} } options={{ headerShown: false }}/>)
        : user && alreadySetUp === false ?
          (<Stack.Screen name='SetUp' component={ SetUpLayout} initialParams={{userID: user.uid} } options={{ headerShown: false } }/>) 
        : (
          <>
            <Stack.Screen name='Login' component={ Login} options={{ headerShown: false }}/>
            <Stack.Screen name='Register' component={ Registration} options={{ headerShown: false }}/>
          </>
          )
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}

