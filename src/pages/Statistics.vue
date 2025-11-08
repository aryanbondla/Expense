<script setup>
import { ref } from 'vue'
import ChartView from '../components/ChartView.vue'
import TransactionList from '../components/TransactionList.vue'
import { useTransactionsStore } from '../store/transactions'

const transactionsStore = useTransactionsStore()
const activeTab = ref('overview')

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}
</script>

<template>
  <div class="p-6 pb-20 lg:pb-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Statistics</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">Analyze your spending patterns</p>
      </div>

      <!-- Tab Navigation -->
      <div class="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        <button
          @click="activeTab = 'overview'"
          :class="activeTab === 'overview' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''"
          class="flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200"
        >
          📊 Overview
        </button>
        <button
          @click="activeTab = 'transactions'"
          :class="activeTab === 'transactions' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''"
          class="flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200"
        >
          📝 All Transactions
        </button>
      </div>

      <!-- Overview Tab -->
      <div v-if="activeTab === 'overview'" class="space-y-8">
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="card p-6 text-center">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Transactions</div>
            <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {{ transactionsStore.transactions.length }}
            </div>
          </div>
          
          <div class="card p-6 text-center">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Average Income</div>
            <div class="text-2xl font-bold text-green-600">
              {{ formatCurrency(transactionsStore.totalIncome / Math.max(transactionsStore.transactions.filter(t => t.type === 'income').length, 1)) }}
            </div>
          </div>
          
          <div class="card p-6 text-center">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Average Expense</div>
            <div class="text-2xl font-bold text-red-600">
              {{ formatCurrency(transactionsStore.totalExpenses / Math.max(transactionsStore.transactions.filter(t => t.type === 'expense').length, 1)) }}
            </div>
          </div>
          
          <div class="card p-6 text-center">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Savings Rate</div>
            <div class="text-2xl font-bold" :class="(transactionsStore.totalIncome - transactionsStore.totalExpenses) >= 0 ? 'text-green-600' : 'text-red-600'">
              {{ transactionsStore.totalIncome > 0 ? Math.round(((transactionsStore.totalIncome - transactionsStore.totalExpenses) / transactionsStore.totalIncome) * 100) : 0 }}%
            </div>
          </div>
        </div>

        <!-- Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Expense Categories -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold mb-4">Expenses by Category</h3>
            <div v-if="Object.keys(transactionsStore.expensesByCategory).length > 0">
              <ChartView type="pie" />
            </div>
            <div v-else class="text-center py-12 text-gray-500 dark:text-gray-400">
              <div class="text-4xl mb-2">📊</div>
              <p>No expense data to display</p>
            </div>
          </div>

          <!-- Monthly Trends -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold mb-4">Monthly Trends</h3>
            <div v-if="transactionsStore.monthlyData.labels.length > 0">
              <ChartView type="line" />
            </div>
            <div v-else class="text-center py-12 text-gray-500 dark:text-gray-400">
              <div class="text-4xl mb-2">📈</div>
              <p>No trend data to display</p>
            </div>
          </div>
        </div>

        <!-- Category Breakdown -->
        <div class="card p-6" v-if="Object.keys(transactionsStore.expensesByCategory).length > 0">
          <h3 class="text-lg font-semibold mb-4">Category Breakdown</h3>
          <div class="space-y-3">
            <div
              v-for="[category, amount] in Object.entries(transactionsStore.expensesByCategory).sort((a, b) => b[1] - a[1])"
              :key="category"
              class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <span class="font-medium">{{ category }}</span>
              <div class="flex items-center space-x-3">
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ Math.round((amount / transactionsStore.totalExpenses) * 100) }}%
                </div>
                <span class="font-semibold text-red-600">
                  {{ formatCurrency(amount) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- All Transactions Tab -->
      <div v-if="activeTab === 'transactions'">
        <TransactionList />
      </div>
    </div>
  </div>
</template>