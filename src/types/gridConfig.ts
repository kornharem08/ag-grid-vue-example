// src/types/gridConfig.ts
import type { ColDef, ValueGetterParams, ValueFormatterParams } from 'ag-grid-community';
import { PurchaseOrder } from './purchaseOrder';
import { formatToThaiDate } from '@/utils/dateFormatter';

// Helper function for consistent date formatting
// const formatDate = (params: ValueFormatterParams) => {
//   const value = params.value as string | null | undefined;
//   return formatToThaiDate(value);
// };

const calculateTotalUnits = (deliveryDate: string): number => {
  // Match any number in parentheses regardless of what text follows the number
  // For example: "(2 unit)", "(3 ชิ้น)", "(5 pieces)", "(7 items)" etc.
  const unitMatches = deliveryDate.match(/\((\d+)[^\)]*\)/g);
  if (!unitMatches) return 0;
  
  return unitMatches.reduce((sum, match) => {
    // Extract only the number from each match
    const unit = parseInt(match.match(/\d+/)?.[0] || '0');
    return sum + unit;
  }, 0);
};

const isCompleted = (params: ValueGetterParams) => {
  const { deliveryDate, ordered } = params.data || {};
  
  if (!deliveryDate || !ordered) return 'Not Completed';
  
  const totalUnits = calculateTotalUnits(deliveryDate);
  return totalUnits === ordered ? 'Completed' : 'Not Completed';
};

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
    field: 'paymentTerm', 
    headerName: 'Payment Term', 
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
    field: 'requestDate', 
    headerName: 'Request Date', 
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
    field: 'deliveryDate', 
    headerName: 'Delivery Date', 
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