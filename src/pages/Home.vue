<script setup>
import BalanceCard from '../components/BalanceCard.vue'
import TransactionForm from '../components/TransactionForm.vue'
import TransactionItem from '../components/TransactionItem.vue'
import { useTransactionsStore } from '../store/transactions'

const transactionsStore = useTransactionsStore()
</script>

<template>
  <div class="p-6 pb-20 lg:pb-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">Track your income and expenses</p>
      </div>

      <!-- Balance Overview -->
      <BalanceCard />

      <!-- Add Transaction Form -->
      <TransactionForm />

      <!-- Recent Transactions -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold">Recent Transactions</h2>
          <router-link 
            to="/statistics"
            class="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
          >
            View All →
          </router-link>
        </div>

        <div class="space-y-3">
          <TransactionItem
            v-for="transaction in transactionsStore.recentTransactions"
            :key="transaction.id"
            :transaction="transaction"
          />
          
          <!-- Empty State -->
          <div v-if="transactionsStore.recentTransactions.length === 0" class="text-center py-12">
            <div class="text-6xl mb-4">💰</div>
            <h3 class="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">No transactions yet</h3>
            <p class="text-gray-500 dark:text-gray-500 mb-6">
              Start tracking your finances by adding your first transaction!
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>