import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { globalStyles } from '../assets/styles'
import { FontAwesome5 } from '@expo/vector-icons';
import { Achievement } from '../types and interfaces/types';
import { getAchievementsForUser } from '../functions/databaseQueries';


const Achievements = ({route}) => {
    const {userID} = route?.params;
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loadingAchievements, setLoadingAchievements] = useState(true);

    useEffect(() => {
        const unsubscribeFromAchievements = getAchievementsForUser(userID, achievements => {
            setAchievements(achievements);
            setLoadingAchievements(false);
        })
    
      return () => {
        unsubscribeFromAchievements();
      }
    }, [userID]);
    
    const achievementComponents = [];

    if (!loadingAchievements) {        
        for (let i = 0; i < achievements.length; i++) {
            achievementComponents.push(
                <Pressable key={i} onPress={() => alert("show")}>
                <View style={[globalStyles.gridContainer,{backgroundColor: achievements[i].color, margin: 10, opacity: achievements[i].visibility}]}>
                    <FontAwesome5 name={achievements[i].icon} size={50} color="#FFF" />
                    <View>
                    <Text style={globalStyles.text}>{achievements[i].name}</Text>
                    <Text style={globalStyles.text}>{achievements[i].status}</Text>
                </View>
                </View> 
            </Pressable>
            );
          }
      }
    
    return (
        <View style={[globalStyles.container, {flex: 1}]}>
            {achievementComponents.length === 0 ? <ActivityIndicator/> : achievementComponents}
        </View>
    )
}

export default Achievements

const styles = StyleSheet.create({})