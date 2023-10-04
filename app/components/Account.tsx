import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { FIREBASE_AUTH } from '../../FirebaseConfig'

const Account = ({ accountContainerStyle }) => {
  return (
<       View style={ styles.accountContainerShown }>
            <Pressable style={styles.button}>
                <Text style={styles.text}>Profile Settings</Text>
            </Pressable>
            <Pressable style={styles.button}>
                <Text style={styles.text} onPress={() => FIREBASE_AUTH.signOut()}>Logout</Text>
            </Pressable>
        </View>
  )
}

export default Account

const styles = StyleSheet.create({      
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