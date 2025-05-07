<template>
  <div class="ag-grid-container bg-gradient-to-br from-white via-gray-50 to-gray-100 p-8 rounded-2xl shadow-2xl border border-gray-200">
    <!-- Header -->
    <div class="mb-8 flex flex-col md:flex-row md:items-center gap-6">
      <a href="http://localhost:5173/" class="ag-logo">
        <img 
          src="@/assets/NetOne-Logo-1.png" 
          alt="NetONE Logo" 
        />
      </a>
      <div>
        <div class="text-left">
          <h1 class="text-3xl font-extrabold text-gray-800 leading-tight tracking-tight">
            PurchaseOrder Record Table<br />
            <p class="text-lg text-gray-500 font-medium">Net<span class="text-red-500 font-bold">ONE</span> Network Solution</p>
          </h1>          
        </div>
      </div>
      
      <!-- Dropdown aligned to the right -->
      <div class="w-full md:w-auto ml-auto">
        <label class="block text-sm font-semibold text-gray-600 mb-2">Select Setting</label>
        <div class="relative">
          <select 
            v-model="selectedSetting" 
            @change="handleSettingChange"
            class="w-full md:w-64 appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-10 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          >
            <option 
              v-for="setting in settings" 
              :key="setting.path" 
              :value="setting.path"
            >
              {{ setting.name }}
            </option>
          </select>
          <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Grid -->
    <div 
      class="ag-theme-alpine rounded-xl overflow-hidden border border-gray-300 shadow-inner" 
      style="height: 85vh"
    >
      <ag-grid-vue
        style="width: 100%; height: 100%"
        :columnDefs="columnDefs"
        :rowData="rowData"
        :defaultColDef="defaultColDef"
        :pagination="false"
        :paginationPageSize="pageSize"
        :suppressPaginationPanel="false"
        @grid-ready="onGridReady"
      />
    </div>

    <!-- Feedback States -->
    <LoadingSpinner 
      v-if="loading" 
      message="กำลังโหลดข้อมูล..." 
    />
    
    <ErrorModal 
      :is-open="showError" 
      :message="errorMessage"
      @close="closeError"
    />
    
  </div>
</template>


<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { AgGridVue } from 'ag-grid-vue3';
import type { GridApi, GridReadyEvent } from 'ag-grid-community';
import { RefreshCw, Upload } from 'lucide-vue-next';
import { apiService } from '@/services/apiService';
import { columnDefs, defaultColDef } from '@/types/gridConfig';
import type { PurchaseOrder } from '@/types/purchaseOrder';
import type { Setting } from '@/types/setting';
import { snakeToCamel } from '@/utils/transform';
import LoadingSpinner from './LoadingSpinner.vue';
import ErrorModal from './ErrorModal.vue';

// Extend GridApi interface to include setQuickFilter
interface ExtendedGridApi extends GridApi {
  setQuickFilter: (filter: string) => void;
  // paginationSetPageSize: (pageSize: number) => void;
}

const gridApi = ref<ExtendedGridApi | null>(null);
const pageSize = ref<number>(25);
const rowData = ref<PurchaseOrder[]>([]);
const settings = ref<Setting[]>([]);
const selectedSetting = ref<string>('');
const loading = ref<boolean>(false);
const searchText = ref<string>('');
const selectedFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const showError = ref<boolean>(false);
const errorMessage = ref<string>('');

const onGridReady = (params: GridReadyEvent) => {
  gridApi.value = params.api as ExtendedGridApi;
  // Data fetching is now handled in onMounted
};

const showErrorMessage = (message: string) => {
  errorMessage.value = message;
  showError.value = true;
};

const closeError = () => {
  showError.value = false;
  errorMessage.value = '';
};

// Returns the last item in an array or undefined if array is empty
function getLast<T>(arr: T[]): T | undefined {
  return arr.length > 0 ? arr[arr.length - 1] : undefined;
}

// Enhanced error handling
const handleError = (error: any, context: string): string => {
  console.error(`Error in ${context}:`, error);
  
  // Check if it's an Axios error with response
  if (error.response) {
    // Server responded with an error status
    const status = error.response.status;
    
    switch (status) {
      case 400:
        return `ข้อมูลไม่ถูกต้อง (${context})`;
      case 401:
        return 'กรุณาเข้าสู่ระบบใหม่';
      case 403:
        return 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้';
      case 404:
        return `ไม่พบข้อมูลที่ต้องการ (${context})`;
      case 500:
        return 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ กรุณาลองใหม่ภายหลัง';
      default:
        return `เกิดข้อผิดพลาด (${status}): ${error.response.data?.message || 'กรุณาลองใหม่อีกครั้ง'}`;
    }
  } else if (error.request) {
    // Request was made but no response received
    return 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่อ';
  } else {
    // Something else happened while setting up the request
    return `เกิดข้อผิดพลาด: ${error.message || 'กรุณาลองใหม่อีกครั้ง'}`;
  }
};

