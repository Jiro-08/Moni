import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';

import { useAppStore } from '@/app/store';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const currencyOptions = ['USD ($)', 'NGN (₦)', 'EUR (€)', 'PHP (₱)'] as const;
const dateFormatOptions = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'] as const;
const languageOptions = ['English (US)', 'French (FR)', 'Spanish (ES)'] as const;

export default function SettingsScreen() {
  const {
    themeMode,
    setThemeMode,
    currency,
    setCurrency,
    dateFormat,
    setDateFormat,
    language,
    setLanguage,
  } = useAppStore();
  const [secureLock, setSecureLock] = useState(true);
  const [biometricUnlock, setBiometricUnlock] = useState(false);

  const nextCurrency = () => {
    const nextIndex = (currencyOptions.indexOf(currency) + 1) % currencyOptions.length;
    setCurrency(currencyOptions[nextIndex]);
  };

  const nextDateFormat = () => {
    const nextIndex = (dateFormatOptions.indexOf(dateFormat) + 1) % dateFormatOptions.length;
    setDateFormat(dateFormatOptions[nextIndex]);
  };

  const nextLanguage = () => {
    const nextIndex = (languageOptions.indexOf(language) + 1) % languageOptions.length;
    setLanguage(languageOptions[nextIndex]);
  };

  const themeIcon = themeMode === 'dark' ? 'dark-mode' : 'light-mode';

  return (
    <ThemedView style={styles.page}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={styles.avatarContainer}>
              <ThemedText style={styles.avatarInitial}>A</ThemedText>
            </View>
            <View style={styles.profileInfo}>
              <ThemedText type="defaultSemiBold">Alex Sterling</ThemedText>
              <ThemedText style={styles.profileEmail}>alex.sterling@moni.app</ThemedText>
            </View>
            <Pressable style={styles.themeToggleButton} onPress={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}>
              <MaterialIcons name={themeIcon as any} size={22} color="#047857" />
            </Pressable>
          </View>
          <View style={styles.profileMetaRow}>
            <MaterialIcons name={themeIcon as any} size={16} color="#047857" />
            <ThemedText style={styles.profileThemeText}>{themeMode === 'light' ? 'Light mode' : 'Dark mode'}</ThemedText>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <ThemedText type="subtitle" style={styles.sectionHeading}>Preferences</ThemedText>
          <Pressable style={styles.preferenceRow} onPress={nextCurrency}>
            <View style={styles.preferenceLabelRow}>
              <MaterialIcons name="payments" size={22} color="#047857" />
              <ThemedText style={styles.preferenceLabel}>Currency</ThemedText>
            </View>
            <ThemedText style={styles.preferenceValue}>{currency}</ThemedText>
          </Pressable>
          <Pressable style={styles.preferenceRow} onPress={nextDateFormat}>
            <View style={styles.preferenceLabelRow}>
              <MaterialIcons name="calendar-month" size={22} color="#047857" />
              <ThemedText style={styles.preferenceLabel}>Date Format</ThemedText>
            </View>
            <ThemedText style={styles.preferenceValue}>{dateFormat}</ThemedText>
          </Pressable>
          <Pressable style={[styles.preferenceRow, styles.preferenceRowLast]} onPress={nextLanguage}>
            <View style={styles.preferenceLabelRow}>
              <MaterialIcons name="language" size={22} color="#047857" />
              <ThemedText style={styles.preferenceLabel}>Language</ThemedText>
            </View>
            <ThemedText style={styles.preferenceValue}>{language}</ThemedText>
          </Pressable>
        </View>

        <View style={styles.sectionCard}>
          <ThemedText type="subtitle" style={styles.sectionHeading}>Security</ThemedText>
          <View style={styles.preferenceRow}>
            <View style={styles.preferenceLabelRow}>
              <MaterialIcons name="lock" size={22} color="#047857" />
              <ThemedText style={styles.preferenceLabel}>App Lock</ThemedText>
            </View>
            <Switch value={secureLock} onValueChange={setSecureLock} thumbColor={secureLock ? '#047857' : '#fff'} trackColor={{ false: '#d1d5db', true: '#a7f3d0' }} />
          </View>
          <View style={[styles.preferenceRow, styles.preferenceRowLast]}>
            <View style={styles.preferenceLabelRow}>
              <MaterialIcons name="fingerprint" size={22} color="#047857" />
              <ThemedText style={styles.preferenceLabel}>Biometric Unlock</ThemedText>
            </View>
            <Switch value={biometricUnlock} onValueChange={setBiometricUnlock} thumbColor={biometricUnlock ? '#047857' : '#fff'} trackColor={{ false: '#d1d5db', true: '#a7f3d0' }} />
          </View>
        </View>

        <View style={styles.sectionCard}>
          <ThemedText type="subtitle" style={styles.sectionHeading}>Data Management</ThemedText>
          <View style={styles.dataGrid}>
            {[
              { icon: 'download', label: 'EXPORT CSV', iconComponent: 'fontawesome' },
              { icon: 'picture-as-pdf', label: 'EXPORT PDF', iconComponent: 'material' },
            ].map((item) => (
              <View key={item.label} style={styles.dataCard}>
                {item.iconComponent === 'fontawesome' ? (
                  <FontAwesome name={item.icon as any} size={28} color="#047857" />
                ) : (
                  <MaterialIcons name={item.icon as any} size={28} color="#047857" />
                )}
                <ThemedText style={styles.dataLabel}>{item.label}</ThemedText>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <ThemedText type="subtitle" style={styles.sectionHeading}>About</ThemedText>
          <View style={styles.preferenceRow}>
            <ThemedText style={styles.preferenceLabel}>Version</ThemedText>
            <ThemedText style={styles.preferenceValue}>2.4.0 (Stable)</ThemedText>
          </View>
          <View style={styles.preferenceRow}>
            <ThemedText style={styles.preferenceLabel}>Privacy Policy</ThemedText>
          </View>
          <View style={[styles.preferenceRow, styles.preferenceRowLast]}>
            <ThemedText style={styles.preferenceLabel}>Terms of Service</ThemedText>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.logoutButton}>
            <MaterialIcons name="logout" size={20} color="#b91c1c" />
            <ThemedText style={styles.logoutText}>Logout</ThemedText>
          </View>
          <ThemedText style={styles.footerText}>MADE WITH LOVE IN SF • MONI INC</ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 120,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: '#d1fae5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 28,
    fontWeight: '700',
    color: '#047857',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileEmail: {
    marginTop: 4,
    color: '#64748b',
  },
  themeToggleButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#d1fae5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  profileThemeText: {
    marginLeft: 8,
    color: '#475569',
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  sectionHeading: {
    marginBottom: 16,
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  preferenceRowLast: {
    borderBottomWidth: 0,
  },
  preferenceLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  preferenceLabel: {
    marginLeft: 12,
    fontSize: 16,
    color: '#0f172a',
  },
  preferenceValue: {
    color: '#64748b',
    fontSize: 14,
  },
  dataGrid: {
    flexDirection: 'row',
  },
  dataCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 24,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataLabel: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '700',
    color: '#024731',
  },
  footer: {
    alignItems: 'center',
    marginTop: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#fca5a5',
    backgroundColor: '#fff1f2',
  },
  logoutText: {
    color: '#b91c1c',
    fontWeight: '700',
    marginLeft: 10,
  },
  footerText: {
    marginTop: 4,
    color: '#94a3b8',
    fontSize: 12,
  },
});
