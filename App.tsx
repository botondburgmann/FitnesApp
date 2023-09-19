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
import { addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
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
      <SetupStack.Screen name="activityLevel" component={ActivityLevel } initialParams={{userID: userID} } options={{ headerShown: false }} />
      <SetupStack.Screen name="home" component={Home} options={{ headerShown: false }} />
    </SetupStack.Navigator>
  );
}


export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [alreadySetUp, setAlreadySetUp] = useState<boolean | null>(null);

  
    useEffect(() => {
      onAuthStateChanged(FIREBASE_AUTH, (user)=>{
      setUser(user);
      if(user){
        fetchAlreadySetUpValue(user.uid);
        console.log(alreadySetUp);
        
      } else {
        setAlreadySetUp(false);
      }
    });
  }, [])
  const fetchAlreadySetUpValue = async (uid: string) => {
    try {
      // Create a reference to the 'users' collection in Firestore
      const usersCollectionRef = collection(FIRESTORE_DB, 'users');

      // Create a query to find the user's document by 'uid'
      const q = query(usersCollectionRef, where('userID', '==', uid));

      // Fetch the documents matching the query from Firestore
      const querySnapshot = await getDocs(q);

      
        // Assuming there's only one matching document (usually there should be)
        const userDocSnapshot = querySnapshot.docs[0];
        
        // Access the 'alreadySetUp' field value from the Firestore document
        const alreadySetUpValue = userDocSnapshot.data().set;
        setAlreadySetUp(alreadySetUpValue);
    
    } catch (error) {
      console.error('Error fetching alreadySetUp value:', error);
      // Handle any errors appropriately
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Registration'>
      {user && alreadySetUp ? (
          <Stack.Screen name='Home' component={ Home} options={{ headerShown: false }}/>
          )
        : user && !alreadySetUp ?(
          <Stack.Screen name='Inside' component={ InsideLayout} initialParams={{userID: user.uid} } options={{ headerShown: false } }/>       
          ) 
        : (
          <>
          <Stack.Screen name='Login' component={ Login} options={{ headerShown: false }}/>
          <Stack.Screen name='Register' component={ Registration} options={{ headerShown: false }}/>
          </>
        )
          

      }
        {/* {user && alreadySetUp? (
          <Stack.Screen name='Inside' component={ InsideLayout} initialParams={{userID: user.uid} } options={{ headerShown: false } }/>       
        ) : (
          <>
          <Stack.Screen name='Login' component={ Login} options={{ headerShown: false }}/>
          <Stack.Screen name='Register' component={ Registration} options={{ headerShown: false }}/>
          </>
        )} */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

