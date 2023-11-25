import { Pressable, View } from 'react-native'
import React, { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome5 } from '@expo/vector-icons';



const Datepicker = (props: { date: Date; setDate: Function; }) => {
  const date = props.date;
  const setDate = props.setDate;

  const [showDate, setShowDate] = useState(false);

    
  const onChange = (selectedDate: any) => {
    const currentDate = selectedDate || date;
    setDate(currentDate) 
    setShowDate(false);  
    };
  
  return (
    <View style={{marginTop: 50, alignSelf: 'center' }}>
      <Pressable onPress={() => setShowDate(true)}>
        <FontAwesome5 name="calendar-alt" size={50} color={"#fff"} />      
      </Pressable>
      
      {showDate && (
      <DateTimePicker
        testID="dateTimePicker"
        value={date}
        mode='date'
        onChange={(_event: any, selectedDate: any) => onChange(selectedDate)}
      />
      )}
    </View>
  )
}

export default Datepicker

