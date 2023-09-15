import { View, Text, Button, TextInput, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { NavigationProp } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const Age = ({navigation}: RouterProps) => {
    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState<any>('date');
    const [show, setShow] = useState(false);
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        setDate(currentDate);
      };

      const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
      };


      const showDatepicker = () => {
        showMode('date');
      };
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button onPress={showDatepicker} title="Show date picker!" />
        <Text>selected: {date.toLocaleDateString()}</Text>
        {show && (
            <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                onChange={onChange}
            />
      )}
        <Button onPress={() => navigation.navigate('weight')} title="Next"/>
    </View>
  )
}

export default Age

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