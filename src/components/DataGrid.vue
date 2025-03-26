<!-- src/components/DataGrid.vue -->
<template>
  <div class="ag-grid-container">
    <div class="mb-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold">Data Grid</h1>
    </div>

    <div class="ag-theme-alpine" style="height: 85vh">
      <ag-grid-vue style="width: 100%; height: 100%" :columnDefs="columnDefs" :rowData="rowData"
        :defaultColDef="defaultColDef" :pagination="true" :paginationPageSize="pageSize" 
        :suppressPaginationPanel="true"
        @grid-ready="onGridReady"></ag-grid-vue>
    </div>
    
    <LoadingSpinner v-if="loading" message="กำลังโหลดข้อมูล..." />
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
import { snakeToCamel } from '@/utils/transform';
import LoadingSpinner from './LoadingSpinner.vue';


// Extend GridApi interface to include setQuickFilter
interface ExtendedGridApi extends GridApi {
  setQuickFilter: (filter: string) => void;
  paginationSetPageSize: (pageSize: number) => void;
}

const gridApi = ref<ExtendedGridApi | null>(null);
const pageSize = ref<number>(25);
const rowData = ref<PurchaseOrder[]>([]);
const loading = ref<boolean>(false);
const searchText = ref<string>('');
const selectedFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const onGridReady = (params: GridReadyEvent) => {
  gridApi.value = params.api as ExtendedGridApi;
  fetchData();
};

const fetchData = async (): Promise<void> => {
  try {
    loading.value = true;
    const response = await apiService.getPurchaseOrders();
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
    console.error('Error fetching data:', error);
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

const onPageSizeChanged = (): void => {
  if (gridApi.value) {
    gridApi.value.paginationSetPageSize(pageSize.value);
  }
};

const onFileChange = (event: Event): void => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    selectedFile.value = input.files[0];
  } else {
    selectedFile.value = null;
  }
};

const uploadFile = async (): Promise<void> => {
  if (!selectedFile.value) return;

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
    // fetchData(); // Refresh the grid data after upload
  } catch (error) {
    console.error('Error uploading file:', error);
  } finally {
    loading.value = false;
  }
};

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
</style>