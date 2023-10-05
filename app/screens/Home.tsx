import { StyleSheet, View, Text } from 'react-native'
import React, {useState } from 'react'
import { NavigationProp, useRoute } from '@react-navigation/native';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

interface RouteParams {
  userID: string;
}


const Home = ({navigation}: RouterProps) => {
  const route = useRoute();
  const {userID} = route.params as RouteParams;
    const [accountContainerStyle, setAccountContainerStyle] = useState(false);

    const toggleAccountVisibility = () => {
        setAccountContainerStyle(!accountContainerStyle);
      };

  return (
    <View style={styles.container}>
      <Text>Home</Text>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
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
  });