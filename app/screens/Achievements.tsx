import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { globalStyles } from '../assets/styles'
import { Ionicons } from '@expo/vector-icons';
import { Achievment } from '../types and interfaces/types';
import { getStrengthBuilderAchievement } from '../functions/databaseQueries';

const Achievements = ({route}) => {
    const {userID} = route?.params;
    const [strengthBuilder, setStrengthBuilder] = useState<Achievment>({
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
    
      return () => {
        unsubscribeFromStrengthBuilder();
      }
    }, [userID])
    

    return (
        <View style={[globalStyles.container, {flex: 1}]}>
        <Pressable onPress={() => alert("show")}>
            <View style={[globalStyles.gridContainer,{backgroundColor: strengthBuilder.color, marginHorizontal: 10, opacity: strengthBuilder.visibility}]}>
                <Ionicons name="barbell-sharp" size={50} color="white" />
                <View>
                <Text style={globalStyles.text}>{strengthBuilder.name}</Text>
                <Text style={globalStyles.text}>{strengthBuilder.status}</Text>
            </View>
            </View>
        </Pressable>
        </View>
    )
}

export default Achievements

const styles = StyleSheet.create({})