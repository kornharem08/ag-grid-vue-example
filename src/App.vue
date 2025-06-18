<template>
  <div class="app-container">
    <!-- Main Header with Logo and Year Selector -->
    <header class="bg-white shadow-sm border-b border-gray-200 p-4">
      <div class="flex items-center justify-between">
        <!-- Logo and Title -->
        <div class="flex items-center">
          <img src="@/assets/NetOne-Logo-1.png" alt="NetOne Logo" class="h-10 mr-4" />
          <div>
            <h1 class="text-2xl font-bold text-gray-800">Purchase Order Management</h1>
            <p class="text-sm text-gray-500 font-medium">
              Net<span class="text-red-500 font-bold">ONE</span> Network Solution
            </p>
          </div>
        </div>

        <!-- Year Selector and Export -->
        <div class="flex items-center gap-4">
          <button 
            v-if="activeTab === 'table'" 
            @click="exportToExcel"
            class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl shadow transition duration-200"
          >
            Export Excel
          </button>
          
          <div class="flex flex-col">
            <label class="block text-sm font-semibold text-gray-600 mb-1">Select Year</label>
            <div class="relative">
              <select 
                v-model="selectedSetting" 
                @change="handleSettingChange"
                class="w-64 appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-10 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              >
                <option v-for="setting in settings" :key="setting.path" :value="setting.path">
                  {{ setting.name }}
                </option>
              </select>
              <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Tab Navigation -->
    <nav class="bg-white border-b border-gray-200">
      <div class="px-4">
        <div class="flex space-x-8">
          <button
            @click="activeTab = 'table'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
              activeTab === 'table'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            <span class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 6h18m-9 10h9"/>
              </svg>
              Table
            </span>
          </button>
          <button
            @click="activeTab = 'chart'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
              activeTab === 'chart'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            <span class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
              Chart
            </span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Content Area -->
    <main class="flex-1 overflow-hidden">
      <!-- Table Tab -->
      <div v-if="activeTab === 'table'" class="h-full">
        <AgGridComponent 
          :settings="settings"
          :selected-setting="selectedSetting"
          :initial-data="chartData"
          @data-loaded="handleDataLoaded" 
          @setting-changed="handleSettingFromChild"
        />
      </div>

      <!-- Chart Tab -->
      <div v-if="activeTab === 'chart'" class="h-full">
        <div v-if="chartData.length > 0">
          <ChartDashboard :data="chartData" />
        </div>
        <div v-else class="flex items-center justify-center h-full">
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
            <p class="text-gray-500">Please load data from the Table tab first to view charts.</p>
          </div>
        </div>
      </div>
    </main>

    <!-- Loading and Error States -->
    <LoadingSpinner v-if="loading" message="กำลังโหลดข้อมูล..." />
    <ErrorModal :is-open="showError" :message="errorMessage" @close="closeError" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { apiService } from '@/services/apiService'
import AgGridComponent from '@/components/DataGrid.vue'
import ChartDashboard from '@/components/ChartDashboard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorModal from '@/components/ErrorModal.vue'
import type { PurchaseOrder } from '@/types/purchaseOrder'
import type { Setting } from '@/types/setting'
import { snakeToCamel } from '@/utils/transform'
import * as XLSX from 'xlsx'

const activeTab = ref<'table' | 'chart'>('table')
const chartData = ref<PurchaseOrder[]>([])
const settings = ref<Setting[]>([])
const selectedSetting = ref<string>('')
const loading = ref<boolean>(false)
const showError = ref<boolean>(false)
const errorMessage = ref<string>('')

// Handle data loaded from child component
const handleDataLoaded = (data: PurchaseOrder[]) => {
  chartData.value = data
}

// Handle setting change from child
const handleSettingFromChild = (newSetting: string) => {
  selectedSetting.value = newSetting
}

// Handle setting change from parent
const handleSettingChange = async () => {
  console.log('Setting changed to:', selectedSetting.value)
  await fetchData()
}

const showErrorMessage = (message: string) => {
  errorMessage.value = message
  showError.value = true
}

const closeError = () => {
  showError.value = false
  errorMessage.value = ''
}

function getLast<T>(arr: T[]): T | undefined {
  return arr.length > 0 ? arr[arr.length - 1] : undefined
}

