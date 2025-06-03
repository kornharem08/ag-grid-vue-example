// src/types/purchaseOrder.ts
export interface PurchaseOrder {
    jobIdNo?: string | null;
    type?: string | null;
    salesTeam?: string | null;
    projectManager?: string | null;
    purchasing?: string | null;
    customer?: string | null;
    productCode?: string | null;
    productDescription?: string | null;
    ordered?: number | null;
    received?: number | null;
    remain?: number | null;
    pr?: string | null;
    prDate?: string | null;
    po?: string | null;
    poDate?: string | null;
    requestDate?: string | null;
    poReceiveDate?: string | null;
    distribution?: string | null;
    receivedDate?: string | null;
    stockPickingOutDate?: string | null;
    deliveryDate?: string | null;
    status?: string | null;
    remark?: string | null;
}

export interface PaginatedPurchaseOrders {
    data: PurchaseOrder[];
    page: number;
    pageSize: number;
    total: number;
}