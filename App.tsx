import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Login from './app/screens/Login';
import Details from './app/screens/Details';
import List from './app/screens/List';
import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH, FIRESTORE_DB} from './FirebaseConfig';
import Registration from './app/screens/Registration';
import Age from './app/screens/Age';
import Weight from './app/screens/Weight';
import Gender from './app/screens/Gender';
import Height from './app/screens/Height';
import ActivityLevel from './app/screens/ActivityLevel';
import { addDoc, collection } from 'firebase/firestore';
import Home from './app/screens/Home';

const Stack = createNativeStackNavigator();

const SetupStack = createNativeStackNavigator();

function InsideLayout({route}) {
  const {userID} = route.params;
  
  return( 
    <SetupStack.Navigator>
      <SetupStack.Screen name="gender" component={Gender} initialParams={{userID: userID} }  options={{ headerShown: false }}/>
      <SetupStack.Screen name="age" component={Age} initialParams={{userID: userID} } options={{ headerShown: false }}/>
      <SetupStack.Screen name="weight" component={Weight} initialParams={{userID: userID} }  options={{ headerShown: false }} />
      <SetupStack.Screen name="height" component={Height} initialParams={{userID: userID} } options={{ headerShown: false }} />
      <SetupStack.Screen name="activityLevel" component={ActivityLevel} options={{ headerShown: false }} />
      <SetupStack.Screen name="home" component={Home} options={{ headerShown: false }} />
    </SetupStack.Navigator>
  );
}


export default function App() {
  const [user, setUser] = useState<User | null>(null);
  
    let alreadyInitialized = false;
    useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user)=>{
      
      setUser(user);
       if(!alreadyInitialized){
        addDoc(collection(FIRESTORE_DB, 'users'), {userID: user.uid, name: "name", gender: "", age: 0, weight: 0, height: 0, activityLevel: ""});
        alreadyInitialized = true;
      } 

    });
  }, [])
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Registration'>
        {user ? (
          <Stack.Screen name='Inside' component={ InsideLayout} initialParams={{userID: user.uid} } options={{ headerShown: false } }/>       
        ) : (
          <>
          <Stack.Screen name='Login' component={ Login} options={{ headerShown: false }}/>
          <Stack.Screen name='Register' component={ Registration} options={{ headerShown: false }}/>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

