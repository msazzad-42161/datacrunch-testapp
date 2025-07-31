import { StyleSheet, Text, View, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import { notificationService } from '../../services/notificationService'
import { useTrendingBooks } from '../../hooks/useBooks'
import { useUserStore } from '../../store/userStore'
import { COLORS } from '../../utils/theme'

const ProfileScreen = () => {
  const { data, isLoading, error } = useTrendingBooks()
  const [showIntervalPicker, setShowIntervalPicker] = useState(false)
  
  const {
    user,
    theme,
    notificationsEnabled,
    dailyReminderEnabled,
    dailyReminderSeconds,
    toggleNotifications,
    toggleDailyReminder,
    setDailyReminderSeconds,
    toggleTheme,
  } = useUserStore()

  const handleIntervalChange = (seconds: number) => {
    setDailyReminderSeconds(seconds)
    setShowIntervalPicker(false)
  }

  const formatSeconds = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds} seconds`
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60)
      return `${minutes} minute${minutes > 1 ? 's' : ''}`
    } else {
      const hours = Math.floor(seconds / 3600)
      const remainingMinutes = Math.floor((seconds % 3600) / 60)
      return `${hours} hour${hours > 1 ? 's' : ''}${remainingMinutes > 0 ? ` ${remainingMinutes} min` : ''}`
    }
  }

  const testNotification = () => {
    if (data?.docs && data.docs.length > 0) {
      const randomBook = data.docs[Math.floor(Math.random() * Math.min(10, data.docs.length))]
      notificationService.sendBookRecommendation(randomBook)
    }
  }

  const testDailyReminder = async () => {
    try {
      await notificationService.sendLocalNotification({
        title: '📚 Reading Time!',
        body: "Don't forget to spend some time with your favorite books today.",
        data: { type: 'daily_reminder' }
      })
    } catch (error) {
      Alert.alert('Error', 'Failed to send test notification')
    }
  }

  return (
    <ScrollView style={styles.container}>

      {/* Theme Settings */}
      {/* <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Dark Mode</Text>
          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={theme === 'dark' ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>
      </View> */}

      {/* Notification Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        
        {/* Master notification toggle */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Enable Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: '#767577', true: COLORS.light2 }}
            thumbColor={notificationsEnabled ? COLORS.accent2 : COLORS.light2}
          />
        </View>

        {/* Daily reminder settings */}
        <View style={[styles.settingRow, !notificationsEnabled && styles.disabled]}>
          <View style={styles.settingContent}>
            <Text style={[styles.settingLabel, !notificationsEnabled && styles.disabledText]}>
              Daily Reading Reminder
            </Text>
            <Text style={[styles.settingDescription, !notificationsEnabled && styles.disabledText]}>
              Get reminded to read at regular intervals
            </Text>
          </View>
          <Switch
            value={dailyReminderEnabled}
            onValueChange={toggleDailyReminder}
            disabled={!notificationsEnabled}
            trackColor={{ false: '#767577', true: COLORS.light2 }}
            thumbColor={dailyReminderEnabled ? COLORS.accent2 : COLORS.light2}
          />
        </View>

        {/* Interval picker for daily reminder */}
        {dailyReminderEnabled && notificationsEnabled && (
          <TouchableOpacity
            style={styles.timePickerButton}
            onPress={() => setShowIntervalPicker(true)}
          >
            <Text style={styles.timePickerLabel}>Reminder Interval</Text>
            <Text style={styles.timePickerValue}>
              {formatSeconds(dailyReminderSeconds)}
            </Text>
          </TouchableOpacity>
        )}
      {/* Test Notifications */}
      <View style={{...styles.section,backgroundColor:"#f8f9fa",borderRadius:8}}>
        <Text style={styles.sectionTitle}>Test Notifications</Text>
        
        <TouchableOpacity
          style={styles.testButton}
          onPress={testNotification}
          disabled={!notificationsEnabled || isLoading || !data?.docs}
        >
          <Text style={[styles.testButtonText, (!notificationsEnabled || isLoading || !data?.docs) && styles.disabledText]}>
            📖 Test Book Recommendation
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.testButton}
          onPress={testDailyReminder}
          disabled={!notificationsEnabled}
        >
          <Text style={[styles.testButtonText, !notificationsEnabled && styles.disabledText]}>
            ⏰ Test Daily Reminder
          </Text>
        </TouchableOpacity>
      </View>
        {/* Simple interval picker */}
        {showIntervalPicker && (
          <View style={styles.timePicker}>
            <Text style={styles.timePickerTitle}>Select Reminder Interval</Text>
            <View style={styles.timeOptions}>
              {[
                { seconds: 30, label: '30 seconds' },
                { seconds: 60, label: '1 minute' },
                { seconds: 300, label: '5 minutes' },
                { seconds: 600, label: '10 minutes' },
                { seconds: 1800, label: '30 minutes' },
                { seconds: 3600, label: '1 hour' },
                { seconds: 21600, label: '6 hours' },
                { seconds: 86400, label: '24 hours' },
              ].map((interval, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.timeOption,
                    dailyReminderSeconds === interval.seconds && styles.selectedTimeOption
                  ]}
                  onPress={() => handleIntervalChange(interval.seconds)}
                >
                  <Text style={[
                    styles.timeOptionText,
                    dailyReminderSeconds === interval.seconds && styles.selectedTimeOptionText
                  ]}>
                    {interval.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.closeTimePickerButton}
              onPress={() => setShowIntervalPicker(false)}
            >
              <Text style={styles.closeTimePickerText}>Close</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

    </ScrollView>
  )
}

export { ProfileScreen }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    gap:12
    },
  section: {
    backgroundColor: '#fff',
    padding:18,
    borderRadius:8,
    gap:12
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333'
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#999',
  },
  timePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginTop: 10,
  },
  timePickerLabel: {
    fontSize: 16,
    color: '#333',
  },
  timePickerValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.accent2,
  },
  timePicker: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timePickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  timeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeOption: {
    width: '48%',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  selectedTimeOption: {
    backgroundColor: COLORS.accent2,
  },
  timeOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedTimeOptionText: {
    color: '#fff',
    fontWeight: '600',
  },
  closeTimePickerButton: {
    marginTop: 15,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeTimePickerText: {
    fontSize: 16,
    color: COLORS.accent2,
    fontWeight: '600',
  },
  testButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: COLORS.accent2,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  testButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  statusText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
})