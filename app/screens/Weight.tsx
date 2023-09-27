import { View, Button, TextInput, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { NavigationProp, useRoute } from '@react-navigation/native';
import { setUpProfile } from '../functions/databaseQueries';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

interface RouteParams {
  userID: string;
}

const Weight = ({navigation}: RouterProps) => {
  const route = useRoute();
  const [weight, setWeight] = useState<string>();
  const {userID} = route.params as RouteParams;

  
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TextInput 
        keyboardType='numeric'
        value={weight}
        style={styles.input} 
        placeholder='Weight (kg)' 
        autoCapitalize='none' 
        onChangeText={(text) => setWeight(text)}/>
        
      <Button onPress={() => navigation.navigate('age')} title="Go back"/>
      <Button onPress={() => {
                              // Set the weight value of the profile                                                            
                              setUpProfile('weight', Number(weight), userID);
                              // Navigate to the next page (Height)      
                              navigation.navigate('height');                          
                              }
                      } 
              title="Next"
      />
    </View>
  )
}

export default Weight

const styles = StyleSheet.create({
    container: {
      marginHorizontal: 20,
      flex: 1,
      justifyContent: 'center'
    },
    input: {
      marginVertical: 4,
      height: 50,
      borderWidth: 1,
      borderRadius: 4,
      padding: 10,
      backgroundColor: '#fff'
    }
  });