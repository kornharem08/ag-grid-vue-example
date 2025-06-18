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
  ArcElement,
  DoughnutController,
  PieController,
  Tooltip,
  Legend,
} from 'chart.js'
import { Pie } from 'vue-chartjs'
import type { PurchaseOrder } from '@/types/purchaseOrder'

ChartJS.register(ArcElement, DoughnutController, PieController, Tooltip, Legend)

const props = defineProps({
  data: {
    type: Array as PropType<PurchaseOrder[]>,
    required: true
  },
  chartType: {
    type: String as PropType<'distributor' | 'customer' | 'status'>,
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
    let key: string
    
    switch(props.chartType) {
      case 'distributor':
        key = order.distribution || 'Unknown'
        break
      case 'customer':
        key = order.customer || 'Unknown'
        break
      case 'status':
        key = order.status || 'Unknown'
        break
      default:
        key = 'Unknown'
    }
    
    countMap.set(key, (countMap.get(key) || 0) + 1)
  })

  const labels = Array.from(countMap.keys())
  const values = Array.from(countMap.values())

  // Generate colors dynamically
  const colors = labels.map((_, index) => {
    const hue = (index * 360) / labels.length
    return `hsl(${hue}, 70%, 60%)`
  })

  const borderColors = labels.map((_, index) => {
    const hue = (index * 360) / labels.length
    return `hsl(${hue}, 70%, 50%)`
  })

  return {
    labels,
    datasets: [
      {
        label: getDatasetLabel(),
        data: values,
        backgroundColor: colors,
        borderColor: borderColors,
        borderWidth: 2
      }
    ]
  }
}

const getDatasetLabel = () => {
  switch(props.chartType) {
    case 'distributor':
      return 'จำนวน Distributor'
    case 'customer':
      return 'จำนวนลูกค้า'
    case 'status':
      return 'จำนวน Status'
    default:
      return 'จำนวน'
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
    type: 'pie',
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
          display: true,
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
              const percentage = ((context.parsed / total) * 100).toFixed(1)
              return `${context.label}: ${context.parsed} (${percentage}%)`
            }
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