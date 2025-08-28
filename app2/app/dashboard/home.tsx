import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const Home = () => 
{
  return (
    <View style={styles.container}>
      <Text style={styles.title}>HOME</Text>
      <Text style={styles.text}>
        Work is going on, developer will fill this place soon with some awesome content. Stay tuned with us.
      </Text>
      <Text style={styles.text}>
        Other functionalities are working cool, try them out!
      </Text>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 5,
  },
})
