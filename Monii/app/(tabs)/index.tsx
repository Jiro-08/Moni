import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { type Transaction, useAppStore } from '@/app/store';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const filters = ['Week', 'Month', 'Year', 'Custom'] as const;

const msPerDay = 24 * 60 * 60 * 1000;

const filterTransactionsByPeriod = (transactions: readonly Transaction[], period: (typeof filters)[number]) => {
  if (period === 'Custom') {
    return transactions;
  }

  const maxAge = period === 'Week' ? 7 : period === 'Month' ? 30 : 365;
  const now = new Date();

  return transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return now.getTime() - transactionDate.getTime() <= maxAge * msPerDay;
  });
};

const formatAmount = (amount: number, symbol: string) => {
  const sign = amount < 0 ? '-' : '+';
  return `${sign}${symbol}${Math.abs(amount).toFixed(2)}`;
};

export default function HomeScreen() {
  const router = useRouter();
  const { transactions, currency } = useAppStore();
  const [selectedFilter, setSelectedFilter] = useState<(typeof filters)[number]>('Week');

  const symbol = currency.match(/\((.)\)/)?.[1] ?? '$';
  const totalBalance = useMemo(
    () => transactions.reduce((sum, transaction) => sum + transaction.amount, 0),
    [transactions]
  );
  const totalExpenses = useMemo(
    () => transactions.filter((transaction) => transaction.amount < 0).reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0),
    [transactions]
  );

  const cashData = useMemo(() => {
    const cashTransactions = transactions.filter((transaction) => transaction.account === 'Cash');
    const current = cashTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    const expenses = cashTransactions.filter((transaction) => transaction.amount < 0).reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);

    return {
      title: 'PHYSICAL CASH',
      amount: `${symbol}${current.toFixed(2)}`,
      subtitle: `Exp: ${symbol}${expenses.toFixed(2)}`,
      icon: 'payments',
      iconColor: '#047857',
      background: '#ecfdf5',
    };
  }, [transactions, symbol]);

  const walletData = useMemo(() => {
    const walletTransactions = transactions.filter((transaction) => transaction.account === 'E-Wallet');
    const current = walletTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    const expenses = walletTransactions.filter((transaction) => transaction.amount < 0).reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);

    return {
      title: 'E-WALLET',
      amount: `${symbol}${current.toFixed(2)}`,
      subtitle: `Exp: ${symbol}${expenses.toFixed(2)}`,
      icon: 'account-balance-wallet',
      iconColor: '#1d4ed8',
      background: '#eff6ff',
    };
  }, [transactions, symbol]);

  const activeTransactions = useMemo<Transaction[]>(
    () => [...filterTransactionsByPeriod(transactions, selectedFilter)].sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime()),
    [selectedFilter, transactions]
  );

  return (
    <ThemedView style={styles.page}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <View style={styles.userInfo}>
            <View style={styles.avatarWrapper}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' }}
                style={styles.avatar}
              />
            </View>
            <View>
              <ThemedText style={styles.smallText}>Hello,</ThemedText>
              <ThemedText type="title">Alex</ThemedText>
            </View>
          </View>
          <View style={styles.iconButton}>
            <MaterialIcons name="notifications" size={22} color="#0f172a" />
          </View>
        </View>

        <View style={styles.balanceCard}>
          <ThemedText style={styles.labelText}>TOTAL BALANCE</ThemedText>
          <ThemedText type="title" style={[styles.balanceText, totalBalance < 0 ? styles.negative : styles.positive]}> 
            {symbol}{totalBalance.toFixed(2)}
          </ThemedText>
          <View style={styles.balanceMeta}>
            <MaterialIcons name="trending-down" size={18} color="#64748b" />
            <ThemedText style={styles.balanceSubtitle}>Total Expenses:</ThemedText>
            <ThemedText style={styles.balanceAmount}>{symbol}{totalExpenses.toFixed(2)}</ThemedText>
          </View>
        </View>

        <View style={styles.smallCardsRow}>
          {[cashData, walletData].map((item) => (
            <View key={item.title} style={[styles.smallCard, { backgroundColor: item.background }]}> 
              <View style={[styles.iconContainer, { backgroundColor: '#ffffff' }]}> 
                <MaterialIcons name={item.icon as any} size={22} color={item.iconColor} />
              </View>
              <ThemedText style={styles.cardLabel}>{item.title}</ThemedText>
              <ThemedText type="title" style={styles.cardAmount}>{item.amount}</ThemedText>
              <ThemedText style={styles.cardSubtitle}>{item.subtitle}</ThemedText>
            </View>
          ))}
        </View>

        <View style={styles.filterRow}>
          {filters.map((value, index) => (
            <Pressable
              key={value}
              style={[
                styles.filterChip,
                selectedFilter === value ? styles.filterChipActive : undefined,
                index < filters.length - 1 ? styles.filterChipSpacing : undefined,
              ]}
              onPress={() => setSelectedFilter(value)}
            >
              <ThemedText style={[styles.filterLabel, selectedFilter === value ? styles.filterLabelActive : undefined]}>
                {value}
              </ThemedText>
            </Pressable>
          ))}
        </View>

        <View style={styles.activitiesSection}>
          <View style={styles.activitiesHeader}>
            <ThemedText type="title">Recent Activities</ThemedText>
            <Pressable onPress={() => router.push('/history')}>
              <ThemedText style={styles.seeAll}>See All</ThemedText>
            </Pressable>
          </View>

          {activeTransactions.length === 0 ? (
            <ThemedText style={styles.emptyText}>No activity found for this period.</ThemedText>
          ) : (
            activeTransactions.slice(0, 4).map((activity) => (
              <View key={activity.id} style={styles.activityCard}>
                <View style={styles.activityLeft}>
                  <View style={[styles.activityIcon, { backgroundColor: activity.type === 'expense' ? '#fee2e2' : '#dcfce7' }]}> 
                    <MaterialIcons name={activity.type === 'expense' ? 'money-off' : 'attach-money'} size={20} color={activity.type === 'expense' ? '#dc2626' : '#047857'} />
                  </View>
                  <View>
                    <ThemedText style={styles.activityTitle}>{activity.title}</ThemedText>
                    <ThemedText style={styles.activitySubtitle}>{activity.date} • {activity.account}</ThemedText>
                  </View>
                </View>
                <ThemedText style={[styles.activityAmount, activity.amount > 0 ? styles.positive : styles.negative]}>
                  {formatAmount(activity.amount, symbol)}
                </ThemedText>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <Pressable style={styles.fab} onPress={() => router.push('/modal')}>
        <MaterialIcons name="add" size={28} color="#ffffff" />
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 140,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#e2e8f0',
    marginRight: 14,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  smallText: {
    fontSize: 14,
    color: '#64748b',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  balanceCard: {
    borderRadius: 32,
    backgroundColor: '#f8fafc',
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  labelText: {
    fontSize: 12,
    color: '#475569',
    letterSpacing: 1,
    marginBottom: 10,
  },
  balanceText: {
    color: '#047857',
    fontSize: 36,
    lineHeight: 42,
    marginBottom: 14,
  },
  balanceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 6,
  },
  balanceAmount: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '700',
    marginLeft: 10,
  },
  smallCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  smallCard: {
    flex: 1,
    borderRadius: 28,
    padding: 18,
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cardLabel: {
    fontSize: 12,
    color: '#525252',
    marginBottom: 6,
  },
  cardAmount: {
    fontSize: 20,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 8,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  filterChip: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: '#f8fafc',
  },
  filterChipActive: {
    backgroundColor: '#047857',
  },
  filterLabel: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  filterLabelActive: {
    color: '#fff',
  },
  activitiesSection: {
    marginBottom: 36,
  },
  activitiesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  seeAll: {
    color: '#047857',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyText: {
    paddingVertical: 28,
    color: '#64748b',
    fontSize: 14,
    textAlign: 'center',
  },
  activityCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 28,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
    marginBottom: 14,
  },
  activityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  filterChipSpacing: {
    marginRight: 12,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  activitySubtitle: {
    marginTop: 4,
    color: '#64748b',
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  positive: {
    color: '#047857',
  },
  negative: {
    color: '#b91c1c',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 28,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#047857',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
});
