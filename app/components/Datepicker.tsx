import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';


const Datepicker = (props) => {
    const [date, setDate] = useState(new Date());
    const [showDate, setShowDate] = useState(false);

    
    const onChange = (selectedDate) => {
        const currentDate = selectedDate || props.date;
        props.changeDate(currentDate) 
        setShowDate(false);
        
      };
  return (
    <View>
      <Text>Select date</Text>
      <Pressable onPress={() => setShowDate(true)}>
        <Text>Show date picker!</Text>
      </Pressable>
      {showDate && (
      <DateTimePicker
        testID="dateTimePicker"
        value={props.date}
        mode='date'
        onChange={(event, selectedDate) => onChange(selectedDate)}
      />
      )}
    </View>
  )
}

export default Datepicker

const styles = StyleSheet.create({})