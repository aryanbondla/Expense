<script setup>
import { ref, onMounted } from 'vue'
import { useTransactionsStore } from '../store/transactions'

const transactionsStore = useTransactionsStore()
const isDarkMode = ref(false)

onMounted(() => {
  const savedTheme = localStorage.getItem('expense-tracker-theme')
  isDarkMode.value = savedTheme === 'dark'
})

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('expense-tracker-theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('expense-tracker-theme', 'light')
  }
}

const exportData = () => {
  const data = JSON.stringify(transactionsStore.transactions, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `expense-tracker-backup-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

const importData = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const importedData = JSON.parse(e.target.result)
      if (Array.isArray(importedData) && confirm('This will replace all existing data. Continue?')) {
        // Clear current data
        transactionsStore.transactions.splice(0)
        // Add imported data
        importedData.forEach(transaction => {
          transactionsStore.transactions.push(transaction)
        })
        // Save to localStorage
        localStorage.setItem('expense-tracker-transactions', JSON.stringify(transactionsStore.transactions))
        alert('Data imported successfully!')
      }
    } catch (error) {
      alert('Invalid file format. Please select a valid JSON file.')
    }
  }
  reader.readAsText(file)
}

const clearData = () => {
  if (confirm('Are you sure you want to delete all transactions? This cannot be undone.')) {
    transactionsStore.transactions.splice(0)
    localStorage.removeItem('expense-tracker-transactions')
    alert('All data has been cleared.')
  }
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}
</script>

<template>
  <div class="p-6 pb-20 lg:pb-6">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">Manage your preferences and data</p>
      </div>

      <div class="space-y-8">
        <!-- Account Overview -->
        <div class="card p-6">
          <h2 class="text-xl font-semibold mb-4">Account Overview</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="text-2xl font-bold text-primary-600 mb-1">
                {{ transactionsStore.transactions.length }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Total Transactions</div>
            </div>
            <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="text-2xl font-bold text-green-600 mb-1">
                {{ formatCurrency(transactionsStore.totalIncome) }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Total Income</div>
            </div>
            <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="text-2xl font-bold text-red-600 mb-1">
                {{ formatCurrency(transactionsStore.totalExpenses) }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Total Expenses</div>
            </div>
          </div>
        </div>

        <!-- Appearance -->
        <div class="card p-6">
          <h2 class="text-xl font-semibold mb-4">Appearance</h2>
          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium">Dark Mode</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                Toggle between light and dark themes
              </div>
            </div>
            <button
              @click="toggleTheme"
              :class="isDarkMode ? 'bg-primary-600' : 'bg-gray-200'"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <span
                :class="isDarkMode ? 'translate-x-6' : 'translate-x-1'"
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              />
            </button>
          </div>
        </div>

        <!-- Data Management -->
        <div class="card p-6">
          <h2 class="text-xl font-semibold mb-4">Data Management</h2>
          <div class="space-y-4">
            <!-- Export Data -->
            <div class="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div>
                <div class="font-medium text-green-800 dark:text-green-200">Export Data</div>
                <div class="text-sm text-green-600 dark:text-green-300">
                  Download your transactions as a JSON file
                </div>
              </div>
              <button @click="exportData" class="btn-primary bg-green-600 hover:bg-green-700">
                📥 Export
              </button>
            </div>

            <!-- Import Data -->
            <div class="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div>
                <div class="font-medium text-blue-800 dark:text-blue-200">Import Data</div>
                <div class="text-sm text-blue-600 dark:text-blue-300">
                  Restore transactions from a backup file
                </div>
              </div>
              <div>
                <input
                  type="file"
                  accept=".json"
                  @change="importData"
                  class="hidden"
                  id="importFile"
                />
                <label for="importFile" class="btn-primary bg-blue-600 hover:bg-blue-700 cursor-pointer">
                  📤 Import
                </label>
              </div>
            </div>

            <!-- Clear Data -->
            <div class="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div>
                <div class="font-medium text-red-800 dark:text-red-200">Clear All Data</div>
                <div class="text-sm text-red-600 dark:text-red-300">
                  Permanently delete all transactions (cannot be undone)
                </div>
              </div>
              <button @click="clearData" class="btn-primary bg-red-600 hover:bg-red-700">
                🗑️ Clear All
              </button>
            </div>
          </div>
        </div>

        <!-- About -->
        <div class="card p-6">
          <h2 class="text-xl font-semibold mb-4">About</h2>
          <div class="space-y-3 text-gray-600 dark:text-gray-400">
            <p><strong>ExpenseTracker</strong> - Personal Finance Management</p>
            <p>Version 1.0.0</p>
            <p>Built with Vue 3, Pinia, and Chart.js</p>
            <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p class="text-sm">
                Keep track of your income and expenses with beautiful charts and detailed analytics.
                Your data is stored locally on your device for maximum privacy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>