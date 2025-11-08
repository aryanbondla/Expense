<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import { useTransactionsStore } from '../store/transactions'

Chart.register(...registerables)

const props = defineProps({
  type: {
    type: String,
    required: true // 'pie' or 'line'
  }
})

const transactionsStore = useTransactionsStore()
const chartRef = ref(null)
let chartInstance = null

const chartData = computed(() => {
  if (props.type === 'pie') {
    const expenses = transactionsStore.expensesByCategory
    return {
      labels: Object.keys(expenses),
      datasets: [{
        data: Object.values(expenses),
        backgroundColor: [
          '#EF4444', '#F97316', '#F59E0B', '#EAB308',
          '#84CC16', '#22C55E', '#10B981', '#14B8A6',
          '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1',
          '#8B5CF6', '#A855F7', '#D946EF', '#EC4899'
        ],
        borderWidth: 0,
        hoverOffset: 4
      }]
    }
  } else {
    const monthlyData = transactionsStore.monthlyData
    return {
      labels: monthlyData.labels,
      datasets: [
        {
          label: 'Income',
          data: monthlyData.income,
          borderColor: '#22C55E',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Expenses',
          data: monthlyData.expenses,
          borderColor: '#EF4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    }
  }
})

const chartOptions = computed(() => {
  const isDark = document.documentElement.classList.contains('dark')
  const textColor = isDark ? '#E5E7EB' : '#374151'
  
  if (props.type === 'pie') {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: textColor,
            padding: 20,
            usePointStyle: true
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || ''
              const value = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(context.raw)
              return `${label}: ${value}`
            }
          }
        }
      }
    }
  } else {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: textColor,
            usePointStyle: true
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColor
          },
          grid: {
            color: isDark ? '#374151' : '#E5E7EB'
          }
        },
        y: {
          ticks: {
            color: textColor,
            callback: function(value) {
              return '$' + value.toLocaleString()
            }
          },
          grid: {
            color: isDark ? '#374151' : '#E5E7EB'
          }
        }
      }
    }
  }
})

const createChart = () => {
  if (chartInstance) {
    chartInstance.destroy()
  }
  
  if (chartRef.value) {
    chartInstance = new Chart(chartRef.value, {
      type: props.type === 'pie' ? 'doughnut' : 'line',
      data: chartData.value,
      options: chartOptions.value
    })
  }
}

const updateChart = () => {
  if (chartInstance) {
    chartInstance.data = chartData.value
    chartInstance.options = chartOptions.value
    chartInstance.update()
  }
}

onMounted(() => {
  createChart()
})

watch([chartData, chartOptions], updateChart, { deep: true })
</script>

<template>
  <div class="relative h-80">
    <canvas ref="chartRef"></canvas>
  </div>
</template>