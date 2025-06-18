<template>
  <div class="chart-dashboard p-6">
    <h2 class="text-2xl font-bold mb-6">Dashboard Analytics</h2>
    
    <!-- Bar Charts Section -->
    <div class="section mb-8">
      <h3 class="text-xl font-semibold mb-4 text-blue-600">Bar Charts</h3>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white p-4 rounded-lg shadow-md">
          <BarChart 
            :data="data" 
            chart-type="projectManager" 
            title="จำนวนโปรเจคแต่ละ Project Manager"
          />
        </div>
        <div class="bg-white p-4 rounded-lg shadow-md">
          <BarChart 
            :data="data" 
            chart-type="salesTeam" 
            title="จำนวนโปรเจคแต่ละ Sales Team"
          />
        </div>
      </div>
    </div>

    <!-- Pie Charts Section -->
    <div class="section mb-8">
      <h3 class="text-xl font-semibold mb-4 text-green-600">Pie Charts</h3>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="bg-white p-4 rounded-lg shadow-md">
          <PieChart 
            :data="data" 
            chart-type="distributor" 
            title="สัดส่วน Distributor"
          />
        </div>
        <div class="bg-white p-4 rounded-lg shadow-md">
          <PieChart 
            :data="data" 
            chart-type="customer" 
            title="สัดส่วนลูกค้า"
          />
        </div>
        <div class="bg-white p-4 rounded-lg shadow-md">
          <PieChart 
            :data="data" 
            chart-type="status" 
            title="สัดส่วน Status"
          />
        </div>
      </div>
    </div>

    <!-- Timeline Charts Section -->
    <div class="section mb-8">
      <h3 class="text-xl font-semibold mb-4 text-purple-600">Timeline Volume Charts</h3>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white p-4 rounded-lg shadow-md">
          <TimelineChart 
            :data="data" 
            chart-type="receivedDate" 
            title="จำนวนสินค้าเข้าคลังแต่ละเดือน"
          />
        </div>
        <div class="bg-white p-4 rounded-lg shadow-md">
          <TimelineChart 
            :data="data" 
            chart-type="stockPickingOutDate" 
            title="จำนวนสินค้าออกคลังแต่ละเดือน"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type PropType } from 'vue'
import type { PurchaseOrder } from '@/types/purchaseOrder'
import BarChart from './charts/BarChart.vue'
import PieChart from './charts/PieChart.vue'
import TimelineChart from './charts/TimelineChart.vue'

defineProps({
  data: {
    type: Array as PropType<PurchaseOrder[]>,
    required: true
  }
})
</script>

<style scoped>
.chart-dashboard {
  background-color: #f8fafc;
  min-height: 100vh;
}

.section {
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 2rem;
}

.section:last-child {
  border-bottom: none;
}
</style> 