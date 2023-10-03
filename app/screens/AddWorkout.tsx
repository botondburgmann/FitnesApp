import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, {useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import BilateralSet from '../components/BilateralSet';
import UnilateralSet from '../components/UnilateralSet';
import { addExercise } from '../functions/databaseQueries';

interface RouteParams {
  userID: string;
}


const AddWorkout = () => {
    const [date, setDate] = useState(new Date());
    const [showDate, setShowDate] = useState(false);

    // For bilateral sets
    const [weight, setWeight] = useState("");
    const [reps, setReps] = useState("");
    const [time, setTime] = useState("");
    const [restTime, setRestTime] = useState("");

    // For unilateral sets
    const [leftWeight, setLeftWeight] = useState("");
    const [leftReps, setLeftReps] = useState("");
    const [leftTime, setLeftTime] = useState("");
    const [leftRestTime, setLeftRestTime] = useState("");
    const [rightWeight, setRightWeight] = useState("");
    const [rightReps, setRightReps] = useState("");
    const [rightTime, setRightTime] = useState("");
    const [rightRestTime  , setRightRestTime] = useState("");

    const [showSelect, setShowSelect] = useState(false);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);


    const [exercises, setExercises] = useState([
        {label: 'Bench press', value: 'Bench Press'},
        {label: 'Lunge', value: 'Lunge'},
      ]);
  
    const onChange = (selectedDate) => {
      const currentDate = selectedDate || date; 
      setDate(currentDate);
      setShowDate(false);
      
    };

    function handleNewExerciseButtonPress(): void {
        setShowSelect(true)
    }

    function addUnilateralSet(exercises: (string | Array<string>), leftWeight: Number, leftReps: Number, leftTime: Number, leftRestTime: Number, 
                                                                  rightWeight: Number, rightReps: Number, rightTime: Number, rightRestTime: Number) {
      setShowSelect(false); 
      setValue(null);
      const sets = {
        "leftWeights" : [leftWeight],
        "leftReps" : [leftReps],
        "leftTime" : [leftTime],
        "leftRestTime" : [leftRestTime],
        "rightWeights" : [rightWeight],
        "rightReps" : [rightReps],
        "rightTime" : [rightTime],
        "rightRestTime" : [rightRestTime]
      }
      addExercise("sdfdfsf", date, exercises, sets);
      setLeftWeight("");
      setLeftReps("");
      setLeftTime("");
      setLeftRestTime("");
      setRightWeight("");
      setRightReps("");
      setRightTime("");
      setRightRestTime("");
    }

    function addBilateralSet(exercises: (string | Array<string>), weight: Number, reps: Number, time: Number, restTime: Number) {
      setShowSelect(false); 
      setValue(null);
      const sets = {
        "weights" : [weight],
        "reps" : [reps],
        "time" : [time],
        "restTime" : [restTime]
      }
      addExercise("sdfdfsf", date, exercises, sets);
      setWeight("");
      setReps("");
      setTime("");
      setRestTime("");
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
      {value === 'Lunge' ? 
        <>
          <UnilateralSet
                        leftWeight={{ leftWeight: leftWeight, setLeftWeight: setLeftWeight }}
                        leftReps={{ leftReps: leftReps, setLeftReps: setLeftReps }}
                        leftTime={{ leftTime: leftTime, setLeftTime: setLeftTime }}
                        leftRestTime={{ leftRestTime: leftRestTime, setLeftRestTime: setLeftRestTime }} 
                        rightWeight={{ rightWeight: rightWeight, setRightWeight: setRightWeight }}
                        rightReps={{ rightReps: rightReps, setRightReps: setRightReps }}
                        rightTime={{ rightTime: rightTime, setTime: setTime }}
                        rightRestTime={{ rightRestTime: rightRestTime, setRightRestTime: setRightRestTime }} 
          />
          <Pressable style={styles.button} onPress={() => addUnilateralSet(value, Number(leftWeight), Number(leftReps), Number(leftTime), Number(leftRestTime),
                                                                            Number(rightWeight), Number(rightReps), Number(rightTime), Number(rightRestTime))}>
            <Text style={styles.text}>Add</Text>
          </Pressable>
        </>
      : value === 'Bench Press' ?
        <>
          <BilateralSet 
            weight={{ weight: weight, setWeight: setWeight }}
            reps={{ reps: reps, setReps: setReps }}
            time={{ time: time, setTime: setTime }}
            restTime={{ restTime: restTime, setRestTime: setRestTime }} 
          />
          <Pressable style={styles.button} onPress={() => addBilateralSet(value, Number(weight), Number(reps), Number(time), Number(restTime))}>
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