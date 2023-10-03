import { StyleSheet, View } from 'react-native'
import React, {useState } from 'react'
import Navbar from '../components/Navbar';
import Account from '../components/Account';
import AddWorkout from './AddWorkout';


const Home: React.FC = () => {
    const [accountContainerStyle, setAccountContainerStyle] = useState(false);

    const toggleAccountVisibility = () => {
        setAccountContainerStyle(!accountContainerStyle);
      };

  return (
    <View style={styles.container}>
        <AddWorkout />
        <Account accountContainerStyle={accountContainerStyle}/>
        <Navbar toggleAccountVisibility={toggleAccountVisibility}/>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: 'green'
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