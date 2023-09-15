import { View, Text, Button } from 'react-native'
import React from 'react'
import { NavigationProp } from '@react-navigation/native';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const Weight = ({navigation}: RouterProps) => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button onPress={() => navigation.navigate('age')} title="Go back"/>
        <Button onPress={() => navigation.navigate('height')} title="Next"/>
    </View>
  )
}

export default Weight