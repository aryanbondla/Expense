<script setup>
import { useTransactionsStore } from '../store/transactions'

const transactionsStore = useTransactionsStore()

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in">
    <!-- Total Balance -->
    <div class="card p-6 text-center transform hover:scale-105 transition-transform duration-200">
      <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Total Balance</div>
      <div class="text-3xl font-bold" :class="transactionsStore.totalBalance >= 0 ? 'text-primary-600' : 'text-red-600'">
        {{ formatCurrency(transactionsStore.totalBalance) }}
      </div>
    </div>

    <!-- Total Income -->
    <div class="card p-6 text-center transform hover:scale-105 transition-transform duration-200">
      <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Total Income</div>
      <div class="text-3xl font-bold text-green-600">
        {{ formatCurrency(transactionsStore.totalIncome) }}
      </div>
      <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">+{{ formatCurrency(transactionsStore.totalIncome) }}</div>
    </div>

    <!-- Total Expenses -->
    <div class="card p-6 text-center transform hover:scale-105 transition-transform duration-200">
      <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Total Expenses</div>
      <div class="text-3xl font-bold text-red-600">
        {{ formatCurrency(transactionsStore.totalExpenses) }}
      </div>
      <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">-{{ formatCurrency(transactionsStore.totalExpenses) }}</div>
    </div>
  </div>
</template>