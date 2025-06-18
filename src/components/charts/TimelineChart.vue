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
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'vue-chartjs'
import type { PurchaseOrder } from '@/types/purchaseOrder'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler
)

const props = defineProps({
  data: {
    type: Array as PropType<PurchaseOrder[]>,
    required: true
  },
  chartType: {
    type: String as PropType<'receivedDate' | 'stockPickingOutDate'>,
    required: true
  },
  title: {
    type: String,
    required: true
  }
})

const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: ChartJS | null = null

const parseDate = (dateStr: string | null | undefined): Date | null => {
  if (!dateStr) return null
  
  // Handle different date formats
  const formats = [
    // DD-MMM-YY format
    /^(\d{1,2})-([A-Za-z]{3})-(\d{2})$/,
    // DD/MM/YYYY format
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
    // YYYY-MM-DD format
    /^(\d{4})-(\d{1,2})-(\d{1,2})$/
  ]

  const monthMap: { [key: string]: number } = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  }

  // Try DD-MMM-YY format first
  const match1 = dateStr.match(formats[0])
  if (match1) {
    const [, day, month, year] = match1
    const fullYear = parseInt(year) < 50 ? 2000 + parseInt(year) : 1900 + parseInt(year)
    return new Date(fullYear, monthMap[month], parseInt(day))
  }

  // Try other formats
  const date = new Date(dateStr)
  return isNaN(date.getTime()) ? null : date
}

const processData = () => {
  const monthlyData = new Map<string, number>()
  
  props.data.forEach(order => {
    const dateField = props.chartType === 'receivedDate' ? order.receivedDate : order.stockPickingOutDate
    const date = parseDate(dateField)
    
    if (date) {
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const quantity = order.received || order.ordered || 0
      monthlyData.set(monthKey, (monthlyData.get(monthKey) || 0) + quantity)
    }
  })

  // Sort by date
  const sortedEntries = Array.from(monthlyData.entries()).sort((a, b) => a[0].localeCompare(b[0]))
  
  const labels = sortedEntries.map(([monthKey]) => {
    const [year, month] = monthKey.split('-')
    return `${month}/${year}`
  })
  
  const values = sortedEntries.map(([, value]) => value)

  const label = props.chartType === 'receivedDate' 
    ? 'จำนวนสินค้าเข้าคลัง' 
    : 'จำนวนสินค้าออกคลัง'

  return {
    labels,
    datasets: [
      {
        label,
        data: values,
        borderColor: props.chartType === 'receivedDate' ? 'rgb(75, 192, 192)' : 'rgb(255, 99, 132)',
        backgroundColor: props.chartType === 'receivedDate' ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: props.chartType === 'receivedDate' ? 'rgb(75, 192, 192)' : 'rgb(255, 99, 132)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
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
    type: 'line',
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
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.parsed.y.toLocaleString()} ชิ้น`
            }
          }
        }
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'เดือน/ปี'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'จำนวน (ชิ้น)'
          },
          beginAtZero: true
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
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