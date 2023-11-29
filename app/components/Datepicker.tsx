import { Pressable, View } from 'react-native'
import React, { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome5 } from '@expo/vector-icons';



const Datepicker = (props: { date: Date; setDate: Function; }) => {
  const date = props.date;
  const setDate = props.setDate;

  const [showDate, setShowDate] = useState(false);

    
  const onDateChange = (selectedDate: Date, previousDate: Date, setDate: Function, setShowDate: Function): void => {
    try {
      const currentDate = selectedDate || previousDate;
      setDate(currentDate) 
      setShowDate(false); 
    } catch (error: any) {
      alert(`Error: Couldn't change date: ${error}`);
    } 
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
        onChange={(_event: any, selectedDate: any) => onDateChange(selectedDate, date, setDate, setShowDate)}
      />
      )}
    </View>
  )
}

export default Datepicker

