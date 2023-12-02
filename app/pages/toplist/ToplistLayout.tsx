import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Account from '../profile/Account';
import Achievements from '../profile/Achievements';
import Toplist from './Toplist';

const ToplistLayout = () => {
    const Stack = createNativeStackNavigator();
    const Tab = createBottomTabNavigator();

    return( 
        <Stack.Navigator>
            <Tab.Screen name="Leaderboard" component={Toplist} options={{ headerShown: false }}/>
            <Tab.Screen name="User" component={Account}/>
            <Tab.Screen name="Achievements" component={Achievements}/>
        </Stack.Navigator>
      )
}

export default ToplistLayout