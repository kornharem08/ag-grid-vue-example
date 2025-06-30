// src/types/gridConfig.ts
import type { ColDef, ValueFormatterParams } from 'ag-grid-community';
import { PurchaseOrder } from './purchaseOrder';

const formatDeliveryDate = (params: ValueFormatterParams) => {
  const value = params.value as string | null | undefined;
  if (!value) return '';
  
  // Split by comma and process each date entry
  const dates = value.split(',');
  
  // Format each date entry and preserve unit information
  return dates
    .map(date => date.trim())
    .filter(date => date) // Remove empty entries
    .join('\n');
};

const statusCellStyle = (params: any) => {
  const style = {
    fontWeight: '500',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const isCompleted = params.value === 'Completed';
  return {
    ...style,
    color: isCompleted ? '#16a34a' : '#dc2626',
  };
};

export const columnDefs: ColDef<PurchaseOrder>[] = [
  {
    field: 'jobIdNo', 
    headerName: 'Job ID', 
    sortable: false, 
    filter: true, 
    filterParams: { maxNumConditions: 1 },
    width: 120,
    cellStyle: { 
      'white-space': 'pre-line',
      'line-height': '1.5',
      'padding': '10px'
    }
  },
  { 
    field: 'type', 
    headerName: 'Type', 
    sortable: false, 
    filter: true,
    width: 100,
    cellStyle: { 
      'white-space': 'pre-line',
      'line-height': '1.5',
      'padding': '10px'
    }
  },
  { 
    field: 'salesTeam', 
    headerName: 'Sales Team', 
    sortable: false, 
    filter: true,
    width: 150,
    wrapText: true,
    autoHeight: true,
    cellStyle: { 
      'white-space': 'pre-line',
      'line-height': '1.5',
      'padding': '10px'
    }
  },
  { 
    field: 'projectManager', 
    headerName: 'Project Manager', 
    sortable: false, 
    filter: true,
    width: 150,
    wrapText: true,
    autoHeight: true,
    cellStyle: { 
      'white-space': 'pre-line',
      'line-height': '1.5',
      'padding': '10px'
    }
  },
  { 
    field: 'purchasing', 
    headerName: 'Purchasing', 
    sortable: false, 
    filter: true,
    width: 150,
    wrapText: true,
    autoHeight: true,
    cellStyle: { 
      'white-space': 'pre-line',
      'line-height': '1.5',
      'padding': '10px'
    }
  },
  { 
    field: 'customer', 
    headerName: 'Customer', 
    sortable: false, 
    filter: true,
    width: 200,
    wrapText: true,
    autoHeight: true,
    cellStyle: { 
      'white-space': 'pre-line',
      'line-height': '1.5',
      'padding': '10px'
    }
  },
  { 
    field: 'productCode', 
    headerName: 'Product Code', 
    sortable: false, 
    filter: true,
    width: 150,
    wrapText: true,
    autoHeight: true,
    cellStyle: { 
      'white-space': 'pre-line',
      'line-height': '1.5',
      'padding': '10px'
    }
  },
  { 
    field: 'productDescription', 
    headerName: 'Description', 
    sortable: false, 
    filter: true,
    width: 250,
    wrapText: true,
    autoHeight: true,
    cellStyle: { 
      'white-space': 'pre-line',
      'line-height': '1.5',
      'padding': '10px'
    }
  },
  { 
    field: 'ordered', 
    headerName: 'Ordered', 
    sortable: false, 
    filter: true,
    width: 90,
    type: 'numericColumn',
    cellStyle: { 
      'text-align': 'right',
      'padding': '10px'
    }
  },
  { 
    field: 'received', 
    headerName: 'Received', 
    sortable: false, 
    filter: true,
    width: 90,
    type: 'numericColumn',
    cellStyle: { 
      'text-align': 'right',
      'padding': '10px'
    }
  },
  { 
    field: 'remain', 
    headerName: 'Remain', 
    sortable: false, 
    filter: true,
    width: 90,
    type: 'numericColumn',
    cellStyle: { 
      'text-align': 'right',
      'padding': '10px'
    }
  },
  { 
    field: 'pr', 
    headerName: 'PR', 
    sortable: false, 
    filter: true,
    width: 120,
    cellStyle: { 
      'white-space': 'pre-line',
      'line-height': '1.5',
      'padding': '10px'
    }
  },
  { 
    field: 'prDate', 
    headerName: 'PR Date', 
    sortable: true, 
    filter: true,
    width: 120,
    cellStyle: { 
      'white-space': 'pre-line',
      'line-height': '1.5',
      'padding': '10px'
    }
  },
  { 
    field: 'po', 
    headerName: 'PO', 
    sortable: false, 
    filter: true,
    width: 120,
    cellStyle: { 
      'white-space': 'pre-line',
      'line-height': '1.5',
      'padding': '10px'
    }
  },
  { 
    field: 'poDate', 
    headerName: 'PO Date', 
    sortable: true, 
    filter: true,
    width: 120,
    cellStyle: { 
      'white-space': 'pre-line',
      'line-height': '1.5',
      'padding': '10px'
    }
  },
  { 
    field: 'requestDate', 
    headerName: 'Request Date', 
    sortable: true, 
    filter: true,
    width: 140,
    cellStyle: { 
      'white-space': 'pre-line',
      'line-height': '1.5',
      'padding': '10px'
    }
  },
  { 
    field: 'poReceiveDate', 
    headerName: 'PO Receive Date', 
    sortable: false, 
    filter: true,
    width: 140,
    cellStyle: { 
      'white-space': 'pre-line',
      'line-height': '1.5',
      'padding': '10px'
    }
  },
  { 
    field: 'distribution', 
    headerName: 'Distribution', 
    sortable: false, 
    filter: true,
    width: 150,
    wrapText: true,
    autoHeight: true,
    cellStyle: { 
      'white-space': 'pre-line',
      'line-height': '1.5',
      'padding': '10px'
    }
  },
  { 
    field: 'receivedDate', 
    headerName: 'Received Date', 
    sortable: false, 
    filter: true,
    width: 130,
    cellStyle: { 
      'white-space': 'pre-line',
      'line-height': '1.5',
      'padding': '10px'
    }
  },
  { 
    field: 'stockPickingOutDate', 
    headerName: 'Stock Picking Out Date', 
    sortable: false, 
    filter: true,
    width: 150,
    wrapText: true,
    autoHeight: true,
    cellStyle: { 
      'white-space': 'pre-line',
      'line-height': '1.5',
      'padding': '10px'
    },
    valueFormatter: formatDeliveryDate,
  },
  { 
    field: 'status', 
    headerName: 'Status', 
    sortable: false, 
    filter: true,
    width: 150,
    cellStyle: statusCellStyle
  },
  {
    field: 'remark', 
    headerName: 'Remark', 
    sortable: false, 
    filter: true,
    width: 150,
    wrapText: true,
    autoHeight: true,
    cellStyle: { 
      'white-space': 'pre-line',
      'line-height': '1.5',
      'padding': '10px'
    },
  }
];

export const defaultColDef: ColDef = {
  resizable: true,
  suppressMovable: true,
  wrapText: true,
  autoHeight: true,
  cellStyle: { 
    'user-select': 'text',
    'white-space': 'normal',
    'overflow': 'hidden'
  }
};