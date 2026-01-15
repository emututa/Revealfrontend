





import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera'; // UPDATED IMPORTS
import { X, Zap } from 'lucide-react-native';
import Button from '@/components/ui/Button';
import { scanAPI } from '@/lib/api/scan';
import { colors, spacing, typography, borderRadius } from '@/constants/design';

export default function CameraScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ foodName?: string }>();
  const [permission, requestPermission] = useCameraPermissions(); // FIXED
  const [capturing, setCapturing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const cameraRef = useRef<CameraView>(null); // FIXED TYPE

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, []);

  if (!permission) return (
    <SafeAreaView style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Loading camera...</Text>
    </SafeAreaView>
  );

  if (!permission.granted) return (
    <SafeAreaView style={styles.permissionContainer}>
      <Text style={styles.permissionTitle}>Camera Permission Required</Text>
      <Text style={styles.permissionText}>
        We need access to your camera to scan ingredient labels
      </Text>
      <Button onPress={requestPermission} size="large">Grant Permission</Button>
    </SafeAreaView>
  );

  const takePicture = async () => {
    if (cameraRef.current && !capturing) {
      setCapturing(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({ 
          quality: 0.8, 
          base64: false 
        });
        
        if (photo?.uri) {
          await uploadImage(photo.uri);
        }
      } catch (error) {
        console.error('Capture error:', error);
        Alert.alert('Error', 'Failed to capture image');
      } finally {
        setCapturing(false);
      }
    }
  };

  const uploadImage = async (uri: string) => {
    setUploading(true);
    try {
      const result = await scanAPI.scanWithImage({ 
        image: uri, 
        foodName: params.foodName || 'Unknown Food' 
      });
      
      // Backend returns: foodName, ingredients, isSafe, riskLevel, warnings, explanation
      router.push({
        pathname: '/(scan)/result',
        params: { 
          foodName: result.foodName,
          isSafe: result.isSafe ? '1' : '0',
          riskLevel: result.riskLevel,
          warningIngredients: JSON.stringify(result.warnings),
          analysis: result.explanation,
          imageUri: uri,
          ingredients: result.ingredients
        },
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      Alert.alert('Error', error?.response?.data?.error || error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} facing="back">
        <SafeAreaView style={styles.overlay}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
              <X size={24} color={colors.background} />
            </TouchableOpacity>
          </View>

          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
            <View style={styles.scanLine} />
          </View>

          <View style={styles.instructions}>
            <Zap size={20} color={colors.primary} />
            <Text style={styles.instructionText}>
              Position the ingredient list within the frame
            </Text>
          </View>

          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={[styles.captureButton, (capturing || uploading) && styles.captureDisabled]}
              onPress={takePicture}
              disabled={capturing || uploading}
            >
              {uploading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <View style={styles.captureInner} />
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.text },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { ...typography.body, color: colors.textSecondary },
  permissionContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: spacing.xl, 
    gap: spacing.lg 
  },
  permissionTitle: { ...typography.h3, color: colors.text, textAlign: 'center' },
  permissionText: { 
    ...typography.body, 
    color: colors.textSecondary, 
    textAlign: 'center', 
    marginBottom: spacing.md 
  },
  camera: { flex: 1 },
  overlay: { flex: 1 },
  topBar: { padding: spacing.lg },
  closeButton: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  scanFrame: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: spacing.xl 
  },
  corner: { position: 'absolute', width: 40, height: 40, borderColor: colors.primary },
  topLeft: { 
    top: '20%', 
    left: spacing.xl, 
    borderTopWidth: 4, 
    borderLeftWidth: 4, 
    borderTopLeftRadius: 8 
  },
  topRight: { 
    top: '20%', 
    right: spacing.xl, 
    borderTopWidth: 4, 
    borderRightWidth: 4, 
    borderTopRightRadius: 8 
  },
  bottomLeft: { 
    bottom: '20%', 
    left: spacing.xl, 
    borderBottomWidth: 4, 
    borderLeftWidth: 4, 
    borderBottomLeftRadius: 8 
  },
  bottomRight: { 
    bottom: '20%', 
    right: spacing.xl, 
    borderBottomWidth: 4, 
    borderRightWidth: 4, 
    borderBottomRightRadius: 8 
  },
  scanLine: { width: '80%', height: 2, backgroundColor: colors.primary, opacity: 0.8 },
  instructions: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: spacing.sm, 
    backgroundColor: 'rgba(0,0,0,0.7)', 
    paddingVertical: spacing.md, 
    paddingHorizontal: spacing.lg, 
    marginHorizontal: spacing.xl, 
    borderRadius: borderRadius.md, 
    marginBottom: spacing.xl 
  },
  instructionText: { ...typography.body, color: colors.background },
  bottomBar: { paddingBottom: spacing.xl, alignItems: 'center' },
  captureButton: { 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    backgroundColor: colors.background, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 4, 
    borderColor: colors.primary 
  },
  captureDisabled: { opacity: 0.5 },
  captureInner: { width: 54, height: 54, borderRadius: 27, backgroundColor: colors.primary },
});