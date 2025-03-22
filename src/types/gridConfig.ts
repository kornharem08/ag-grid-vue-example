// src/types/gridConfig.ts
import type { ColDef, ValueGetterParams, ValueFormatterParams } from 'ag-grid-community';
import { PurchaseOrder } from './purchaseOrder';
import { formatToThaiDate } from '@/utils/dateFormatter';

// Helper function for consistent date formatting
const formatDate = (params: ValueFormatterParams) => {
  const value = params.value as string | null | undefined;
  console.log(`Formatting value in grid: ${value}`);
  return formatToThaiDate(value);
};

export const columnDefs: ColDef<PurchaseOrder>[] = [
  {
    field: 'jobIdNo', headerName: 'Job ID', sortable: false, filter: true, filterParams: {},
  },
  { field: 'type', headerName: 'Type', sortable: false, filter: false },
  { field: 'salesTeam', headerName: 'Sales Team', sortable: false, filter: false },
  { field: 'projectManager', headerName: 'Project Manager', sortable: false, filter: false },
  { field: 'customer', headerName: 'Customer', sortable: false, filter: false },
  { field: 'productCode', headerName: 'Product Code', sortable: false, filter: false },
  { field: 'productDescription', headerName: 'Description', sortable: false, filter: false },
  { field: 'ordered', headerName: 'Ordered', sortable: true, filter: false },
  { field: 'received', headerName: 'Received', sortable: false, filter: false },
  { field: 'remain', headerName: 'Remain', sortable: true, filter: false },
  { field: 'pr', headerName: 'PR', sortable: false, filter: false },
  { 
    field: 'prDate', 
    headerName: 'PR Date', 
    sortable: true, 
    filter: false,
    valueFormatter: formatDate,
  },
  { field: 'po', headerName: 'PO', sortable: false, filter: false },
  { 
    field: 'poDate', 
    headerName: 'PO Date', 
    sortable: true, 
    filter: false,
    valueFormatter: formatDate,
  },
  { field: 'distribution', headerName: 'Distribution', sortable: false, filter: false },
  { field: 'paymentTerm', headerName: 'Payment Term', sortable: false, filter: false },
  { 
    field: 'requestDate', 
    headerName: 'Request Date', 
    sortable: true, 
    filter: false,
    valueFormatter: formatDate,
  },
  { 
    field: 'deliveryDate', 
    headerName: 'Delivery Date', 
    sortable: true, 
    filter: false,
    valueFormatter: formatDate,
  },
  { field: 'status', headerName: 'Status', sortable: false, filter: false },
];

export const defaultColDef: ColDef = {
  flex: 1,
  minWidth: 150,
  resizable: true,
};