import { View, Text, Pressable, StyleSheet, Image } from 'react-native'
import React, { useEffect, useState } from 'react' 
import ReactAsyncStorageAPI from '@/services/storage';
import { useRouter } from 'expo-router';

const profile = () => {
    const [userDetails, setUserDetails] = useState({ name: '', email: '' });
  const router = useRouter()

  function handleLogout(){
    ReactAsyncStorageAPI.clear();
    
    router.push("/login");
  }

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await ReactAsyncStorageAPI.get('user');
      if (storedUser) {
        setUserDetails(JSON.parse(storedUser));
      }
    };
    fetchUser();
  }, []);

  return (
    <View>

        <View style={styles.header}>
            <Text style={styles.welcomeText}>
            Welcome, {userDetails.name || 'User'}!
            </Text>
            <Pressable
                onPress={handleLogout}
            >
                <Image
                source={require('../../assets/icons/logout.png')}
                style={styles.menuIcon}
                />
            </Pressable>
        </View>

        <View style={styles.info}>
            <Text>Email: {userDetails.email}</Text>
            <Text>Name: {userDetails.name}</Text>
        </View>
    </View>
  )
}

export default profile;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:"space-between",
    marginBottom: 20,
    padding:10,
    backgroundColor:'#94b281ff'
  },
  menuIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  info: {
    marginTop: 20,
  },
});