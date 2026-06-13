import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

import { useAppStore } from '@/app/store';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const filters = ['Week', 'Month', 'Year', 'Custom'] as const;
const methods = ['All Methods', 'Cash', 'E-Wallet'] as const;

const msPerDay = 24 * 60 * 60 * 1000;

const filterByPeriod = (transactions: readonly any[], period: (typeof filters)[number]) => {
  if (period === 'Custom') return transactions;

  const maxAge = period === 'Week' ? 7 : period === 'Month' ? 30 : 365;
  const now = new Date().getTime();

  return transactions.filter((transaction) => {
    const txnDate = new Date(transaction.date).getTime();
    return now - txnDate <= maxAge * msPerDay;
  });
};

const getSectionLabel = (dateString: string) => {
  const transactionDate = new Date(dateString);
  const today = new Date();
  const diffDays = Math.round((today.getTime() - transactionDate.getTime()) / msPerDay);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return transactionDate.toLocaleDateString();
};

export default function HistoryScreen() {
  const { transactions, removeTransaction } = useAppStore();
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<(typeof filters)[number]>('Week');
  const [selectedMethod, setSelectedMethod] = useState<(typeof methods)[number]>('All Methods');

  const filteredByPeriod = useMemo(() => filterByPeriod(transactions, selectedFilter), [selectedFilter, transactions]);

  const filteredByMethod = useMemo(
    () =>
      selectedMethod === 'All Methods'
        ? filteredByPeriod
        : filteredByPeriod.filter((transaction) => transaction.account === selectedMethod),
    [filteredByPeriod, selectedMethod]
  );

  const filteredTransactions = useMemo(() => {
    if (!query.trim()) return filteredByMethod;
    const lower = query.toLowerCase();

    return filteredByMethod.filter(
      (transaction) =>
        transaction.title.toLowerCase().includes(lower) ||
        transaction.category.toLowerCase().includes(lower) ||
        transaction.account.toLowerCase().includes(lower)
    );
  }, [filteredByMethod, query]);

  const recommendations = useMemo(() => {
    if (!query.trim()) return [];
    const lower = query.toLowerCase();
    const matches = transactions.filter(
      (transaction) =>
        transaction.title.toLowerCase().includes(lower) ||
        transaction.category.toLowerCase().includes(lower)
    );

    return Array.from(new Set(matches.flatMap((transaction) => [transaction.title, transaction.category]))).slice(0, 4);
  }, [query, transactions]);

  const groupedTransactions = useMemo(() => {
    const groups = new Map<string, typeof transactions>();
    filteredTransactions
      .slice()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .forEach((transaction) => {
        const label = getSectionLabel(transaction.date);
        const group = groups.get(label) ?? [];
        group.push(transaction);
        groups.set(label, group);
      });

    return Array.from(groups.entries());
  }, [filteredTransactions, transactions]);

  return (
    <ThemedView style={styles.page}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View>
            <ThemedText type="title">Transaction History</ThemedText>
            <ThemedText style={styles.headerSubtitle}>Review all recent activity</ThemedText>
          </View>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' }}
            style={styles.profileAvatar}
          />
        </View>

        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#64748b" />
          <TextInput
            placeholder="Search transactions..."
            placeholderTextColor="#64748b"
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
          />
        </View>

        {recommendations.length > 0 && (
          <View style={styles.recommendationRow}>
            {recommendations.map((item) => (
              <Pressable key={item} style={styles.recommendationChip} onPress={() => setQuery(item)}>
                <ThemedText style={styles.recommendationText}>{item}</ThemedText>
              </Pressable>
            ))}
          </View>
        )}

        <View style={styles.filterRow}>
          {filters.map((label, index) => (
            <Pressable
              key={label}
              style={[
                styles.filterChip,
                selectedFilter === label ? styles.filterChipActive : undefined,
                index < filters.length - 1 ? styles.filterChipSpacing : undefined,
              ]}
              onPress={() => setSelectedFilter(label)}
            >
              <ThemedText style={[styles.filterText, selectedFilter === label ? styles.filterTextActive : undefined]}>
                {label}
              </ThemedText>
            </Pressable>
          ))}
        </View>

        <View style={styles.filterRow}>
          {methods.map((label, index) => (
            <Pressable
              key={label}
              style={[
                styles.methodChip,
                selectedMethod === label ? styles.methodChipActive : undefined,
                index < methods.length - 1 ? styles.filterChipSpacing : undefined,
              ]}
              onPress={() => setSelectedMethod(label)}
            >
              <ThemedText style={[styles.methodText, selectedMethod === label ? styles.methodTextActive : undefined]}>
                {label}
              </ThemedText>
            </Pressable>
          ))}
        </View>

        {groupedTransactions.length === 0 ? (
          <ThemedText style={styles.emptyText}>No transactions match your search.</ThemedText>
        ) : (
          groupedTransactions.map(([section, items]) => (
            <View key={section}>
              <View style={styles.sectionHeader}>
                <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>{section}</ThemedText>
              </View>
              {items.map((item) => (
                <Swipeable
                  key={item.id}
                  overshootRight={false}
                  renderRightActions={() => (
                    <Pressable style={styles.deleteAction} onPress={() => removeTransaction(item.id)}>
                      <MaterialIcons name="delete" size={22} color="#ffffff" />
                    </Pressable>
                  )}
                >
                  <View style={styles.transactionCard}>
                    <View style={styles.transactionLeading}>
                      <View style={[styles.iconBadge, { backgroundColor: `${item.type === 'expense' ? '#fee2e2' : '#dcfce7'}` }]}>
                        <MaterialIcons
                          name={item.type === 'expense' ? 'money-off' : 'attach-money' as any}
                          size={20}
                          color={item.type === 'expense' ? '#dc2626' : '#047857'}
                        />
                      </View>
                      <View style={styles.transactionMeta}>
                        <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
                        <ThemedText style={styles.transactionSubtitle}>{item.date} • {item.account}</ThemedText>
                      </View>
                    </View>
                    <View style={styles.transactionAmountContainer}>
                      <ThemedText style={[styles.transactionAmount, item.amount > 0 ? styles.positive : styles.negative]}>
                        {item.amount > 0 ? `+` : `-`} ${Math.abs(item.amount).toFixed(2)}
                      </ThemedText>
                      <ThemedText style={styles.transactionCategory}>{item.category}</ThemedText>
                    </View>
                  </View>
                </Swipeable>
              ))}
            </View>
          ))
        )}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerSubtitle: {
    marginTop: 6,
    color: '#64748b',
  },
  profileAvatar: {
    width: 46,
    height: 46,
    borderRadius: 999,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#0f172a',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  filterChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: '#f8fafc',
  },
  filterChipActive: {
    backgroundColor: '#0f172a',
  },
  filterText: {
    fontSize: 12,
    color: '#475569',
  },
  filterTextActive: {
    color: '#fff',
  },
  methodChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#fff',
  },
  filterChipSpacing: {
    marginRight: 12,
  },
  methodChipActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#93c5fd',
  },
  methodText: {
    fontSize: 12,
    color: '#475569',
  },
  methodTextActive: {
    color: '#0f172a',
    fontWeight: '600',
  },
  sectionHeader: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 24,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
    marginBottom: 14,
  },
  transactionLeading: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionMeta: {
    flex: 1,
  },
  transactionSubtitle: {
    marginTop: 4,
    color: '#64748b',
  },
  transactionAmountContainer: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  positive: {
    color: '#047857',
  },
  negative: {
    color: '#b91c1c',
  },
  transactionCategory: {
    marginTop: 4,
    color: '#94a3b8',
    fontSize: 12,
  },
  recommendationRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 14,
  },
  recommendationChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#eff6ff',
    marginRight: 10,
    marginBottom: 10,
  },
  recommendationText: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteAction: {
    width: 86,
    backgroundColor: '#dc2626',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    marginBottom: 14,
  },
  emptyText: {
    paddingVertical: 28,
    color: '#64748b',
    fontSize: 14,
    textAlign: 'center',
  },
});
