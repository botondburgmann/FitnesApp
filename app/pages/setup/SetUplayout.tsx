import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ActivityLevel from "./ActivityLevel";
import Birthday from "./Birthday";
import Gender from "./Gender";
import Height from "./Height";
import Weight from "./Weight";
import WorkoutsLayout from "../workouts/WorkoutsLayout";

const SetUpLayout = ()  => {
    const Stack = createNativeStackNavigator();

    return( 
        <Stack.Navigator>
          <Stack.Screen name="Gender" component={Gender} options={{ headerShown: false }}/>
          <Stack.Screen name="Birthday" component={Birthday}  options={{ headerShown: false }}/>
          <Stack.Screen name="Weight" component={Weight}   options={{ headerShown: false }} />
          <Stack.Screen name="Height" component={Height} options={{ headerShown: false }} />
          <Stack.Screen name="Activity level" component={ActivityLevel }options={{ headerShown: false }} />
          <Stack.Screen name="WorkoutsLayout" component={ WorkoutsLayout }  options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

export default SetUpLayout;