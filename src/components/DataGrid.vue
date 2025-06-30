<template>
  <div
    class="ag-grid-container bg-gradient-to-br from-white via-gray-50 to-gray-100 p-8 rounded-2xl shadow-2xl border border-gray-200">
    <!-- Data Grid -->
    <div class="ag-theme-alpine rounded-xl overflow-hidden border border-gray-300 shadow-inner" style="height: 80vh">
      <ag-grid-vue style="width: 100%; height: 100%" :columnDefs="columnDefs" :rowData="rowData"
        :defaultColDef="defaultColDef" :pagination="true" :paginationPageSize="50" :suppressPaginationPanel="false"
        @grid-ready="onGridReady" />
    </div>

    <!-- Feedback States -->
    <!-- <LoadingSpinner v-if="loading" message="กำลังโหลดข้อมูล..." /> -->
    <ErrorModal :is-open="showError" :message="errorMessage" @close="closeError" />
  </div>
</template>

<script lang="ts" setup>
import { ref, shallowRef, watch, computed, onMounted, type PropType } from 'vue';
import { AgGridVue } from 'ag-grid-vue3';
import type { GridApi as AgGridApiCore, GridReadyEvent, Column, RowNode } from 'ag-grid-community';
import { apiService } from '@/services/apiService';
import { columnDefs, defaultColDef } from '@/types/gridConfig';
import type { PurchaseOrder } from '@/types/purchaseOrder';
import type { Setting } from '@/types/setting';
import { snakeToCamel } from '@/utils/transform';
import LoadingSpinner from './LoadingSpinner.vue';
import ErrorModal from './ErrorModal.vue';

// Define ExtendedGridApi to ensure all used methods are explicitly typed.
interface ExtendedGridApi extends AgGridApiCore {
  getAllDisplayedColumns: () => Column[];
  getValue: (colKey: string | Column, rowNode: RowNode) => any;
  forEachNode: (callback: (rowNode: RowNode, index: number) => void) => void;
}

// Props
const props = defineProps({
  settings: {
    type: Array as PropType<Setting[]>,
    required: true
  },
  selectedSetting: {
    type: String,
    required: true
  },
  initialData: {
    type: Array as PropType<PurchaseOrder[]>,
    default: () => []
  }
})

// Emits
const emit = defineEmits<{
  'data-loaded': [data: PurchaseOrder[]]
  'setting-changed': [setting: string]
}>()

// Local state
const gridApi = shallowRef<ExtendedGridApi | null>(null);
const pageSize = ref<number>(25);
const rowData = ref<PurchaseOrder[]>([]);
const loading = ref<boolean>(false);
const showError = ref<boolean>(false);
const errorMessage = ref<string>('');

// Computed
const displayData = computed(() => {
  return rowData.value.length > 0 ? rowData.value : props.initialData
})

// Methods
const onGridReady = (params: GridReadyEvent) => {
  console.log("onGridReady called, assigning Grid API to shallowRef");
  gridApi.value = params.api as ExtendedGridApi;
};

const showErrorMessage = (message: string) => {
  errorMessage.value = message;
  showError.value = true;
};

const closeError = () => {
  showError.value = false;
  errorMessage.value = '';
};

const handleError = (error: any, context: string): string => {
  console.error(`Error in ${context}:`, error);
  if (error.response) {
    const status = error.response.status;
    switch (status) {
      case 400: return `ข้อมูลไม่ถูกต้อง (${context})`;
      case 401: return 'กรุณาเข้าสู่ระบบใหม่';
      case 403: return 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้';
      case 404: return `ไม่พบข้อมูลที่ต้องการ (${context})`;
      case 500: return 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ กรุณาลองใหม่ภายหลัง';
      default: return `เกิดข้อผิดพลาด (${status}): ${error.response.data?.message || 'กรุณาลองใหม่อีกครั้ง'}`;
    }
  } else if (error.request) {
    return 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่อ';
  } else {
    return `เกิดข้อผิดพลาด: ${error.message || 'กรุณาลองใหม่อีกครั้ง'}`;
  }
};

const fetchData = async (): Promise<void> => {
  try {
    loading.value = true;

    // Create query data with the selected path
    const data = {
      path: props.selectedSetting,
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

    // Emit data to parent component
    emit('data-loaded', transformedData);

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

// Watch for selectedSetting changes from parent
watch(() => props.selectedSetting, async (newSetting) => {
  if (newSetting) {
    console.log('Selected setting changed to:', newSetting);
    await fetchData();
  }
}, { immediate: false })

// Initialize with existing data on mount
onMounted(() => {
  if (props.initialData.length > 0) {
    rowData.value = props.initialData
  } else if (props.selectedSetting) {
    fetchData()
  }
})
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
</style>