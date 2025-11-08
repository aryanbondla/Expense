<script setup>
import { ref, computed } from 'vue'
import { useTransactionsStore } from '../store/transactions'
import TransactionItem from './TransactionItem.vue'

const transactionsStore = useTransactionsStore()

const filterType = ref('all')
const filterCategory = ref('all')
const searchQuery = ref('')

const filteredTransactions = computed(() => {
  let filtered = [...transactionsStore.transactions]
  
  // Filter by type
  if (filterType.value !== 'all') {
    filtered = filtered.filter(t => t.type === filterType.value)
  }
  
  // Filter by category
  if (filterCategory.value !== 'all') {
    filtered = filtered.filter(t => t.category === filterCategory.value)
  }
  
  // Filter by search query
  if (searchQuery.value) {
    filtered = filtered.filter(t => 
      t.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  return filtered
})
</script>

<template>
  <div class="space-y-6">
    <div class="card p-6">
      <h2 class="text-xl font-semibold mb-4">Transaction History</h2>
      
      <!-- Filters -->
      <div class="flex flex-col md:flex-row gap-4 mb-6">
        <!-- Search -->
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search transactions..."
            class="input-field"
          />
        </div>
        
        <!-- Type Filter -->
        <select v-model="filterType" class="input-field md:w-40">
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        
        <!-- Category Filter -->
        <select v-model="filterCategory" class="input-field md:w-48">
          <option value="all">All Categories</option>
          <option v-for="category in transactionsStore.categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
      
      <!-- Results Summary -->
      <div class="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Showing {{ filteredTransactions.length }} of {{ transactionsStore.transactions.length }} transactions
      </div>
    </div>

    <!-- Transaction List -->
    <div class="space-y-3">
      <TransactionItem
        v-for="transaction in filteredTransactions"
        :key="transaction.id"
        :transaction="transaction"
      />
      
      <!-- Empty State -->
      <div v-if="filteredTransactions.length === 0" class="card p-8 text-center">
        <div class="text-6xl mb-4">📝</div>
        <h3 class="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">No transactions found</h3>
        <p class="text-gray-500 dark:text-gray-500">
          {{ transactionsStore.transactions.length === 0 
             ? 'Start by adding your first transaction!' 
             : 'Try adjusting your filters to see more results.' }}
        </p>
      </div>
    </div>
  </div>
</template>