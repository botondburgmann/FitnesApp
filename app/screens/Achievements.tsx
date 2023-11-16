import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { globalStyles } from '../assets/styles'
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Achievment } from '../types and interfaces/types';
import { getConsistencyStreakAchievement, getDedicatedAthleteAchievement, getEnduranceMasterAchievement, getStrengthBuilderAchievement } from '../functions/databaseQueries';

const Achievements = ({route}) => {
    const {userID} = route?.params;
    const [strengthBuilder, setStrengthBuilder] = useState<Achievment>({
        color: "",
        name: "",
        status: "",
        visibility: 0
    });
    const [enduranceMaster, setEnduranceMaster] = useState<Achievment>({
        color: "",
        name: "",
        status: "",
        visibility: 0
    });
    const [consistencyStreak, setConsistencyStreak] = useState<Achievment>({
        color: "",
        name: "",
        status: "",
        visibility: 0
    });
    const [dedicatedAthlete, setDedicatedAthlete] = useState<Achievment>({
        color: "",
        name: "",
        status: "",
        visibility: 0
    });

    useEffect(() => {
      const unsubscribeFromStrengthBuilder = getStrengthBuilderAchievement(userID, achievement => {
        const newAchievement = {
            color: achievement.color,
            name: achievement.name,
            status: achievement.status,
            visibility: achievement.visibility
        }
        setStrengthBuilder(newAchievement);
      })
      const unsubscribeFromEnduranceMaster = getEnduranceMasterAchievement(userID, achievement => {
        const newAchievement = {
            color: achievement.color,
            name: achievement.name,
            status: achievement.status,
            visibility: achievement.visibility
        }
        setEnduranceMaster(newAchievement);
      })
      const unsubscribeFromConsistencyStreak = getConsistencyStreakAchievement(userID, achievement => {
        const newAchievement = {
            color: achievement.color,
            name: achievement.name,
            status: achievement.status,
            visibility: achievement.visibility
        }
        setConsistencyStreak(newAchievement);
      })
      const unsubscribeFromDedicatedAthlete = getDedicatedAthleteAchievement(userID, achievement => {
        const newAchievement = {
            color: achievement.color,
            name: achievement.name,
            status: achievement.status,
            visibility: achievement.visibility
        }
        setDedicatedAthlete(newAchievement);
      })
      
    
      return () => {
        unsubscribeFromStrengthBuilder();
        unsubscribeFromEnduranceMaster();
        unsubscribeFromConsistencyStreak();
        unsubscribeFromDedicatedAthlete();
      }
    }, [userID])
    

    return (
        <View style={[globalStyles.container, {flex: 1}]}>
        <Pressable onPress={() => alert("show")}>
            <View style={[globalStyles.gridContainer,{backgroundColor: strengthBuilder.color, margin: 10, opacity: strengthBuilder.visibility}]}>
                <Ionicons name="barbell-sharp" size={50} color="#FFF" />
                <View>
                <Text style={globalStyles.text}>{strengthBuilder.name}</Text>
                <Text style={globalStyles.text}>{strengthBuilder.status}</Text>
            </View>
            </View>
        </Pressable>
        <Pressable onPress={() => alert("show")}>
            <View style={[globalStyles.gridContainer,{backgroundColor: enduranceMaster.color, margin: 10, opacity: enduranceMaster.visibility}]}>
                <FontAwesome5 name="running" size={50} color="#FFF" />
                <View>
                <Text style={globalStyles.text}>{enduranceMaster.name}</Text>
                <Text style={globalStyles.text}>{enduranceMaster.status}</Text>
            </View>
            </View>
        </Pressable>
        <Pressable onPress={() => alert("show")}>
            <View style={[globalStyles.gridContainer,{backgroundColor: consistencyStreak.color, margin: 10, opacity: consistencyStreak.visibility}]}>
            <FontAwesome name="calendar" size={50} color="#FFF" />
            <View>
                <Text style={globalStyles.text}>{consistencyStreak.name}</Text>
                <Text style={globalStyles.text}>{consistencyStreak.status}</Text>
            </View>
            </View>
        </Pressable>
        <Pressable onPress={() => alert("show")}>
            <View style={[globalStyles.gridContainer,{backgroundColor: dedicatedAthlete.color, margin: 10, opacity: dedicatedAthlete.visibility}]}>
            <FontAwesome5 name="crown" size={50} color="#FFF" />
            <View>
                <Text style={globalStyles.text}>{dedicatedAthlete.name}</Text>
                <Text style={globalStyles.text}>{dedicatedAthlete.status}</Text>
            </View>
            </View>
        </Pressable>
        </View>
    )
}

export default Achievements

const styles = StyleSheet.create({})