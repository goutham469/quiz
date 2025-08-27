import AsyncStorage from '@react-native-async-storage/async-storage';

const ReactAsyncStorageAPI = 
{
  set: async (key, value) => 
  {
    try 
    {
      await AsyncStorage.setItem(key, value);
    } 
    catch (error) 
    {
      console.error('Error setting item in AsyncStorage:', error);
    }
  },

  get: async (key) => 
  {
    try 
    {
      const value = await AsyncStorage.getItem(key);
      return value;
    } 
    catch (error) 
    {
      console.error('Error getting item from AsyncStorage:', error);
      return null;
    }
  },

  clear: async (key) => 
  {
    try 
    {
      await AsyncStorage.removeItem(key);
    } 
    catch (error) 
    {
      console.error('Error clearing item from AsyncStorage:', error);
    }
  }
};

export default ReactAsyncStorageAPI;
