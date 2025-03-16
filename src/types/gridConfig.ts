// src/types/gridConfig.ts
import type { ColDef, ValueGetterParams } from 'ag-grid-community';
import { PurchaseOrder } from './purchaseOrder';

export const columnDefs: ColDef<PurchaseOrder>[] = [
    { field: 'jobIdNo', headerName: 'Job ID', sortable: false, filter: false },
    { field: 'salesTeam', headerName: 'Sales Team', sortable: false, filter: false },
    { field: 'projectManager', headerName: 'Project Manager', sortable: false, filter: false },
    { field: 'purchasing', headerName: 'Purchasing', sortable: false, filter: false },
    { field: 'customerPo', headerName: 'Customer PO', sortable: false, filter: false },
    { field: 'periodStart', headerName: 'Period Start', sortable: false, filter: false },
    { field: 'periodEnd', headerName: 'Period End', sortable: true, filter: false },
    { field: 'customer', headerName: 'Customer', sortable: false, filter: false },
    { field: 'productCode', headerName: 'Product Code', sortable: false, filter: false },
    { field: 'productDescription', headerName: 'Description', sortable: false, filter: false },
    { field: 'ordered', headerName: 'Ordered', sortable: true, filter: false },
    { field: 'received', headerName: 'Received', sortable: false, filter: false },
    { field: 'remain', headerName: 'Remain', sortable: true, filter: false },
    { field: 'currency', headerName: 'Currency', sortable: false, filter: false },
    { field: 'deliveryDate', headerName: 'Delivery Date', sortable: false, filter: false },
    { field: 'status', headerName: 'Status', sortable: false, filter: false },
  ];
  
  export const defaultColDef: ColDef = {
    flex: 1,
    minWidth: 150,
    resizable: true,
  };