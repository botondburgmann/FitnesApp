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


const Height = ({navigation}: RouterProps) => {
  const route = useRoute();
  const [height, setHeight] = useState<string>();
  const {userID} = route.params as RouteParams;

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TextInput 
        keyboardType='numeric'
        value={height}
        style={styles.input} 
        placeholder='Height (kg)' 
        autoCapitalize='none' 
        onChangeText={(text) => setHeight(text)}/>
        
      <Button onPress={() => navigation.navigate('weight')} title="Go back"/>
      <Button onPress={() => {
                              // Set the weight value of the profile                                                            
                              setUpProfile('height', Number(height), userID);
                              // Navigate to the next page (Height)      
                              navigation.navigate('activityLevel');                          
                              }
                      } 
              title="Next"
      />    </View>
  )
}

export default Height

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