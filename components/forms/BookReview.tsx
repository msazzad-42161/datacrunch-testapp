import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { COLORS } from '../../utils/theme';

// Zod validation schema
const bookReviewSchema = z.object({
  bookTitle: z
    .string()
    .min(1, 'Book title is required')
    .min(2, 'Book title must be at least 2 characters')
    .max(100, 'Book title must be less than 100 characters'),
  
  author: z
    .string()
    .min(1, 'Author name is required')
    .min(2, 'Author name must be at least 2 characters')
    .max(50, 'Author name must be less than 50 characters'),
  
    rating: z
    .number()
    .min(1, 'Rating must be at least 1 star')
    .max(5, 'Rating cannot exceed 5 stars'),
  
  
  reviewTitle: z
    .string()
    .min(1, 'Review title is required')
    .min(5, 'Review title must be at least 5 characters')
    .max(80, 'Review title must be less than 80 characters'),
  
  reviewText: z
    .string()
    .min(1, 'Review text is required')
    .min(20, 'Review must be at least 20 characters')
    .max(1000, 'Review must be less than 1000 characters'),
  
  genre: z
    .string()
    .min(1, 'Please select a genre'),
  
  recommendToFriend: z.boolean(),
  
  readingStatus: z
  .enum(['currently-reading', 'completed', 'want-to-read'])
  .or(z.literal(undefined)) // to handle undefined case
  .refine((val) => val !== undefined, {
    message: 'Please select your reading status',
  }),

  
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

type BookReviewFormData = z.infer<typeof bookReviewSchema>;

const genres = [
  'Fiction',
  'Non-Fiction',
  'Science Fiction',
  'Fantasy',
  'Mystery',
  'Romance',
  'Thriller',
  'Biography',
  'History',
  'Self-Help',
  'Technical',
  'Other',
];

const readingStatuses = [
  { value: 'currently-reading', label: 'Currently Reading' },
  { value: 'completed', label: 'Completed' },
  { value: 'want-to-read', label: 'Want to Read' },
];

export const BookReviewForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<BookReviewFormData>({
    resolver: zodResolver(bookReviewSchema),
    mode: 'onChange',
    defaultValues: {
      bookTitle: '',
      author: '',
      rating: 1,
      reviewTitle: '',
      reviewText: '',
      genre: '',
      recommendToFriend: false,
      readingStatus: 'completed',
      email: '',
    },
  });

  const watchedRating = watch('rating');
  const watchedRecommend = watch('recommendToFriend');

  const onSubmit = async (data: BookReviewFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Form Data:', data);
      
      Alert.alert(
        'Review Submitted!',
        `Thank you for reviewing "${data.bookTitle}"! Your review has been saved.`,
        [
          {
            text: 'OK',
            onPress: () => reset(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const RatingStars = ({ rating, onRatingChange }: { rating: number; onRatingChange: (rating: number) => void }) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => onRatingChange(star)}
            style={styles.starButton}
          >
            <Text style={[styles.star, star <= rating && styles.starActive]}>
              ★
            </Text>
          </TouchableOpacity>
        ))}
        <Text style={styles.ratingText}>({rating}/5 stars)</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>📚 Write a Book Review</Text>
      
      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          {/* Book Title */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Book Title *</Text>
            <Controller
              control={control}
              name="bookTitle"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  style={[styles.input, errors.bookTitle && styles.inputError]}
                  placeholder="Enter the book title"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="words"
                />
              )}
            />
            {errors.bookTitle && (
              <Text style={styles.errorText}>{errors.bookTitle.message}</Text>
            )}
          </View>

          {/* Author */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Author *</Text>
            <Controller
              control={control}
              name="author"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  style={[styles.input, errors.author && styles.inputError]}
                  placeholder="Enter the author's name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="words"
                />
              )}
            />
            {errors.author && (
              <Text style={styles.errorText}>{errors.author.message}</Text>
            )}
          </View>

          {/* Rating */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Rating *</Text>
            <Controller
              control={control}
              name="rating"
              render={({ field: { onChange, value } }) => (
                <RatingStars rating={value} onRatingChange={onChange} />
              )}
            />
            {errors.rating && (
              <Text style={styles.errorText}>{errors.rating.message}</Text>
            )}
          </View>

          {/* Genre */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Genre *</Text>
            <Controller
              control={control}
              name="genre"
              render={({ field: { onChange, value } }) => (
                <View style={styles.genreContainer}>
                  {genres.map((genre) => (
                    <TouchableOpacity
                      key={genre}
                      style={[
                        styles.genreChip,
                        value === genre && styles.genreChipSelected,
                      ]}
                      onPress={() => onChange(genre)}
                    >
                      <Text
                        style={[
                          styles.genreText,
                          value === genre && styles.genreTextSelected,
                        ]}
                      >
                        {genre}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            />
            {errors.genre && (
              <Text style={styles.errorText}>{errors.genre.message}</Text>
            )}
          </View>

          {/* Reading Status */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Reading Status *</Text>
            <Controller
              control={control}
              name="readingStatus"
              render={({ field: { onChange, value } }) => (
                <View style={styles.radioGroup}>
                  {readingStatuses.map((status) => (
                    <TouchableOpacity
                      key={status.value}
                      style={styles.radioOption}
                      onPress={() => onChange(status.value)}
                    >
                      <View style={styles.radioCircle}>
                        {value === status.value && <View style={styles.radioInner} />}
                      </View>
                      <Text style={styles.radioLabel}>{status.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            />
            {errors.readingStatus && (
              <Text style={styles.errorText}>{errors.readingStatus.message}</Text>
            )}
          </View>

          {/* Review Title */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Review Title *</Text>
            <Controller
              control={control}
              name="reviewTitle"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  style={[styles.input, errors.reviewTitle && styles.inputError]}
                  placeholder="Give your review a catchy title"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="sentences"
                />
              )}
            />
            {errors.reviewTitle && (
              <Text style={styles.errorText}>{errors.reviewTitle.message}</Text>
            )}
          </View>

          {/* Review Text */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Your Review *</Text>
            <Controller
              control={control}
              name="reviewText"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  style={[styles.textArea, errors.reviewText && styles.inputError]}
                  placeholder="What did you think about this book? Share your detailed thoughts..."
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                  autoCapitalize="sentences"
                />
              )}
            />
            {errors.reviewText && (
              <Text style={styles.errorText}>{errors.reviewText.message}</Text>
            )}
          </View>

          {/* Recommend to Friend */}
          <View style={styles.fieldContainer}>
            <Controller
              control={control}
              name="recommendToFriend"
              render={({ field: { onChange, value } }) => (
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => onChange(!value)}
                >
                  <View style={[styles.checkbox, value && styles.checkboxChecked]}>
                    {value && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.checkboxLabel}>
                    I would recommend this book to a friend
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>

          {/* Email */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Email *</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder="your.email@example.com"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              )}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email.message}</Text>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, (!isValid || isSubmitting) && styles.submitButtonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid || isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? '📝 Submitting...' : '🚀 Submit Review'}
            </Text>
          </TouchableOpacity>

          {/* Form Summary */}
          {watchedRating >= 4 && watchedRecommend && (
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryText}>
                🌟 Great! You've given this book {watchedRating} stars and would recommend it to friends!
              </Text>
            </View>
          )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 18,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  form: {
    maxHeight: 400, // Limit height to prevent overflow
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#111827',
  },
  inputError: {
    borderColor: '#ef4444',
    borderWidth: 2,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#111827',
    minHeight: 120,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 4,
    marginLeft: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  starButton: {
    padding: 4,
  },
  star: {
    fontSize: 32,
    color: '#d1d5db',
  },
  starActive: {
    color: '#fbbf24',
  },
  ratingText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genreChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: 'white',
  },
  genreChipSelected: {
    backgroundColor: COLORS.accent2,
    borderColor: COLORS.accent2,
  },
  genreText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  genreTextSelected: {
    color: 'white',
  },
  radioGroup: {
    gap: 12,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.accent2,
  },
  radioLabel: {
    fontSize: 16,
    color: '#374151',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  checkboxChecked: {
    backgroundColor: COLORS.accent2,
    borderColor: COLORS.accent2,
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  submitButton: {
    backgroundColor: COLORS.accent2,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  summaryContainer: {
    backgroundColor: '#d1fae5',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#059669',
  },
  summaryText: {
    color: '#065f46',
    fontSize: 16,
    fontWeight: '500',
  },
});