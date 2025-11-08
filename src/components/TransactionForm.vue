<script setup>
import { ref } from 'vue'
import { useTransactionsStore } from '../store/transactions'

const transactionsStore = useTransactionsStore()

const showForm = ref(false)
const formData = ref({
  type: 'expense',
  description: '',
  amount: '',
  category: '',
  date: new Date().toISOString().split('T')[0]
})

const resetForm = () => {
  formData.value = {
    type: 'expense',
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  }
}

const handleSubmit = () => {
  if (!formData.value.description || !formData.value.amount || !formData.value.category) {
    return
  }

  transactionsStore.addTransaction({
    ...formData.value,
    amount: parseFloat(formData.value.amount)
  })

  resetForm()
  showForm.value = false
}
</script>

<template>
  <div class="mb-8">
    <!-- Add Transaction Button -->
    <button 
      @click="showForm = true"
      v-if="!showForm"
      class="btn-primary w-full md:w-auto flex items-center justify-center space-x-2 animate-slide-up"
    >
      <span class="text-xl">➕</span>
      <span>Add Transaction</span>
    </button>

    <!-- Transaction Form -->
    <div v-if="showForm" class="card p-6 animate-slide-up">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold">Add New Transaction</h3>
        <button @click="showForm = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl">
          ✕
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Type Toggle -->
        <div class="flex space-x-2">
          <button
            type="button"
            @click="formData.type = 'income'"
            :class="formData.type === 'income' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'"
            class="flex-1 py-2 px-4 rounded-lg font-medium transition-colors duration-200"
          >
            💰 Income
          </button>
          <button
            type="button"
            @click="formData.type = 'expense'"
            :class="formData.type === 'expense' ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'"
            class="flex-1 py-2 px-4 rounded-lg font-medium transition-colors duration-200"
          >
            💸 Expense
          </button>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <input
            v-model="formData.description"
            type="text"
            placeholder="Enter description..."
            class="input-field"
            required
          />
        </div>

        <!-- Amount -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Amount
          </label>
          <input
            v-model="formData.amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            class="input-field"
            required
          />
        </div>

        <!-- Category -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <select v-model="formData.category" class="input-field" required>
            <option value="">Select a category</option>
            <option v-for="category in transactionsStore.categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>

        <!-- Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date
          </label>
          <input
            v-model="formData.date"
            type="date"
            class="input-field"
            required
          />
        </div>

        <!-- Form Actions -->
        <div class="flex space-x-3 pt-4">
          <button type="submit" class="btn-primary flex-1">
            Add Transaction
          </button>
          <button type="button" @click="showForm = false" class="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>