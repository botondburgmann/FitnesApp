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
            
            if (achievementsSnapshot.empty) return;

            achievementsSnapshot.docs.forEach(achievementDoc => {
                const statuses = achievementDoc.data().statuses;
                for (let i = 0; i < statuses.length; i++) {
                    if (statuses[i].userIDs.includes(userID)) {
                        const achievement = {
                            color: achievementDoc.data().colors[i],
                            description: achievementDoc.data().descriptions[i],
                            icon: achievementDoc.data().icon,
                            name: achievementDoc.data().name,
                            status: achievementDoc.data().statuses[i].name,
                            visibility: i === 0 ? 0.5 : 1 as 0.5 | 1
                        };
                        achievements.push(achievement);
                    }
                    
                }
            }) 
            callback(achievements)
            })
            return unsubscribeFromAchievements;
        } catch (error: any) {
            alert(`Error: couldn't fetch achievements for ${userID}: ${error}`);
        }
    };

    function hideCustomAlert (): void {
        setCustomAlertVisible(false);
    };
    function showCustomAlert (title: string, information: string): void {
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
