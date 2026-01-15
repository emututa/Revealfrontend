import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { X } from 'lucide-react-native';

import Button from '@/components/ui/Button';
import { colors, spacing, typography, borderRadius } from '@/constants/design';
import { useUserStore } from '@/lib/stores/userStore';
import { healthAPI } from '@/lib/api/health';

export default function OnboardingStep3() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user, isAuthenticated } = useUserStore();

  const [reactions, setReactions] = useState<{ foodName: string; medicalNotes?: string }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Authentication guard
  useEffect(() => {
    if (!isAuthenticated || !user) {
      Alert.alert('Authentication Required', 'Please log in to continue.', [
        { text: 'OK', onPress: () => router.replace('/(auth)/login') },
      ]);
    }
  }, [isAuthenticated, user]);

  const addReaction = () => {
    const value = inputValue.trim();
    if (value && !reactions.some(r => r.foodName === value)) {
      setReactions(prev => [...prev, { foodName: value, medicalNotes }]);
      setInputValue('');
    }
  };

  const removeReaction = (index: number) => {
    setReactions(prev => prev.filter((_, i) => i !== index));
  };

  const handleComplete = async () => {
    setIsSubmitting(true);

    try {
      // Save reactions to backend
      if (reactions.length > 0) {
        await healthAPI.updateReactions(reactions);
      } else if (medicalNotes) {
        await healthAPI.updateReactions([{ foodName: 'General', medicalNotes }]);
      }

      Alert.alert('Success!', 'Your health profile has been saved.', [
        { text: 'Continue', onPress: () => router.replace('/(tabs)') },
      ]);
    } catch (error: any) {
      console.error('Error saving food reactions:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to save food reactions. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated || !user) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.stepText}>Step 3 of 3</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Past Reactions & Notes</Text>
          <Text style={styles.subtitle}>
            Tell us about any foods that caused reactions and add medical notes if needed.
          </Text>

          <Text style={styles.sectionTitle}>Foods That Caused Reactions</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="e.g., shellfish, strawberries"
              editable={!isSubmitting}
              onSubmitEditing={addReaction}
            />
            <Button
              onPress={addReaction}
              variant="outline"
              style={styles.addButton}
              disabled={isSubmitting}
            >
              Add
            </Button>
          </View>

          <View style={styles.tagsContainer}>
            {reactions.map((r, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{r.foodName}</Text>
                <TouchableOpacity onPress={() => removeReaction(index)} disabled={isSubmitting}>
                  <X size={16} color={colors.text} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Additional Medical Notes</Text>
          <TextInput
            style={styles.textArea}
            value={medicalNotes}
            onChangeText={setMedicalNotes}
            placeholder="Any other medical information..."
            multiline
            editable={!isSubmitting}
            placeholderTextColor={colors.textLight}
          />
        </View>

        <View style={styles.footer}>
          <Button
            onPress={() => router.back()}
            variant="ghost"
            size="large"
            style={styles.backButton}
            disabled={isSubmitting}
          >
            Back
          </Button>
          <Button
            onPress={handleComplete}
            size="medium"
            style={styles.completeButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? <ActivityIndicator color="#FFFFFF" size="small" /> : 'Complete'}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.borderLight,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    width: '100%',
  },
  stepText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 24,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.sm,
    fontSize: 18,
  },
  inputContainer: {
    flexDirection: 'column',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  textInput: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.md,
    color: colors.text,
  },
  addButton: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundTertiary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  tagText: {
    ...typography.body,
    color: colors.text,
  },
  textArea: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.md,
    color: colors.text,
    minHeight: 120,
    marginBottom: spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  backButton: {
    flex: 1,
  },
  completeButton: {
    flex: 2,
  },
});







// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import { X } from 'lucide-react-native';
// import Button from '@/components/ui/Button';
// import Input from '@/components/ui/Input';
// import { colors, spacing, typography, borderRadius } from '@/constants/design';
// import { healthAPI, FoodReactionBackend } from '@/lib/api/health';
// import { useUserStore } from '@/lib/stores/userStore';

// export default function OnboardingStep3() {
//   const router = useRouter();
//   const params = useLocalSearchParams();
//   const { user, isAuthenticated } = useUserStore();
//   const [pastReactions, setPastReactions] = useState<string[]>([]);
//   const [medicalNotes, setMedicalNotes] = useState('');
//   const [inputValue, setInputValue] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Check if user is authenticated when component mounts
//   useEffect(() => {
//     if (!isAuthenticated || !user) {
//       Alert.alert(
//         'Authentication Required',
//         'Please log in to continue with onboarding.',
//         [
//           {
//             text: 'OK',
//             onPress: () => router.replace('/(auth)/login')
//           }
//         ]
//       );
//     }
//   }, [isAuthenticated, user]);

//   const addReaction = () => {
//     if (inputValue.trim()) {
//       setPastReactions([...pastReactions, inputValue.trim()]);
//       setInputValue('');
//     }
//   };

//   const removeReaction = (index: number) => {
//     setPastReactions(pastReactions.filter((_, i) => i !== index));
//   };

//   const handleComplete = async () => {
//     if (!user?.id) {
//       Alert.alert('Error', 'User not authenticated. Please log in again.');
//       router.replace('/(auth)/login');
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       // Parse data from previous steps
//       const complications = params.complications 
//         ? JSON.parse(params.complications as string) 
//         : [];
//       const allergies = params.allergies 
//         ? JSON.parse(params.allergies as string) 
//         : [];

//       // Save health conditions
//       if (complications.length > 0) {
//         await healthAPI.updateConditions(complications);
//       }

//       // Save allergies
//       if (allergies.length > 0) {
//         await healthAPI.updateAllergies(allergies);
//       }

//       // Save past reactions with medical notes
//       if (pastReactions.length > 0) {
//         const reactions: FoodReactionBackend[] = pastReactions.map((r: string) => ({
//           foodName: r,
//           medicalNotes: medicalNotes
//         }));
        
//         await healthAPI.updateReactions(reactions);
//       } else if (medicalNotes) {
//         // If there are medical notes but no reactions
//         const reactions: FoodReactionBackend[] = [{
//           foodName: 'General',
//           medicalNotes: medicalNotes
//         }];
//         await healthAPI.updateReactions(reactions);
//       }

//       // Success!
//       Alert.alert(
//         'Success!',
//         'Your health profile has been saved.',
//         [
//           {
//             text: 'Continue',
//             onPress: () => router.replace('/(tabs)')
//           }
//         ]
//       );
//     } catch (err: any) {
//       console.error('Error saving health data:', err);
//       Alert.alert(
//         'Error',
//         err.response?.data?.message || 'Failed to save health data. Please try again.',
//         [{ text: 'OK' }]
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Don't render if not authenticated
//   if (!isAuthenticated || !user) {
//     return null;
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         <View style={styles.header}>
//           <View style={styles.progressBar}>
//             <View style={[styles.progressFill, { width: '100%' }]} />
//           </View>
//           <Text style={styles.stepText}>Step 3 of 3</Text>
//         </View>

//         <View style={styles.content}>
//           <Text style={styles.title}>Past Reactions & Notes</Text>
//           <Text style={styles.subtitle}>
//             Tell us about any foods that have caused reactions in the past, and any additional medical notes.
//           </Text>

//           <Text style={styles.sectionTitle}>Foods That Caused Reactions</Text>
//           <View style={styles.inputContainer}>
//             <Input
//               value={inputValue}
//               onChangeText={setInputValue}
//               placeholder="e.g., shellfish, strawberries"
//               onSubmitEditing={addReaction}
//               style={styles.textArea}
//               editable={!isSubmitting}
//             />
//             <Button 
//               onPress={addReaction} 
//               variant="outline" 
//               style={styles.addButton}
//               disabled={isSubmitting}
//             >
//               Add
//             </Button>
//           </View>

//           <View style={styles.tagsContainer}>
//             {pastReactions.map((reaction, index) => (
//               <View key={index} style={styles.tag}>
//                 <Text style={styles.tagText}>{reaction}</Text>
//                 <TouchableOpacity 
//                   onPress={() => removeReaction(index)}
//                   disabled={isSubmitting}
//                 >
//                   <X size={16} color={colors.text} />
//                 </TouchableOpacity>
//               </View>
//             ))}
//           </View>

//           <Text style={styles.sectionTitle}>Additional Medical Notes</Text>
//           <View style={styles.textAreaContainer}>
//             <TextInput
//               style={styles.textAreaInput}
//               value={medicalNotes}
//               onChangeText={setMedicalNotes}
//               placeholder="Any other medical information we should know..."
//               multiline
//               numberOfLines={6}
//               textAlignVertical="top"
//               placeholderTextColor={colors.textLight}
//               editable={!isSubmitting}
//             />
//           </View>
//         </View>

//         <View style={styles.footer}>
//           <Button
//             onPress={() => router.back()}
//             variant="ghost"
//             size="large"
//             style={styles.backButton}
//             disabled={isSubmitting}
//           >
//             Back
//           </Button>
//           <Button
//             onPress={handleComplete}
//             size="medium"
//             style={styles.completeButton}
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? (
//               <ActivityIndicator color="#FFFFFF" size="small" />
//             ) : (
//               'Complete'
//             )}
//           </Button>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background,
//   },
//   scrollContent: {
//     flexGrow: 1,
//     paddingHorizontal: spacing.xl,
//     paddingVertical: spacing.lg,
//   },
//   header: {
//     marginBottom: spacing.xl,
//   },
//   progressBar: {
//     height: 4,
//     backgroundColor: colors.borderLight,
//     borderRadius: borderRadius.sm,
//     marginBottom: spacing.sm,
//   },
//   progressFill: {
//     height: '100%',
//     backgroundColor: colors.primary,
//     borderRadius: borderRadius.sm,
//   },
//   stepText: {
//     ...typography.caption,
//     color: colors.textSecondary,
//   },
//   content: {
//     flex: 1,
//   },
//   title: {
//     ...typography.h2,
//     color: colors.text,
//     marginBottom: spacing.sm,
//   },
//   subtitle: {
//     ...typography.body,
//     color: colors.textSecondary,
//     marginBottom: spacing.xl,
//     lineHeight: 24,
//   },
//   sectionTitle: {
//     ...typography.h4,
//     fontSize: 18,
//     color: colors.text,
//     marginBottom: spacing.md,
//   },
//   inputContainer: {
//     flexDirection: "column",
//     gap: spacing.sm,
//     marginBottom: spacing.lg,
//   },
//   addButton: {
//     paddingHorizontal: spacing.lg,
//   },
//   tagsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: spacing.sm,
//     marginBottom: spacing.lg,
//   },
//   tag: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: colors.backgroundTertiary,
//     paddingVertical: spacing.sm,
//     paddingHorizontal: spacing.md,
//     borderRadius: borderRadius.md,
//     gap: spacing.sm,
//     borderWidth: 1,
//     borderColor: colors.primary,
//   },
//   tagText: {
//     ...typography.body,
//     color: colors.text,
//   },
//   textAreaContainer: {
//     backgroundColor: colors.background,
//     borderWidth: 1.5,
//     borderColor: colors.border,
//     borderRadius: borderRadius.md,
//     padding: spacing.md,
//   },
//   textArea: {
//     minHeight: 30,
//     maxHeight: 150,
//     textAlignVertical: "top",
//     paddingTop: spacing.md,
//   },
//   textAreaInput: {
//     ...typography.body,
//     color: colors.text,
//     minHeight: 120,
//   },
//   footer: {
//     flexDirection: 'row',
//     gap: spacing.md,
//     marginTop: spacing.md,
//   },
//   backButton: {
//     flex: 1,
//   },
//   completeButton: {
//     flex: 2,
//   },
// });











// import React, { useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import { X } from 'lucide-react-native';
// import Button from '@/components/ui/Button';
// import Input from '@/components/ui/Input';
// import { colors, spacing, typography, borderRadius } from '@/constants/design';

// export default function OnboardingStep3() {
//   const router = useRouter();
//   const params = useLocalSearchParams();
//   const [pastReactions, setPastReactions] = useState<string[]>([]);
//   const [medicalNotes, setMedicalNotes] = useState('');
//   const [inputValue, setInputValue] = useState('');

//   const addReaction = () => {
//     if (inputValue.trim()) {
//       setPastReactions([...pastReactions, inputValue.trim()]);
//       setInputValue('');
//     }
//   };

//   const removeReaction = (index: number) => {
//     setPastReactions(pastReactions.filter((_, i) => i !== index));
//   };

//   const handleComplete = () => {
//     router.push({
//       pathname: '/(onboarding)/complete',
//       params: {
//         complications: params.complications,
//         allergies: params.allergies,
//         pastReactions: JSON.stringify(pastReactions),
//         medicalNotes
//       }
//     });
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         <View style={styles.header}>
//           <View style={styles.progressBar}>
//             <View style={[styles.progressFill, { width: '100%' }]} />
//           </View>
//           <Text style={styles.stepText}>Step 3 of 3</Text>
//         </View>

//         <View style={styles.content}>
//           <Text style={styles.title}>Past Reactions & Notes</Text>
//           <Text style={styles.subtitle}>
//             Tell us about any foods that have caused reactions in the past, and any additional medical notes.
//           </Text>

//           <Text style={styles.sectionTitle}>Foods That Caused Reactions</Text>
//           <View style={styles.inputContainer}>
//             <Input
//               value={inputValue}
//               onChangeText={setInputValue}
//               placeholder="e.g., shellfish, strawberries"
//               onSubmitEditing={addReaction}
//               style={styles.textArea}
//             />
//             <Button onPress={addReaction} variant="outline" style={styles.addButton}>
//               Add
//             </Button>
//           </View>

//           <View style={styles.tagsContainer}>
//             {pastReactions.map((reaction, index) => (
//               <View key={index} style={styles.tag}>
//                 <Text style={styles.tagText}>{reaction}</Text>
//                 <TouchableOpacity onPress={() => removeReaction(index)}>
//                   <X size={16} color={colors.text} />
//                 </TouchableOpacity>
//               </View>
//             ))}
//           </View>

//           <Text style={styles.sectionTitle}>Additional Medical Notes</Text>
//           <View style={styles.textAreaContainer}>
//             <TextInput
//               style={styles.textArea}
//               value={medicalNotes}
//               onChangeText={setMedicalNotes}
//               placeholder="Any other medical information we should know..."
//               multiline
//               numberOfLines={6}
//               textAlignVertical="top"
//               placeholderTextColor={colors.textLight}
//             />
//           </View>
//         </View>

//         <View style={styles.footer}>
//           <Button
//             onPress={() => router.back()}
//             variant="ghost"
//             size="large"
//             style={styles.backButton}
//           >
//             Back
//           </Button>
//           {/* <Button
//             onPress={handleComplete}
//             size="medium"
//             style={styles.completeButton}
//           >
//             Complete
//           </Button> */}

//              <Button
//               onPress={handleComplete}
//               size="medium"
//               style={styles.completeButton}
//             >
//                 Complete
//             </Button>
          


//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background,
//   },
//   scrollContent: {
//     flexGrow: 1,
//     paddingHorizontal: spacing.xl,
//     paddingVertical: spacing.lg,
//   },
//   header: {
//     marginBottom: spacing.xl,
//   },
//   progressBar: {
//     height: 4,
//     backgroundColor: colors.borderLight,
//     borderRadius: borderRadius.sm,
//     marginBottom: spacing.sm,
//   },
//   progressFill: {
//     height: '100%',
//     backgroundColor: colors.primary,
//     borderRadius: borderRadius.sm,
//   },
//   stepText: {
//     ...typography.caption,
//     color: colors.textSecondary,
//   },
//   content: {
//     flex: 1,
//   },
//   title: {
//     ...typography.h2,
//     color: colors.text,
//     marginBottom: spacing.sm,
//   },
//   subtitle: {
//     ...typography.body,
//     color: colors.textSecondary,
//     marginBottom: spacing.xl,
//     lineHeight: 24,
//   },
//   sectionTitle: {
//     ...typography.h4,
//      fontSize: 18,
//     color: colors.text,
//     marginBottom: spacing.md,
//     // marginTop: spacing.xs,
//   },
//   inputContainer: {
//     flexDirection: "column",
//     gap: spacing.sm,
//     marginBottom: spacing.lg,
//     // flexDirection: 'row',
//     // gap: spacing.sm,
//     // alignItems: 'flex-end',
//     // marginBottom: spacing.lg,
//   },
//   addButton: {
//     // marginBottom: spacing.xs,
//     paddingHorizontal: spacing.lg,
//   },
//   tagsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: spacing.sm,
//     marginBottom: spacing.lg,
//   },
//   tag: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: colors.backgroundTertiary,
//     paddingVertical: spacing.sm,
//     paddingHorizontal: spacing.md,
//     borderRadius: borderRadius.md,
//     gap: spacing.sm,
//     borderWidth: 1,
//     borderColor: colors.primary,
//   },
//   tagText: {
//     ...typography.body,
//     color: colors.text,
//   },
//   textAreaContainer: {
//     backgroundColor: colors.background,
//     borderWidth: 1.5,
//     borderColor: colors.border,
//     borderRadius: borderRadius.md,
//     padding: spacing.md,
//   },
  
//     // ...typography.body,
//     // color: colors.text,
//     // minHeight: 120,
//      textArea: {
//     minHeight: 30,
//     maxHeight: 150,
//     textAlignVertical: "top",
//     paddingTop: spacing.md,
//   },
  
//   footer: {
//     flexDirection: 'row',
//     gap: spacing.md,
//     marginTop: spacing.md,
//   },
//   backButton: {
//     flex: 1,
//   },
//   completeButton: {
//     flex: 2,
//   },
// });
