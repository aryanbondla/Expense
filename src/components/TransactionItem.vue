<script setup>
import { useTransactionsStore } from '../store/transactions'

const props = defineProps({
  transaction: {
    type: Object,
    required: true
  }
})

const transactionsStore = useTransactionsStore()

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const handleDelete = () => {
  if (confirm('Are you sure you want to delete this transaction?')) {
    transactionsStore.deleteTransaction(props.transaction.id)
  }
}
</script>

<template>
  <div class="card p-4 hover:shadow-md transition-shadow duration-200 animate-slide-up">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <div class="flex items-center space-x-3 mb-2">
          <span class="text-xl">
            {{ transaction.type === 'income' ? '💰' : '💸' }}
          </span>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-gray-100">
              {{ transaction.description }}
            </h3>
            <div class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span>{{ transaction.category }}</span>
              <span>•</span>
              <span>{{ formatDate(transaction.date) }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex items-center space-x-3">
        <span 
          class="text-lg font-semibold"
          :class="transaction.type === 'income' ? 'text-green-600' : 'text-red-600'"
        >
          {{ transaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
        </span>
        
        <button
          @click="handleDelete"
          class="text-gray-400 hover:text-red-600 transition-colors duration-200 p-1"
          title="Delete transaction"
        >
          🗑️
        </button>
      </div>
    </div>
  </div>
</template>