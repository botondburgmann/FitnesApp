import { View, Text, Button, TextInput, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { NavigationProp } from '@react-navigation/native';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const Height = ({navigation}: RouterProps) => {
    const [height, setHeight] = useState('');

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
        <Button onPress={() => navigation.navigate('activityLevel')} title="Next"/>
    </View>
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