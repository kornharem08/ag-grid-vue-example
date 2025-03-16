<!-- src/components/DataGrid.vue -->
<template>
    <div class="ag-grid-container">
      <div class="mb-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold">Data Grid</h1>
        <div class="flex gap-2">
          <input 
          type="file" 
          ref="fileInput" 
          @change="onFileChange" 
          class="px-3 py-2 border rounded-md"
        />
        <button 
          @click="uploadFile" 
          class="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-1"
          :disabled="!selectedFile"
        >
          <Upload class="w-4 h-4" />
          Upload
        </button>
          <input 
            v-model="searchText" 
            @input="onSearchTextChanged" 
            placeholder="Search..." 
            class="px-3 py-2 border rounded-md"
          />
          <button 
            @click="refreshData" 
            class="px-4 py-2 bg-green-600 text-white rounded-md flex items-center gap-1"
          >
            <RefreshCw class="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>
      
      <div class="ag-theme-alpine" style="height: 600px">
        <ag-grid-vue
         style="width: 100%; height: 100%"
          :columnDefs="columnDefs"
          :rowData="rowData"
          :defaultColDef="defaultColDef"
          :pagination="true"
          :paginationPageSize="10"
          @grid-ready="onGridReady"
        ></ag-grid-vue>
      </div>
      <div v-if="loading" class="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
        <div class="text-center">
          <Loader2 class="w-8 h-8 animate-spin mx-auto" />
          <p class="mt-2">Loading data...</p>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { AgGridVue } from 'ag-grid-vue3';
  import type { GridApi, GridReadyEvent } from 'ag-grid-community';
  import { Loader2, RefreshCw, Upload } from 'lucide-vue-next';
  import { apiService } from '@/services/apiService';
  import { columnDefs, defaultColDef } from '@/types/gridConfig';
  import type { PurchaseOrder } from '@/types/purchaseOrder';
  import { snakeToCamel } from '@/utils/transform';
  
  
  // Extend GridApi interface to include setQuickFilter
  interface ExtendedGridApi extends GridApi {
    setQuickFilter: (filter: string) => void;
  }
  
  const gridApi = ref<ExtendedGridApi | null>(null);
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
    rowData.value = snakeToCamel(response.data.data) as PurchaseOrder[];
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
    rowData.value = snakeToCamel(response.data.data) as PurchaseOrder[];
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
  
  onMounted(() => {
    if (gridApi.value) {
      fetchData();
    }
  });
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