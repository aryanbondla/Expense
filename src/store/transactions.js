import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions = ref([])
  
  const categories = [
    'Food & Drinks',
    'Transportation', 
    'Entertainment',
    'Shopping',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Salary',
    'Freelance',
    'Business',
    'Investment',
    'Other'
  ]
  
  // Load data from localStorage on store initialization
  const loadTransactions = () => {
    const saved = localStorage.getItem('expense-tracker-transactions')
    if (saved) {
      transactions.value = JSON.parse(saved)
    }
  }
  
  // Save to localStorage
  const saveTransactions = () => {
    localStorage.setItem('expense-tracker-transactions', JSON.stringify(transactions.value))
  }
  
  // Add transaction
  const addTransaction = (transaction) => {
    const newTransaction = {
      id: Date.now(),
      ...transaction,
      date: transaction.date || new Date().toISOString().split('T')[0]
    }
    transactions.value.unshift(newTransaction)
    saveTransactions()
  }
  
  // Delete transaction
  const deleteTransaction = (id) => {
    transactions.value = transactions.value.filter(t => t.id !== id)
    saveTransactions()
  }
  
  // Computed properties
  const totalBalance = computed(() => {
    return transactions.value.reduce((total, transaction) => {
      return transaction.type === 'income' 
        ? total + transaction.amount 
        : total - transaction.amount
    }, 0)
  })
  
  const totalIncome = computed(() => {
    return transactions.value
      .filter(t => t.type === 'income')
      .reduce((total, t) => total + t.amount, 0)
  })
  
  const totalExpenses = computed(() => {
    return transactions.value
      .filter(t => t.type === 'expense')
      .reduce((total, t) => total + t.amount, 0)
  })
  
  const recentTransactions = computed(() => {
    return transactions.value.slice(0, 5)
  })
  
  const expensesByCategory = computed(() => {
    const expenses = transactions.value.filter(t => t.type === 'expense')
    const categoryTotals = {}
    
    expenses.forEach(transaction => {
      if (categoryTotals[transaction.category]) {
        categoryTotals[transaction.category] += transaction.amount
      } else {
        categoryTotals[transaction.category] = transaction.amount
      }
    })
    
    return categoryTotals
  })
  
  const monthlyData = computed(() => {
    const monthlyIncome = {}
    const monthlyExpenses = {}
    
    transactions.value.forEach(transaction => {
      const date = new Date(transaction.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      if (transaction.type === 'income') {
        monthlyIncome[monthKey] = (monthlyIncome[monthKey] || 0) + transaction.amount
      } else {
        monthlyExpenses[monthKey] = (monthlyExpenses[monthKey] || 0) + transaction.amount
      }
    })
    
    const allMonths = new Set([...Object.keys(monthlyIncome), ...Object.keys(monthlyExpenses)])
    const sortedMonths = Array.from(allMonths).sort()
    
    return {
      labels: sortedMonths.map(month => {
        const [year, monthNum] = month.split('-')
        const date = new Date(year, monthNum - 1)
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      }),
      income: sortedMonths.map(month => monthlyIncome[month] || 0),
      expenses: sortedMonths.map(month => monthlyExpenses[month] || 0)
    }
  })
  
  // Initialize store
  loadTransactions()
  
  return {
    transactions,
    categories,
    addTransaction,
    deleteTransaction,
    totalBalance,
    totalIncome,
    totalExpenses,
    recentTransactions,
    expensesByCategory,
    monthlyData
  }
})