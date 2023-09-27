import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import BilateralSet from '../components/BilateralSet';
import UnilateralSet from '../components/UnilateralSet';


const AddWorkout = () => {
    const [date, setDate] = useState(new Date());
    const [showDate, setShowDate] = useState(false);

    const [showSelect, setShowSelect] = useState(false);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [exercises, setExercises] = useState([
        {label: 'Bench press', value: 'benchPress'},
        {label: 'Lunge', value: 'lunge'},
      ]);
  
    const onChange = (selectedDate) => {
      const currentDate = selectedDate || date; 
      setDate(currentDate);
      setShowDate(false);
      
    };
    useEffect(() => {
        console.log("Date: ", date);
      }, [date]);

    function handleNewExerciseButtonPress(): void {
        setShowSelect(true)
    }

  return (
    <View style={styles.container}>
      <Text>Select date</Text>
      <Pressable style={styles.button} onPress={() => setShowDate(true)}>
                <Text style={styles.text}>Show date picker!</Text>
        </Pressable>
        {showDate && (
                <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode='date'
                onChange={(event, selectedDate) => onChange(selectedDate)}
                />
            )}
        <Pressable style={styles.button} onPress={handleNewExerciseButtonPress}>
                <Text style={styles.text}>Add new exercise</Text>
        </Pressable>
        {showSelect && (
                              <DropDownPicker
                              open={open}
                              value={value}
                              items={exercises}
                              setOpen={setOpen}
                              setValue={setValue}
                              setItems={setExercises} />
                              )}
                              {value === 'lunge'? 
                                <>
                                    <UnilateralSet />
                                    <Pressable style={styles.button} onPress={()=>{setShowSelect(false); setValue(null)}}>
                                         <Text style={styles.text}>Add</Text>
                                    </Pressable>
                                </>
                              : value === 'benchPress' ?
                                <>
                                    <BilateralSet />
                                    <Pressable style={styles.button} onPress={()=>{setShowSelect(false); setValue(null)}}>
                                        <Text style={styles.text}>Add</Text>
                                    </Pressable>
                                </>
                                : <></>
                                }
    </View>
  )
}

export default AddWorkout

const styles = StyleSheet.create({
    container:{
        backgroundColor: 'coral'
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'lightblue',
        padding: 10,
        width: 100
      },
      text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
      },
})