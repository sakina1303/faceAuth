import React, { useRef, useState } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';
import { saveEnrolledImage } from '../utils/faceUtils';
import CustomButton from '../components/CustomButton';

export default function EnrollmentScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedUri, setCapturedUri] = useState(null);
  const cameraRef = useRef(null);
  const isFocused = useIsFocused();

  React.useEffect(() => {
    if (isFocused) {
      setCapturedUri(null);
    }
  }, [isFocused]);

  const takePicture = async () => {
    console.log('Attempting to take picture...');
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        console.log('Picture taken:', photo.uri);
        setCapturedUri(photo.uri);
      } catch (e) {
        console.error('Error taking picture:', e);
        Alert.alert('Error', 'Failed to take picture. Please try restarting the app.');
      }
    } else {
      console.warn('Camera ref is null');
    }
  };

  const handleEnroll = async () => {
    console.log('Enroll button pressed');
    if (capturedUri) {
      try {
        console.log('Saving image...');
        await saveEnrolledImage(capturedUri);
        console.log('Image saved successfully');
        Alert.alert('Enrollment Success', 'Face image enrolled! Go to Authenticate tab to verify.');
        setCapturedUri(null); // Reset for next capture
      } catch (e) {
        console.error('Error enrolling face:', e);
        Alert.alert('Error', 'Failed to enroll face');
      }
    } else {
      console.warn('No captured URI to enroll');
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
      <Text style={styles.title}>Face Enrollment</Text>

      <View style={styles.cameraContainer}>
        {!capturedUri && isFocused ? (
          <CameraView style={styles.camera} ref={cameraRef} facing="front" />
        ) : (
          capturedUri ? <Image source={{ uri: capturedUri }} style={styles.preview} /> : <View style={styles.cameraPlaceholder} />
        )}
        {/* Face Frame Overlay */}
        <View style={styles.overlay}>
          <View style={styles.frame} />
        </View>
      </View>

      <Text style={styles.instructions}>
        {capturedUri ? 'Review your photo below' : 'Center your face in the frame'}
      </Text>

      <View style={styles.buttonContainer}>
        {!capturedUri ? (
          <CustomButton title="Capture Face" onPress={takePicture} type="primary" />
        ) : (
          <View style={styles.actionRow}>
            <CustomButton title="Retake" onPress={() => setCapturedUri(null)} type="secondary" />
            <CustomButton title="Enroll Face" onPress={handleEnroll} type="success" />
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
    borderRadius: 100, // Oval shape
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
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
