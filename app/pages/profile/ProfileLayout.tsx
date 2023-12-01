import React, { useContext } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserContext from '../../contexts/UserContext';
import Account from './Account';
import Achievements from './Achievements';
import EditProfile from './EditProfile';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const ProfileLayout = () => {
    const Stack = createNativeStackNavigator();
    const Tab = createBottomTabNavigator();

    const userID   = useContext(UserContext);
    return( 
      <Stack.Navigator>
          <Tab.Screen name="Account" component={Account} options={{ headerShown: false }} initialParams={{userID: userID  }}/>
          <Tab.Screen name="Edit profile" component={EditProfile}/>
          <Tab.Screen name="Achievements" component={Achievements}/>
  
  
      </Stack.Navigator>
    )
}

export default ProfileLayout

