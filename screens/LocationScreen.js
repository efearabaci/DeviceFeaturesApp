import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useState } from 'react';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function LocationScreen() {
  const [coords, setCoords] = useState(null);

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Location permission required', 'Please allow location access.');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    setCoords(location.coords);

    // Request notification permission (iOS especially)
    const notifPerm = await Notifications.requestPermissionsAsync();
    if (notifPerm.status !== 'granted') {
      Alert.alert('Notification permission required', 'Cannot show notification without permission.');
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Location Retrieved',
        body: 'Your GPS location was successfully fetched.',
      },
      trigger: null, // immediate
    });
  };

  return (
    <View style={styles.container}>
      <Button title="Get Current Location" onPress={getLocation} />
      {coords && (
        <Text>
          Lat: {coords.latitude}
          {"\n"}
          Lng: {coords.longitude}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    padding: 20,
  },
});
