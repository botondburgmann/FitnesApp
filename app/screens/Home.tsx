import { View, Text, Button } from 'react-native'
import React from 'react'
import { FIREBASE_AUTH } from '../../FirebaseConfig'

const Home = () => {
  return (

<View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>

              <Button onPress={() => FIREBASE_AUTH.signOut()} title="Log out"/>

    </View>
  )
}

export default Home