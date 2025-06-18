<template>
  <div class="chart-container">
    <h3 class="text-lg font-semibold mb-4">{{ title }}</h3>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, type PropType } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'vue-chartjs'
import type { PurchaseOrder } from '@/types/purchaseOrder'

ChartJS.register(CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend)

const props = defineProps({
  data: {
    type: Array as PropType<PurchaseOrder[]>,
    required: true
  },
  chartType: {
    type: String as PropType<'projectManager' | 'salesTeam'>,
    required: true
  },
  title: {
    type: String,
    required: true
  }
})

const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: ChartJS | null = null

const processData = () => {
  const countMap = new Map<string, number>()
  
  props.data.forEach(order => {
    const key = props.chartType === 'projectManager' 
      ? order.projectManager || 'Unknown'
      : order.salesTeam || 'Unknown'
    
    countMap.set(key, (countMap.get(key) || 0) + 1)
  })

  const labels = Array.from(countMap.keys())
  const values = Array.from(countMap.values())

  return {
    labels,
    datasets: [
      {
        label: props.chartType === 'projectManager' ? 'จำนวนโปรเจค (Project Manager)' : 'จำนวนโปรเจค (Sales Team)',
        data: values,
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 205, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1
      }
    ]
  }
}

const createChart = () => {
  if (!chartCanvas.value) return

  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = chartCanvas.value.getContext('2d')
  if (!ctx) return

  chartInstance = new ChartJS(ctx, {
    type: 'bar',
    data: processData(),
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: props.title
        },
        legend: {
          display: true
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  })
}

onMounted(() => {
  createChart()
})

watch(() => props.data, () => {
  createChart()
}, { deep: true })
</script>

<style scoped>
.chart-container {
  height: 400px;
  width: 100%;
}

canvas {
  max-height: 350px;
}
</style> 