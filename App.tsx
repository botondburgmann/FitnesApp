import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
import { collection, getDocs, query, where } from 'firebase/firestore';
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
      <SetupStack.Screen name="home" component={ Home } initialParams={{userID: userID} } options={{ headerShown: false }} />
    </SetupStack.Navigator>
  );
}


export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [alreadySetUp, setAlreadySetUp] = useState<boolean | null>(null);

  
  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user)=>{
      setUser(user);
      if(user)
        setAlreadySetUpValue(user.uid); 
      else
        setAlreadySetUp(true);
    });
  }, [])

  const setAlreadySetUpValue = async (uid: string) => {
    try {
      const usersCollectionRef = collection(FIRESTORE_DB, 'users');
      const q = query(usersCollectionRef, where('userID', '==', uid));
      const querySnapshot = await getDocs(q);
      const userDocSnapshot = querySnapshot.docs[0];
      const alreadySetUpValue = userDocSnapshot.data().set;
      setAlreadySetUp(alreadySetUpValue);
    } catch (error) {
      alert("Couldn't find set field : " + error.message);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        {user && alreadySetUp ? 
          (<Stack.Screen name='Home' component={ Home} initialParams={{userID: user.uid} } options={{ headerShown: false }}/>)
        : user && !alreadySetUp ?
          (<Stack.Screen name='Inside' component={ InsideLayout} initialParams={{userID: user.uid} } options={{ headerShown: false } }/>) 
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

