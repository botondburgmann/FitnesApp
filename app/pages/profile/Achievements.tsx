import { ActivityIndicator, ImageBackground, Pressable, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { backgroundImage, globalStyles } from '../../assets/styles'
import { FontAwesome5 } from '@expo/vector-icons';
import { Achievement } from '../../types and interfaces/types';
import Info from '../../components/Info';
import { Unsubscribe } from 'firebase/auth';
import { collection, onSnapshot } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../FirebaseConfig';

const Achievements = ({route}: any) => {
    const {userID} = route?.params;
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loadingAchievements, setLoadingAchievements] = useState(true);
    const [isCustomAlertVisible, setCustomAlertVisible] = useState(false);
    const [title, setTitle] = useState<string>();
    const [information, setInformation] = useState<string>();

    function getAchievementsForUser (userID: string, callback: Function): Unsubscribe  | undefined {
        try {
            const achievements: Achievement[] = [];
    
            const achievementsCollectionRef = collection(FIRESTORE_DB, "Achievements");
            const unsubscribeFromAchievements = onSnapshot(achievementsCollectionRef, achievementsSnapshot => {
                if (!achievementsSnapshot.empty) {
                    achievementsSnapshot.docs.forEach(achievementDoc => {
                        for (const owner of achievementDoc.data().owners) {
                            if (owner.userID === userID) {
                                const achievement = {
                                    color: owner.color,
                                    description: owner.description,
                                    icon: achievementDoc.data().icon,
                                    level: owner.level,
                                    name: achievementDoc.data().name,
                                    status: owner.status,
                                    visibility: owner.visibility
                                };
                                achievements.push(achievement);
                            }
                            
                        }
                    }) 
                    callback(achievements)
                }
            })
            return unsubscribeFromAchievements;
        } catch (error: any) {
            alert(`Error: couldn't fetch achievements for ${userID}: ${error}`);
        }
    };

    function hideCustomAlert () {
        setCustomAlertVisible(false);
    };
    function showCustomAlert (title: React.SetStateAction<string | undefined>, information: React.SetStateAction<string | undefined>) {
        setCustomAlertVisible(true);
        setTitle(title);
        setInformation(information);
    };
    useEffect(() => {
        const unsubscribeFromAchievements = getAchievementsForUser(userID, (achievements: React.SetStateAction<Achievement[]>) => {
            setAchievements(achievements);
            setLoadingAchievements(false);
        })
    
      return () => {
        if (unsubscribeFromAchievements !== undefined)
            unsubscribeFromAchievements();
      }
    }, [userID]);
    
    const achievementComponents = [];

    if (!loadingAchievements) {        
        for (let i = 0; i < achievements.length; i++) {
            achievementComponents.push(
                <View key={i}>
                    <Pressable  onPress={() => showCustomAlert(achievements[i].name,achievements[i].description )}>
                        <View style={[globalStyles.gridContainer,{backgroundColor: achievements[i].color, margin: 10, opacity: achievements[i].visibility}]}>
                            <FontAwesome5 name={achievements[i].icon} size={50} color="#FFF" />
                            <View>
                            <Text style={[globalStyles.text, {fontSize: 20, fontWeight: "600"}]}>{achievements[i].name}</Text>
                            <Text style={[globalStyles.text, {fontSize: 20, fontWeight: "600"}]}>{achievements[i].status}</Text>
                        </View>
                        </View> 
                    </Pressable>
                    <Info
                isVisible={isCustomAlertVisible}
                onClose={hideCustomAlert}
                title={title}
                information={information}
            />
                </View>
            
            );
          }
      }
    
    return (
        <ImageBackground source={backgroundImage} style={globalStyles.image}>
        <View style={[globalStyles.container, {flex: 1,  backgroundColor: 'rgba(128,128,128,0.5)' }]}>
                {achievementComponents.length === 0 ? <ActivityIndicator/> : achievementComponents}
            </View>
        </ImageBackground>
    )
}

export default Achievements
