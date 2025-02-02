export interface Product {
  category: string;
  country: string;
  image: string;
  marketplaceStatus: string;
  name: string;
  price: number;
}

export interface Pagination {
  CurrentPage: number;
  ItemsPerPage: number;
  NumberOfPages: number;
  TotalItemsCount: number;
}