// 1. First fetch settings
const fetchSettings = async (): Promise<void> => {
  try {
    loading.value = true;
    const response = await apiService.getSettings();
    console.log('Settings API Response:', response.data);
    
    // Save settings
    settings.value = response.data.data as Setting[];
    
    // 2. Set selectedSetting to the last value
    if (settings.value.length > 0) {
      const lastSetting = getLast(settings.value);
      selectedSetting.value = lastSetting?.path || '';
      console.log('Selected setting path:', selectedSetting.value);
      
      // 3. Fetch data with selected path
      await fetchData();
    } else {
      showErrorMessage('ไม่พบการตั้งค่า กรุณาตั้งค่าก่อนใช้งาน');
    }
  } catch (error) {
    const errorMessage = handleError(error, 'การโหลดการตั้งค่า');
    showErrorMessage(errorMessage);
  } finally {
    loading.value = false;
  }
};

// 4. Handle setting change
const handleSettingChange = async (): Promise<void> => {
  console.log('Setting changed to:', selectedSetting.value);
  await fetchData();
};

const fetchData = async (): Promise<void> => {
  try {
    loading.value = true;
    
    // Create query data with the selected path
    const data = { 
      path: selectedSetting.value,
    };
    
    console.log('Fetching data with path:', data.path);
    const response = await apiService.getPurchaseOrders(data);
    console.log('API Response:', response.data);
    
    // Transform snake_case to camelCase
    const transformedData = snakeToCamel(response.data.data) as PurchaseOrder[];
    
    // Debugging: Log a sample record
    if (transformedData.length > 0) {
      console.log('Sample record before display:', transformedData[0]);
    }
    
    rowData.value = transformedData;
    
    if (gridApi.value) {
      gridApi.value.refreshCells();
    }
  } catch (error) {
    const errorMessage = handleError(error, 'การโหลดข้อมูล');
    showErrorMessage(errorMessage);
    rowData.value = [];
  } finally {
    loading.value = false;
  }
};

const onSearchTextChanged = (): void => {
  if (gridApi.value) {
    gridApi.value.setQuickFilter(searchText.value);
  }
};

const refreshData = (): void => {
  fetchData();
};

// const onPageSizeChanged = (): void => {
//   if (gridApi.value) {
//     gridApi.value.paginationSetPageSize(pageSize.value);
//   }
// };

const onFileChange = (event: Event): void => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    selectedFile.value = input.files[0];
  } else {
    selectedFile.value = null;
  }
};

const uploadFile = async (): Promise<void> => {
  if (!selectedFile.value) {
    showErrorMessage('กรุณาเลือกไฟล์ที่ต้องการอัพโหลด');
    return;
  }

  try {
    loading.value = true;
    const formData = new FormData();
    formData.append('file', selectedFile.value);

    // Assuming apiService.uploadFile is a method that sends the file to the server
    const response = await apiService.uploadFile(formData);
    console.log('File uploaded successfully');
    console.log('API Response:', response.data);
    
    // Transform snake_case to camelCase
    const transformedData = snakeToCamel(response.data.data) as PurchaseOrder[];
    
    // Debugging: Log a sample record
    if (transformedData.length > 0) {
      console.log('Sample uploaded record:', transformedData[0]);
    }
    
    rowData.value = transformedData;
    
    // Clear the file input and refresh the grid
    selectedFile.value = null;
    if (fileInput.value) fileInput.value.value = '';
  } catch (error) {
    const errorMessage = handleError(error, 'การอัพโหลดไฟล์');
    showErrorMessage(errorMessage);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  // First fetch settings, which will trigger data fetching with the selected path
  await fetchSettings();
});

// onMounted(async () => {
//   try {
//     loading.value = true;
//     // First call the import-network endpoint
//     if (!apiService.importNetwork) {
//       console.warn('importNetwork method is not available');
//       await apiService.getPurchaseOrders();
//     } else {
//       await apiService.importNetwork();
//     }
//     console.log('Network data imported successfully');
//     // Then fetch the purchase orders
//     if (gridApi.value) {
//       fetchData();
//     }
//   } catch (error) {
//     console.error('Error importing network data:', error);
//     // Even if import-network fails, try to fetch existing data
//     if (gridApi.value) {
//       fetchData();
//     }
//   } finally {
//     loading.value = false;
//   }
// });
</script>

<style scoped>
.ag-grid-container {
  position: relative;
  padding: 1rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.ag-theme-alpine {
  --ag-background-color: white;
  --ag-header-background-color: #f3f4f6;
  --ag-header-foreground-color: #374151;
  --ag-font-size: 14px;
  --ag-font-family: 'Inter', sans-serif;
  --ag-border-color: #e5e7eb;
}

.ag-theme-alpine .ag-header-cell {
  font-weight: 700;
  background: linear-gradient(to right, #f8fafc, #e2e8f0);
  border-right: 1px solid #e5e7eb;
  color: #1f2937;
}

.ag-theme-alpine .ag-cell {
  padding: 12px;
  color: #374151;
  border-right: 1px solid #f1f5f9;
  border-bottom: 1px solid #f1f5f9;
  background-color: #ffffff;
  transition: background 0.3s ease;
}

.ag-theme-alpine .ag-row:hover .ag-cell {
  background-color: #f0f9ff;
}

.ag-theme-alpine .ag-row:nth-child(even) .ag-cell {
  background-color: #f9fafb;
}

.ag-logo {
  background-color: #f9fafb;
  height: 10%;
  width: 10%;
  margin-left: 20px;
}

</style>