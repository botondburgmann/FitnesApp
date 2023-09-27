import { Pressable, StyleSheet, Text, View } from 'react-native'

const Navbar = ({toggleAccountVisibility}) => {


  return (

      <View style={styles.navbar}>
            <Pressable style={styles.button}>
                <Text style={styles.text}>Add workout</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={toggleAccountVisibility}>
                <Text style={styles.text}>Account</Text>
            </Pressable>
        </View>

  )
}

export default Navbar

const styles = StyleSheet.create({

    navbar:{
        backgroundColor: 'blue',
        position: 'absolute',
        bottom: 0,
        right: 0,
        zIndex: 1,
        width: '100%',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        flexDirection: 'row'
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
      accountContainerShown:{
        display: 'flex',
        backgroundColor: '#1E2D3E',
        position: 'absolute',
        bottom: 35,
        right: 0,
        zIndex: 1,
        height: '100%',
        width: 200,
        justifyContent: 'flex-end'
      },
      accountContainerHidden:{
        display: 'none',
      }
  });