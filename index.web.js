import React, { Component } from 'react'
import { AppRegistry, StyleSheet, Text, View } from 'react-native'

class REAL extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#142a3d',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
  },
})

AppRegistry.registerComponent('REAL', () => REAL)
AppRegistry.runApplication('REAL', { rootTag: document.getElementById('react-native-app') })
