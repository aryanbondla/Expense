<script setup>
import { RouterView, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()
const isDarkMode = ref(false)

// Initialize theme
onMounted(() => {
  const savedTheme = localStorage.getItem('expense-tracker-theme')
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDarkMode.value = true
    document.documentElement.classList.add('dark')
  }
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

const navigationItems = [
  { name: 'Home', path: '/', icon: '🏠' },
  { name: 'Statistics', path: '/statistics', icon: '📊' },
  { name: 'Settings', path: '/settings', icon: '⚙️' }
]
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Mobile Header -->
    <header class="lg:hidden bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between px-4 py-3">
        <h1 class="text-xl font-bold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
          ExpenseTracker
        </h1>
        <button @click="toggleTheme" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          {{ isDarkMode ? '☀️' : '🌙' }}
        </button>
      </div>
    </header>

    <div class="lg:flex">
      <!-- Sidebar -->
      <aside class="hidden lg:block w-64 bg-white dark:bg-gray-800 shadow-lg min-h-screen">
        <div class="p-6">
          <h1 class="text-2xl font-bold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent mb-8">
            ExpenseTracker
          </h1>
          
          <nav class="space-y-2">
            <router-link
              v-for="item in navigationItems"
              :key="item.path"
              :to="item.path"
              class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              :class="{ 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 border-r-2 border-primary-600': $route.path === item.path }"
            >
              <span class="text-xl">{{ item.icon }}</span>
              <span class="font-medium">{{ item.name }}</span>
            </router-link>
          </nav>
          
          <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button @click="toggleTheme" class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full">
              <span class="text-xl">{{ isDarkMode ? '☀️' : '🌙' }}</span>
              <span class="font-medium">{{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 lg:ml-0">
        <RouterView />
      </main>
    </div>

    <!-- Mobile Navigation -->
    <nav class="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2">
      <div class="flex justify-around">
        <router-link
          v-for="item in navigationItems"
          :key="item.path"
          :to="item.path"
          class="flex flex-col items-center py-2 px-3 rounded-lg transition-colors duration-200"
          :class="{ 'text-primary-600 dark:text-primary-400': $route.path === item.path, 'text-gray-500 dark:text-gray-400': $route.path !== item.path }"
        >
          <span class="text-xl mb-1">{{ item.icon }}</span>
          <span class="text-xs font-medium">{{ item.name }}</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>