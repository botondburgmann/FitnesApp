import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Login from './app/screens/Login';
import Details from './app/screens/Details';
import List from './app/screens/List';
import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig';
import Registration from './app/screens/Registration';
import Age from './app/screens/Age';
import Weight from './app/screens/Weight';

const Stack = createNativeStackNavigator();

const InsideStack = createNativeStackNavigator();

function InsideLayout() {
  return( 
    <InsideStack.Navigator>
      <InsideStack.Screen name="age" component={Age} options={{ headerShown: false }}/>
      <InsideStack.Screen name="weight" component={Weight} options={{ headerShown: false }} />
    </InsideStack.Navigator>
  );
}


export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user)=>{
      console.log('user', user);
      setUser(user);
    });
  }, [])
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Registration'>
        {user ? (
          <Stack.Screen name='Inside' component={ InsideLayout} options={{ headerShown: false }}/>       
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

