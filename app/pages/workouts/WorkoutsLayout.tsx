import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddWorkout from "./AddWorkout";
import CurrentExercise from "./CurrentExercise";
import EditSet from "./EditSet";
import Focus from "./Focus";
import Log from "./Log";
import Routines from "./Routines";

const WorkoutsLayout = () => {
  const Stack = createNativeStackNavigator();

    return( 
      <Stack.Navigator>
        <Stack.Screen name="Log" component={Log} options={{ headerShown: false }}/>
        <Stack.Screen name="Add Exercise" component={AddWorkout}  />
        <Stack.Screen name="Edit set" component={EditSet}  />
        <Stack.Screen name="Routines" component={Routines } />
        <Stack.Screen name="Focus" component={Focus }/>
        <Stack.Screen name="Current Exercise" component={CurrentExercise }/>
      </Stack.Navigator>
    )
  }

export default WorkoutsLayout