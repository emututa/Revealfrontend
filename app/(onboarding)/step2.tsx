import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { X } from 'lucide-react-native';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { colors, spacing, typography, borderRadius } from '@/constants/design';
import { useUserStore } from '@/lib/stores/userStore';
import { healthAPI } from '@/lib/api/health';

export default function OnboardingStep2() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user, isAuthenticated } = useUserStore();

  const [allergies, setAllergies] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  const commonAllergies = ['Peanuts', 'Tree Nuts', 'Milk', 'Eggs', 'Wheat', 'Soy', 'Fish'];

  // Authentication guard
  useEffect(() => {
    if (!isAuthenticated || !user) {
      Alert.alert('Authentication Required', 'Please log in to continue with onboarding.', [
        {
          text: 'OK',
          onPress: () => router.replace('/(auth)/login'),
        },
      ]);
    }
  }, [isAuthenticated, user]);

  const addAllergy = (allergy: string) => {
    if (!allergies.includes(allergy)) {
      setAllergies((prev) => [...prev, allergy]);
    }
  };

  const addCustomAllergy = () => {
    const value = inputValue.trim();
    if (value && !allergies.includes(value)) {
      setAllergies((prev) => [...prev, value]);
      setInputValue('');
    }
  };

  const removeAllergy = (allergy: string) => {
    setAllergies((prev) => prev.filter((a) => a !== allergy));
  };

  const handleNext = async () => {
    try {
      // Save allergies to backend
      await healthAPI.updateAllergies(allergies);

      router.push({
        pathname: '/(onboarding)/step3',
        params: {
          complications: params.complications,
          allergies: JSON.stringify(allergies),
        },
      });
    } catch (error) {
      console.error('Allergies save failed:', error);
      Alert.alert('Save Failed', 'We could not save your allergies. Please try again.');
    }
  };

  if (!isAuthenticated || !user) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '66%' }]} />
          </View>
          <Text style={styles.stepText}>Step 2 of 3</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Food Allergies</Text>
          <Text style={styles.subtitle}>Select any foods you're allergic to.</Text>

          <Text style={styles.sectionTitle}>Common Allergies</Text>
          <View style={styles.commonAllergies}>
            {commonAllergies.map((allergy) => (
              <TouchableOpacity
                key={allergy}
                onPress={() => addAllergy(allergy)}
                style={[
                  styles.allergyChip,
                  allergies.includes(allergy) && styles.allergyChipSelected,
                ]}
              >
                <Text
                  style={[
                    styles.allergyChipText,
                    allergies.includes(allergy) && styles.allergyChipTextSelected,
                  ]}
                >
                  {allergy}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Add Custom Allergy</Text>
          <View style={styles.inputContainer}>
            <Input
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="Type an allergy and press Add"
              onSubmitEditing={addCustomAllergy}
              style={styles.textArea}
            />
            <Button onPress={addCustomAllergy} variant="outline" style={styles.addButton}>
              Add
            </Button>
          </View>

          <Text style={styles.sectionTitle}>Your Allergies ({allergies.length})</Text>
          <View style={styles.tagsContainer}>
            {allergies.map((allergy, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{allergy}</Text>
                <TouchableOpacity onPress={() => removeAllergy(allergy)}>
                  <X size={16} color={colors.text} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {allergies.length === 0 && <Text style={styles.emptyText}>No allergies added yet</Text>}
        </View>

        <View style={styles.footer}>
          <Button onPress={() => router.back()} variant="ghost" size="medium" style={styles.backButton}>
            Back
          </Button>
          <Button onPress={handleNext} size="medium" style={styles.nextButton}>
            Next
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
    marginBottom: spacing.sm,
    lineHeight: 24,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  commonAllergies: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  allergyChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  allergyChipSelected: {
    backgroundColor: colors.backgroundTertiary,
    borderColor: colors.primary,
  },
  allergyChipText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  allergyChipTextSelected: {
    color: colors.text,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'column',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  textArea: {
    minHeight: 30,
    maxHeight: 150,
    textAlignVertical: 'top',
    paddingTop: spacing.md,
  },
  addButton: {
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
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
  emptyText: {
    ...typography.body,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
});






// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import { X } from 'lucide-react-native';
// import Button from '@/components/ui/Button';
// import Input from '@/components/ui/Input';
// import { colors, spacing, typography, borderRadius } from '@/constants/design';
// import { useUserStore } from '@/lib/stores/userStore';

// export default function OnboardingStep2() {
//   const router = useRouter();
//   const params = useLocalSearchParams();
//   const { user, isAuthenticated } = useUserStore();
//   const [allergies, setAllergies] = useState<string[]>([]);
//   const [inputValue, setInputValue] = useState('');

//   const commonAllergies = ['Peanuts', 'Tree Nuts', 'Milk', 'Eggs', 'Wheat', 'Soy', 'Fish'];

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

//   const addAllergy = (allergy: string) => {
//     if (!allergies.includes(allergy)) {
//       setAllergies([...allergies, allergy]);
//     }
//   };

//   const addCustomAllergy = () => {
//     if (inputValue.trim() && !allergies.includes(inputValue.trim())) {
//       setAllergies([...allergies, inputValue.trim()]);
//       setInputValue('');
//     }
//   };

//   const removeAllergy = (allergy: string) => {
//     setAllergies(allergies.filter(a => a !== allergy));
//   };

//   const handleNext = () => {
//     router.push({
//       pathname: '/(onboarding)/step3',
//       params: {
//         complications: params.complications,
//         allergies: JSON.stringify(allergies)
//       }
//     });
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
//             <View style={[styles.progressFill, { width: '66%' }]} />
//           </View>
//           <Text style={styles.stepText}>Step 2 of 3</Text>
//         </View>

//         <View style={styles.content}>
//           <Text style={styles.title}>Food Allergies</Text>
//           <Text style={styles.subtitle}>
//             Select any foods you're allergic to. 
//           </Text>

//           <Text style={styles.sectionTitle}>Common Allergies</Text>
//           <View style={styles.commonAllergies}>
//             {commonAllergies.map((allergy) => (
//               <TouchableOpacity
//                 key={allergy}
//                 onPress={() => addAllergy(allergy)}
//                 style={[
//                   styles.allergyChip,
//                   allergies.includes(allergy) && styles.allergyChipSelected
//                 ]}
//               >
//                 <Text
//                   style={[
//                     styles.allergyChipText,
//                     allergies.includes(allergy) && styles.allergyChipTextSelected
//                   ]}
//                 >
//                   {allergy}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           <Text style={styles.sectionTitle}>Add Custom Allergy</Text>
//           <View style={styles.inputContainer}>
//             <Input
//               value={inputValue}
//               onChangeText={setInputValue}
//               placeholder="Type an allergy and press Add"
//               onSubmitEditing={addCustomAllergy}
//               style={styles.textArea}
//             />
//             <Button onPress={addCustomAllergy} variant="outline" style={styles.addButton}>
//               Add
//             </Button>
//           </View>

//           <Text style={styles.sectionTitle}>Your Allergies ({allergies.length})</Text>
//           <View style={styles.tagsContainer}>
//             {allergies.map((allergy, index) => (
//               <View key={index} style={styles.tag}>
//                 <Text style={styles.tagText}>{allergy}</Text>
//                 <TouchableOpacity onPress={() => removeAllergy(allergy)}>
//                   <X size={16} color={colors.text} />
//                 </TouchableOpacity>
//               </View>
//             ))}
//           </View>

//           {allergies.length === 0 && (
//             <Text style={styles.emptyText}>No allergies added yet</Text>
//           )}
//         </View>

//         <View style={styles.footer}>
//           <Button
//             onPress={() => router.back()}
//             variant="ghost"
//             size="medium"
//             style={styles.backButton}
//           >
//             Back
//           </Button>
//           <Button
//             onPress={handleNext}
//             size="medium"
//             style={styles.nextButton}
//           >
//             Next
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
//   textArea: {
//     minHeight: 30,
//     maxHeight: 150,
//     textAlignVertical: "top",
//     paddingTop: spacing.md,
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
//     marginBottom: spacing.sm,
//     lineHeight: 24,
//   },
//   sectionTitle: {
//     ...typography.h4,
//     color: colors.text,
//     marginBottom: spacing.sm,
//     marginTop: spacing.xs,
//   },
//   commonAllergies: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: spacing.sm,
//     marginBottom: spacing.lg,
//   },
//   allergyChip: {
//     paddingVertical: spacing.sm,
//     paddingHorizontal: spacing.md,
//     borderRadius: borderRadius.md,
//     backgroundColor: colors.backgroundSecondary,
//     borderWidth: 1.5,
//     borderColor: colors.border,
//   },
//   allergyChipSelected: {
//     backgroundColor: colors.backgroundTertiary,
//     borderColor: colors.primary,
//   },
//   allergyChipText: {
//     ...typography.body,
//     color: colors.textSecondary,
//   },
//   allergyChipTextSelected: {
//     color: colors.text,
//     fontWeight: '600',
//   },
//   inputContainer: {
//     flexDirection: "column",
//     gap: spacing.sm,
//     marginBottom: spacing.lg,
//   },
//   addButton: {
//     marginBottom: spacing.md,
//     paddingHorizontal: spacing.lg,
//   },
//   tagsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: spacing.sm,
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
//   emptyText: {
//     ...typography.body,
//     color: colors.textLight,
//     textAlign: 'center',
//     marginTop: spacing.xl,
//   },
//   footer: {
//     flexDirection: 'row',
//     gap: spacing.md,
//     marginTop: spacing.md,
//   },
//   backButton: {
//     flex: 1,
//   },
//   nextButton: {
//     flex: 2,
//   },
// });











// import React, { useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import { X } from 'lucide-react-native';
// import Button from '@/components/ui/Button';
// import Input from '@/components/ui/Input';
// import { colors, spacing, typography, borderRadius } from '@/constants/design';

// export default function OnboardingStep2() {
//   const router = useRouter();
//   const params = useLocalSearchParams();
//   const [allergies, setAllergies] = useState<string[]>([]);
//   const [inputValue, setInputValue] = useState('');

//   const commonAllergies = ['Peanuts', 'Tree Nuts', 'Milk', 'Eggs', 'Wheat', 'Soy', 'Fish', ];

//   const addAllergy = (allergy: string) => {
//     if (!allergies.includes(allergy)) {
//       setAllergies([...allergies, allergy]);
//     }
//   };

//   const addCustomAllergy = () => {
//     if (inputValue.trim() && !allergies.includes(inputValue.trim())) {
//       setAllergies([...allergies, inputValue.trim()]);
//       setInputValue('');
//     }
//   };

//   const removeAllergy = (allergy: string) => {
//     setAllergies(allergies.filter(a => a !== allergy));
//   };

//   const handleNext = () => {
//     router.push({
//       pathname: '/(onboarding)/step3',
//       params: {
//         complications: params.complications,
//         allergies: JSON.stringify(allergies)
//       }
//     });
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         <View style={styles.header}>
//           <View style={styles.progressBar}>
//             <View style={[styles.progressFill, { width: '66%' }]} />
//           </View>
//           <Text style={styles.stepText}>Step 2 of 3</Text>
//         </View>

//         <View style={styles.content}>
//           <Text style={styles.title}>Food Allergies</Text>
//           <Text style={styles.subtitle}>
//             Select any foods you're allergic to. 
//           </Text>

//           <Text style={styles.sectionTitle}>Common Allergies</Text>
//           <View style={styles.commonAllergies}>
//             {commonAllergies.map((allergy) => (
//               <TouchableOpacity
//                 key={allergy}
//                 onPress={() => addAllergy(allergy)}
//                 style={[
//                   styles.allergyChip,
//                   allergies.includes(allergy) && styles.allergyChipSelected
//                 ]}
//               >
//                 <Text
//                   style={[
//                     styles.allergyChipText,
//                     allergies.includes(allergy) && styles.allergyChipTextSelected
//                   ]}
//                 >
//                   {allergy}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           <Text style={styles.sectionTitle}>Add Custom Allergy</Text>
//           <View style={styles.inputContainer}>
//             <Input
//               value={inputValue}
//               onChangeText={setInputValue}
//               placeholder="Type an allergy and press Add"
//               onSubmitEditing={addCustomAllergy}
//               style={styles.textArea}
//             />
//             <Button onPress={addCustomAllergy} variant="outline" style={styles.addButton}>
//               Add
//             </Button>
//           </View>

//           <Text style={styles.sectionTitle}>Your Allergies ({allergies.length})</Text>
//           <View style={styles.tagsContainer}>
//             {allergies.map((allergy, index) => (
//               <View key={index} style={styles.tag}>
//                 <Text style={styles.tagText}>{allergy}</Text>
//                 <TouchableOpacity onPress={() => removeAllergy(allergy)}>
//                   <X size={16} color={colors.text} />
//                 </TouchableOpacity>
//               </View>
//             ))}
//           </View>

//           {allergies.length === 0 && (
//             <Text style={styles.emptyText}>No allergies added yet</Text>
//           )}
//         </View>

//         <View style={styles.footer}>
//           <Button
//             onPress={() => router.back()}
//             variant="ghost"
//             size="medium"
//             style={styles.backButton}
//           >
//             Back
//           </Button>
//           <Button
//             onPress={handleNext}
//             size="medium"
//             style={styles.nextButton}
//           >
//             Next
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

//     textArea: {
//     minHeight: 30,
//     maxHeight: 150,
//     textAlignVertical: "top",
//     paddingTop: spacing.md,
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
//     marginBottom: spacing.sm,
//     lineHeight: 24,
//   },
//   sectionTitle: {
//     ...typography.h4,
//     color: colors.text,
//     marginBottom: spacing.sm,
//     marginTop: spacing.xs,
//   },
//   commonAllergies: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: spacing.sm,
//     marginBottom: spacing.lg,
//   },
//   allergyChip: {
//     paddingVertical: spacing.sm,
//     paddingHorizontal: spacing.md,
//     borderRadius: borderRadius.md,
//     backgroundColor: colors.backgroundSecondary,
//     borderWidth: 1.5,
//     borderColor: colors.border,
//   },
//   allergyChipSelected: {
//     backgroundColor: colors.backgroundTertiary,
//     borderColor: colors.primary,
//   },
//   allergyChipText: {
//     ...typography.body,
//     color: colors.textSecondary,
//   },
//   allergyChipTextSelected: {
//     color: colors.text,
//     fontWeight: '600',
//   },
//   inputContainer: {
//     // flexDirection: 'row',
//     // gap: spacing.sm,
//     // alignItems: 'flex-end',
//     // marginBottom: spacing.lg,
//     flexDirection: "column",
//     gap: spacing.sm,
//     marginBottom: spacing.lg,
//   },
//   addButton: {
//     marginBottom: spacing.md,
//     paddingHorizontal: spacing.lg,
//   },
//   tagsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: spacing.sm,
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
//   emptyText: {
//     ...typography.body,
//     color: colors.textLight,
//     textAlign: 'center',
//     marginTop: spacing.xl,
//   },
//   footer: {
//     flexDirection: 'row',
//     gap: spacing.md,
//     marginTop: spacing.md,
//   },
//   backButton: {
//     flex: 1,
//   },
//   nextButton: {
//     flex: 2,
//   },
// });
