import { Pressable, Text, View } from 'react-native'
import React, { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';


const Datepicker = (props) => {
  const date = props.date;
  const setDate = props.setDate;

  const [showDate, setShowDate] = useState(false);

    
  const onChange = (selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate) 
    setShowDate(false);  
    };
  
  return (
    <View>
      <Pressable onPress={() => setShowDate(true)}>
        <Text>Calendar icon here</Text>
      </Pressable>
      
      {showDate && (
      <DateTimePicker
        testID="dateTimePicker"
        value={date}
        mode='date'
        onChange={(_event, selectedDate) => onChange(selectedDate)}
      />
      )}
    </View>
  )
}

export default Datepicker

