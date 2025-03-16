// src/types/purchaseOrder.ts
export interface PurchaseOrder {
    jobIdNo?: string | null;
    salesTeam?: string | null;
    projectManager?: string | null;
    purchasing?: string | null;
    customerPo?: string | null;
    jobAmount?: number | null;
    periodStart?: string | null;
    periodEnd?: string | null;
    customer?: string | null;
    productCode?: string | null;
    productDescription?: string | null;
    ordered?: number | null;
    received?: number | null;
    remain?: number | null;
    currency?: string | null;
    unitListPrice?: number | null;
    extendListPrice?: number | null;
    discountPercent?: number | null;
    discountAmount?: number | null;
    extendUnitNetPrice?: number | null;
    extendNetPrice?: number | null;
    deliveryDate?: string | null;
    status?: string | null;
  }
  
  export interface PaginatedPurchaseOrders {
    data: PurchaseOrder[];
    page: number;
    pageSize: number;
    total: number;
  }