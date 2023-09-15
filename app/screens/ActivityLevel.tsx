import { View, Text, Button, TextInput, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { NavigationProp } from '@react-navigation/native';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const ActivityLevel = ({navigation}: RouterProps) => {
    const [height, setHeight] = useState('');

    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
 
            <Button onPress={() => navigation.navigate('height')} title="Go back"/>
            <Button onPress={() => navigation.navigate('home')} title="Complete"/>
    </View>
  )
}

export default ActivityLevel

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