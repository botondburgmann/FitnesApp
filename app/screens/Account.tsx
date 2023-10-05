import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { FIREBASE_AUTH } from '../../FirebaseConfig'

const Account = ({ accountContainerStyle }) => {
  return (
<       View >
            <Pressable>
                <Text >Profile Settings</Text>
            </Pressable>
            <Pressable >
                <Text onPress={() => FIREBASE_AUTH.signOut()}>Logout</Text>
            </Pressable>
        </View>
  )
}

export default Account

const styles = StyleSheet.create({      

})