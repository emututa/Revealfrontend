import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  StyleSheet,
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { X, Zap, Info } from 'lucide-react-native';
import Button from '@/components/ui/Button';
import { scanAPI } from '@/lib/api/scan';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/design';

const { width, height } = Dimensions.get('window');

export default function CameraScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ foodName?: string }>();
  const [permission, requestPermission] = useCameraPermissions();
  const [capturing, setCapturing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, []);

  if (!permission) return (
    <SafeAreaView style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>Initializing camera...</Text>
    </SafeAreaView>
  );

  if (!permission.granted) return (
    <SafeAreaView style={styles.permissionContainer}>
      <View style={styles.permissionIconContainer}>
        <Info size={48} color={colors.primary} />
      </View>
      <Text style={styles.permissionTitle}>Camera Access Needed</Text>
      <Text style={styles.permissionText}>
        We need access to your camera to scan and analyze food labels for you.
      </Text>
      <Button onPress={requestPermission} size="large" style={styles.permissionButton}>
        Grant Camera Access
      </Button>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.cancelText}>Not Now</Text>
      </TouchableOpacity>
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
        Alert.alert('Capture Failed', 'Something went wrong while taking the photo.');
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
      Alert.alert('Analysis Failed', error?.response?.data?.error || error.message || 'We could not analyze that image.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} facing="back">
        <SafeAreaView style={styles.overlay} edges={['top', 'bottom']}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
              <X size={24} color={colors.background} />
            </TouchableOpacity>
            <View style={styles.foodBadge}>
              <Text style={styles.foodBadgeText} numberOfLines={1}>
                Scanning: {params.foodName || 'Food'}
              </Text>
            </View>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.scanFrameContainer}>
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
          </View>

          <View style={styles.bottomSection}>
            <View style={styles.instructions}>
              <Zap size={18} color={colors.primary} />
              <Text style={styles.instructionText}>
                Align ingredient list inside the frame
              </Text>
            </View>

            <View style={styles.captureContainer}>
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
          </View>

          {uploading && (
            <View style={styles.uploadOverlay}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.uploadText}>Analyzing Ingredients...</Text>
            </View>
          )}
        </SafeAreaView>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: colors.background 
  },
  loadingText: { 
    ...typography.body, 
    color: colors.textSecondary,
    marginTop: spacing.md 
  },
  permissionContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: spacing.xl,
    backgroundColor: colors.background
  },
  permissionIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryUltraLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  permissionTitle: { 
    ...typography.h2, 
    color: colors.text, 
    textAlign: 'center',
    marginBottom: spacing.sm
  },
  permissionText: { 
    ...typography.bodyLarge, 
    color: colors.textSecondary, 
    textAlign: 'center', 
    marginBottom: spacing.xxl,
    lineHeight: 24
  },
  permissionButton: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  cancelText: {
    ...typography.body,
    color: colors.textLight,
    fontWeight: '600'
  },
  camera: { flex: 1 },
  overlay: { 
    flex: 1,
    justifyContent: 'space-between'
  },
  topBar: { 
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  closeButton: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  foodBadge: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    maxWidth: width * 0.5,
  },
  foodBadgeText: {
    ...typography.caption,
    color: colors.background,
    fontWeight: '700'
  },
  placeholder: { width: 44 },
  scanFrameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: { 
    width: width * 0.85,
    height: width * 0.85,
    position: 'relative',
  },
  corner: { 
    position: 'absolute', 
    width: 30, 
    height: 30, 
    borderColor: colors.primary,
    borderWidth: 4,
  },
  topLeft: { 
    top: 0, 
    left: 0, 
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderTopLeftRadius: 16 
  },
  topRight: { 
    top: 0, 
    right: 0, 
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopRightRadius: 16 
  },
  bottomLeft: { 
    bottom: 0, 
    left: 0, 
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomLeftRadius: 16 
  },
  bottomRight: { 
    bottom: 0, 
    right: 0, 
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomRightRadius: 16 
  },
  bottomSection: {
    paddingBottom: spacing.xxl,
    alignItems: 'center',
    gap: spacing.xl
  },
  instructions: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: spacing.sm, 
    backgroundColor: 'rgba(0,0,0,0.7)', 
    paddingVertical: spacing.sm, 
    paddingHorizontal: spacing.lg, 
    borderRadius: borderRadius.full,
  },
  instructionText: { 
    ...typography.caption, 
    color: colors.background,
    fontWeight: '600'
  },
  captureContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: { 
    width: 64, 
    height: 64, 
    borderRadius: 32, 
    backgroundColor: colors.background, 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  captureDisabled: { opacity: 0.5 },
  captureInner: { 
    width: 52, 
    height: 52, 
    borderRadius: 26, 
    borderWidth: 2,
    borderColor: colors.primaryUltraLight,
    backgroundColor: colors.primary 
  },
  uploadOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
    zIndex: 10
  },
  uploadText: {
    ...typography.h3,
    color: colors.background,
    fontWeight: '700'
  }
});