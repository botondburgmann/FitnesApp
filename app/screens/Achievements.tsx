import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { globalStyles } from '../assets/styles'
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Achievement, MyUser } from '../types and interfaces/types';
import { getAllUsers, getConsistencyStreakAchievement, getDedicatedAthleteAchievement, getEnduranceMasterAchievement, getStrengthBuilderAchievement } from '../functions/databaseQueries';
import { getClimbingTheRanksAchievement, selectLoggedInUser, selectSimilarUsers, sortUsers } from '../functions/otherFunctions';

const Achievements = ({route}) => {
    const {userID} = route?.params;
    const [loggedInUser, setLoggedInUser] = useState<MyUser>();
    const [users, setUsers] = useState<MyUser[]>([]);

    const [strengthBuilder, setStrengthBuilder] = useState<Achievement>({
        color: "#808080",
        name: "Strength Builder",
        status: "locked",
        visibility: 0.5
    });
    const [enduranceMaster, setEnduranceMaster] = useState<Achievement>({
        color: "#808080",
        name: "Endurance Master",
        status: "locked",
        visibility: 0.5
    });
    const [consistencyStreak, setConsistencyStreak] = useState<Achievement>({
        color: "#808080",
        name: "Consistency Streak",
        status: "locked",
        visibility: 0.5
    });
    const [dedicatedAthlete, setDedicatedAthlete] = useState<Achievement>({
        color: "#808080",
        name: "Dedicated Athlete",
        status: "locked",
        visibility: 0.5
    });
    const [climbingTheRanks, setClimbingTheRanks] = useState<Achievement>({
        color: "#808080",
        name: "Climbing The Ranks",
        status: "locked",
        visibility: 0.5
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
      const unsubscribeFromUsers = getAllUsers((users) => {
        const loggedInUser = selectLoggedInUser(users, userID );
        const similarUsers = selectSimilarUsers(users, loggedInUser);
        const sortedUsers = sortUsers(similarUsers);
        setLoggedInUser(loggedInUser)
        setUsers(sortedUsers);
      })

      return () => {
        unsubscribeFromStrengthBuilder();
        unsubscribeFromEnduranceMaster();
        unsubscribeFromConsistencyStreak();
        unsubscribeFromDedicatedAthlete();
        unsubscribeFromUsers();
      }
    }, [userID])
    
    useEffect(() => {
        if (users.length > 0 && climbingTheRanks.status === "locked") {    
            console.log(climbingTheRanks);
                    
            setClimbingTheRanks(getClimbingTheRanksAchievement(loggedInUser, users))
        }
      
    
    }, [users, loggedInUser])
    
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
        <Pressable onPress={() => alert("show")}>
            <View style={[globalStyles.gridContainer,{backgroundColor: climbingTheRanks.color, margin: 10, opacity: climbingTheRanks.visibility}]}>
            <AntDesign name="star" size={50} color="#FFF" />
            <View>
                <Text style={globalStyles.text}>{climbingTheRanks.name}</Text>
                <Text style={globalStyles.text}>{climbingTheRanks.status}</Text>
            </View>
            </View>
        </Pressable>
        </View>
    )
}

export default Achievements

const styles = StyleSheet.create({})