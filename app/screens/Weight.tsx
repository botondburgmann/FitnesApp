import { View, Text, Button, TextInput, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { NavigationProp } from '@react-navigation/native';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const Weight = ({navigation}: RouterProps) => {
    const [weight, setWeight] = useState('');

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
        <Button onPress={() => navigation.navigate('height')} title="Next"/>
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