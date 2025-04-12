

export interface Setting {
    path: string;
    name: string;
}

export interface PaginatedSetting {
    data: Setting[];
    page: number;
    pageSize: number;
    total: number;
  }