const handleError = (error: any, context: string): string => {
  console.error(`Error in ${context}:`, error)
  if (error.response) {
    const status = error.response.status
    switch (status) {
      case 400: return `ข้อมูลไม่ถูกต้อง (${context})`
      case 401: return 'กรุณาเข้าสู่ระบบใหม่'
      case 403: return 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้'
      case 404: return `ไม่พบข้อมูลที่ต้องการ (${context})`
      case 500: return 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ กรุณาลองใหม่ภายหลัง'
      default: return `เกิดข้อผิดพลาด (${status}): ${error.response.data?.message || 'กรุณาลองใหม่อีกครั้ง'}`
    }
  } else if (error.request) {
    return 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่อ'
  } else {
    return `เกิดข้อผิดพลาด: ${error.message || 'กรุณาลองใหม่อีกครั้ง'}`
  }
}

const fetchSettings = async (): Promise<void> => {
  try {
    loading.value = true
    const response = await apiService.getSettings()
    console.log('Settings API Response:', response.data)

    settings.value = response.data.data as Setting[]

    if (settings.value.length > 0) {
      const lastSetting = getLast(settings.value)
      selectedSetting.value = lastSetting?.path || ''
      console.log('Selected setting path:', selectedSetting.value)

      await fetchData()
    } else {
      showErrorMessage('ไม่พบการตั้งค่า กรุณาตั้งค่าก่อนใช้งาน')
    }
  } catch (error) {
    const errorMessage = handleError(error, 'การโหลดการตั้งค่า')
    showErrorMessage(errorMessage)
  } finally {
    loading.value = false
  }
}

const fetchData = async (): Promise<void> => {
  try {
    loading.value = true

    const data = {
      path: selectedSetting.value,
    }

    console.log('Fetching data with path:', data.path)
    const response = await apiService.getPurchaseOrders(data)
    console.log('API Response:', response.data)

    const transformedData = snakeToCamel(response.data.data) as PurchaseOrder[]

    if (transformedData.length > 0) {
      console.log('Sample record before display:', transformedData[0])
    }

    chartData.value = transformedData
  } catch (error) {
    const errorMessage = handleError(error, 'การโหลดข้อมูล')
    showErrorMessage(errorMessage)
    chartData.value = []
  } finally {
    loading.value = false
  }
}

const exportToExcel = (): void => {
  if (chartData.value.length === 0) {
    showErrorMessage('ไม่มีข้อมูลที่จะส่งออก')
    return
  }

  try {
    // Create headers
    const headers = [
      'Job ID', 'Type', 'Sales Team', 'Project Manager', 'Purchasing', 'Customer',
      'Product Code', 'Product Description', 'Ordered', 'Received', 'Remain',
      'PR', 'PR Date', 'PO', 'PO Date', 'Request Date', 'PO Receive Date',
      'Distribution', 'Received Date', 'Stock Picking Out Date', 'Delivery Date',
      'Status', 'Remark'
    ]

    // Create data rows
    const dataRows = chartData.value.map(row => [
      row.jobIdNo || '',
      row.type || '',
      row.salesTeam || '',
      row.projectManager || '',
      row.purchasing || '',
      row.customer || '',
      row.productCode || '',
      row.productDescription || '',
      row.ordered || '',
      row.received || '',
      row.remain || '',
      row.pr || '',
      row.prDate || '',
      row.po || '',
      row.poDate || '',
      row.requestDate || '',
      row.poReceiveDate || '',
      row.distribution || '',
      row.receivedDate || '',
      row.stockPickingOutDate || '',
      row.deliveryDate || '',
      row.status || '',
      row.remark || ''
    ])

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet([headers, ...dataRows])
    
    // Create workbook
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'PurchaseOrders')
    
    // Download file
    XLSX.writeFile(wb, `PurchaseOrders_${new Date().toISOString().split('T')[0]}.xlsx`)
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการส่งออก Excel:', error)
    showErrorMessage('เกิดข้อผิดพลาดในการส่งออก Excel')
  }
}

onMounted(async () => {
  await fetchSettings()
})
</script>

<style scoped>
.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  overflow: auto;
}
</style>