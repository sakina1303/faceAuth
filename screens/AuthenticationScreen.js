import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';
import { getEnrolledImageUri, compareFaces } from '../utils/faceUtils';
import CustomButton from '../components/CustomButton';

export default function AuthenticationScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedUri, setCapturedUri] = useState(null);
  const [enrolledUri, setEnrolledUri] = useState(null);
  const cameraRef = useRef(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setCapturedUri(null); // Reset captured image when entering screen
      (async () => {
        try {
          const uri = await getEnrolledImageUri();
          console.log('Enrolled URI from storage:', uri);
          setEnrolledUri(uri);
        } catch (e) {
          console.error('Error fetching enrolled image:', e);
        }
      })();
    }
  }, [isFocused]);

  const takePicture = async () => {
    console.log('Auth: Taking picture...');
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        console.log('Auth: Picture taken:', photo.uri);
        setCapturedUri(photo.uri);
      } catch (e) {
        console.error('Auth: Error taking picture:', e);
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const handleAuthenticate = async () => {
    console.log('Auth: Authenticate pressed');
    if (capturedUri && enrolledUri) {
      try {
        console.log('Auth: Comparing faces...');
        const match = await compareFaces(enrolledUri, capturedUri);
        console.log('Auth: Match result:', match);
        // Store result in navigation params for Result tab
        navigation.navigate('Result', { success: match });
      } catch (e) {
        console.error('Auth: Error during authentication:', e);
        Alert.alert('Error', 'Authentication process failed');
      }
    } else {
      console.warn('Auth: Missing images. Enrolled:', enrolledUri, 'Captured:', capturedUri);
      Alert.alert('Error', 'No enrolled face found. Please enroll first in Submit Picture tab.');
    }
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View style={styles.center}><Text>Loading...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={{ textAlign: 'center', marginBottom: 10 }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Face Verification</Text>

      <View style={styles.cameraContainer}>
        {!capturedUri && isFocused ? (
          <CameraView style={styles.camera} ref={cameraRef} facing="front" />
        ) : (
          capturedUri ? <Image source={{ uri: capturedUri }} style={styles.preview} /> : <View style={styles.cameraPlaceholder} />
        )}
        <View style={styles.overlay}>
          <View style={styles.frame} />
        </View>
      </View>

      <Text style={styles.instructions}>
        {capturedUri ? 'Processing...' : 'Align your face to verify'}
      </Text>

      <View style={styles.buttonContainer}>
        {!capturedUri ? (
          <CustomButton title="Scan Face" onPress={takePicture} type="primary" />
        ) : (
          <View style={styles.actionRow}>
            <CustomButton title="Retry" onPress={() => setCapturedUri(null)} type="secondary" />
            <CustomButton title="Verify" onPress={handleAuthenticate} type="primary" />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  cameraContainer: {
    width: 280,
    height: 380,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    backgroundColor: '#fff',
    position: 'relative',
  },
  camera: {
    width: '100%',
    height: '100%'
  },
  preview: {
    width: '100%',
    height: '100%'
  },
  cameraPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2C3E50',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    width: 200,
    height: 280,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'rgba(74, 144, 226, 0.6)', // Blue tint for auth
    borderStyle: 'dashed',
  },
  instructions: {
    marginTop: 24,
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    fontWeight: '500',
  },
  buttonContainer: {
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
});
