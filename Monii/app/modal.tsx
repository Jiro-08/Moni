import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { useAppStore } from '@/app/store';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const expenseCategories = [
  { label: 'Personal', icon: 'person' },
  { label: 'Dining', icon: 'restaurant' },
  { label: 'Transport', icon: 'directions-car' },
  { label: 'Others', icon: 'more-horiz' },
];

const incomeCategories = [
  { label: 'Allowance', icon: 'account-balance-wallet' },
  { label: 'Salary', icon: 'work' },
  { label: 'Others', icon: 'more-horiz' },
];

const accounts = ['Cash', 'E-Wallet'] as const;

const getTodayISO = () => new Date().toISOString().slice(0, 10);

export default function ModalScreen() {
  const router = useRouter();
  const { addTransaction } = useAppStore();
  const [mode, setMode] = useState<'expense' | 'income'>('expense');
  const [selectedCategory, setSelectedCategory] = useState(expenseCategories[0].label);
  const [selectedAccount, setSelectedAccount] = useState<typeof accounts[number]>('Cash');
  const [amount, setAmount] = useState('0.00');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(getTodayISO());

  const categories = useMemo(() => (mode === 'expense' ? expenseCategories : incomeCategories), [mode]);

  useEffect(() => {
    setSelectedCategory(categories[0].label);
  }, [categories]);

  const handleSave = () => {
    const parsedAmount = parseFloat(amount.replace(/[^0-9.]/g, ''));
    if (Number.isNaN(parsedAmount) || parsedAmount === 0) return;

    addTransaction({
      title: selectedCategory,
      category: selectedCategory,
      account: selectedAccount,
      date: date || getTodayISO(),
      note: note || `${mode === 'expense' ? 'Expense' : 'Income'} recorded`,
      type: mode,
      amount: mode === 'expense' ? -Math.abs(parsedAmount) : Math.abs(parsedAmount),
    });

    router.back();
  };

  return (
    <ThemedView style={styles.page}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.handle} />
        <View style={styles.tabRow}>
          <Pressable
            style={[styles.tabButton, styles.tabButtonMargin, mode === 'expense' ? styles.tabButtonActive : undefined]}
            onPress={() => setMode('expense')}
          >
            <ThemedText style={[styles.tabText, mode === 'expense' ? styles.tabTextActive : undefined]}>Expense</ThemedText>
          </Pressable>
          <Pressable
            style={[styles.tabButton, styles.tabButtonMargin, mode === 'income' ? styles.tabButtonActive : undefined]}
            onPress={() => setMode('income')}
          >
            <ThemedText style={[styles.tabText, mode === 'income' ? styles.tabTextActive : undefined]}>Income</ThemedText>
          </Pressable>
        </View>

        <View style={styles.amountSection}>
          <ThemedText style={styles.sectionLabel}>ENTER AMOUNT</ThemedText>
          <View style={styles.amountInputContainer}>
            <ThemedText type="title" style={styles.amountPrefix}>$</ThemedText>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <ThemedText style={styles.sectionLabel}>CATEGORY</ThemedText>
          <View style={styles.categoryGrid}>
            {categories.map((item) => (
              <Pressable
                key={item.label}
                style={[
                  styles.categoryButton,
                  selectedCategory === item.label ? styles.categoryButtonActive : undefined,
                ]}
                onPress={() => setSelectedCategory(item.label)}
              >
                <MaterialIcons name={item.icon as any} size={20} color={selectedCategory === item.label ? '#dc2626' : '#475569'} />
                <ThemedText style={[styles.categoryLabel, selectedCategory === item.label ? styles.categoryLabelActive : undefined]}>
                  {item.label}
                </ThemedText>
              </Pressable>
            ))}
          </View>

          <View style={styles.fieldRow}>
            <View style={styles.fieldColumn}>
              <ThemedText style={styles.sectionLabel}>PAYMENT</ThemedText>
              <View style={styles.accountRow}>
                {accounts.map((account) => (
                  <Pressable
                    key={account}
                    style={[
                      styles.accountButton,
                      selectedAccount === account ? styles.accountButtonActive : undefined,
                    ]}
                    onPress={() => setSelectedAccount(account)}
                  >
                    <ThemedText style={selectedAccount === account ? styles.accountTextActive : styles.accountText}>
                      {account}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>
            <View style={[styles.fieldColumn, styles.fieldColumnSpacing]}>
              <ThemedText style={styles.sectionLabel}>DATE</ThemedText>
              <TextInput
                value={date}
                onChangeText={setDate}
                style={styles.dateInput}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#94a3b8"
              />
            </View>
          </View>

          <View style={styles.textAreaContainer}>
            <ThemedText style={styles.sectionLabel}>NOTE</ThemedText>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="What was this for?"
              placeholderTextColor="#94a3b8"
              multiline
              style={styles.textArea}
            />
          </View>

          <Pressable style={styles.saveButton} onPress={handleSave}>
            <MaterialIcons name="check-circle" size={20} color="#ffffff" />
            <ThemedText style={[styles.saveText, styles.saveTextSpacing]}>Save Transaction</ThemedText>
          </Pressable>
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
    paddingBottom: 60,
  },
  handle: {
    width: 72,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#cbd5e1',
    alignSelf: 'center',
    marginVertical: 16,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    padding: 4,
    borderRadius: 999,
    marginBottom: 24,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 999,
  },
  tabButtonMargin: {
    marginHorizontal: 4,
  },
  tabButtonActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  tabText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#047857',
  },
  amountSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 12,
    color: '#475569',
    letterSpacing: 1,
    marginBottom: 12,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 28,
    backgroundColor: '#ffffff',
    width: '100%',
    justifyContent: 'center',
  },
  amountPrefix: {
    color: '#047857',
  },
  amountInput: {
    flex: 1,
    fontSize: 40,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
  },
  formSection: {
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoryButton: {
    width: '48%',
    paddingVertical: 16,
    borderRadius: 24,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryButtonActive: {
    backgroundColor: '#d1fae5',
  },
  categoryLabel: {
    fontSize: 12,
    color: '#475569',
    textAlign: 'center',
    marginTop: 8,
  },
  categoryLabelActive: {
    color: '#047857',
  },
  fieldRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  fieldColumn: {
    flex: 1,
  },
  fieldColumnSpacing: {
    marginLeft: 12,
  },
  selectField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
  },
  accountRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  accountButton: {
    flex: 1,
    marginRight: 10,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
    alignItems: 'center',
  },
  accountButtonActive: {
    backgroundColor: '#d1fae5',
    borderColor: '#86efac',
  },
  accountText: {
    color: '#475569',
    fontWeight: '700',
  },
  accountTextActive: {
    color: '#047857',
    fontWeight: '700',
  },
  dateInput: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    color: '#0f172a',
  },
  textAreaContainer: {
    marginTop: 20,
  },
  textArea: {
    minHeight: 90,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 20,
    padding: 16,
    backgroundColor: '#ffffff',
    color: '#0f172a',
    textAlignVertical: 'top',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#047857',
    paddingVertical: 16,
    borderRadius: 24,
    marginTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  saveText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  saveTextSpacing: {
    marginLeft: 10,
  },
});
