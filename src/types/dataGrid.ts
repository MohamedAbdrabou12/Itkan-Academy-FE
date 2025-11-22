import type { ReactNode } from "react";
import type { PermissionKeys } from "@/constants/Permissions";

export interface Column<T> {
  key: keyof T | string;
  title: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => ReactNode;
  width?: string;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface SortInfo {
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export type FilterValue = string | number | boolean | Date | null | undefined;

export interface FilterInfo {
  search: string;
  [key: string]: unknown;
}

export interface DataGridProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  error?: string | null;

  // Pagination
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;

  // Sorting
  sortInfo: SortInfo;
  onSort: (sortBy: string) => void;

  // Search
  onSearch: (searchTerm: string) => void;

  // Actions
  onAddNew?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;

  // Configuration
  title?: string;
  searchPlaceholder: string;
  addButtonText?: string;
  entityName?: string;
  pageSizeOptions?: number[];
  enableSearch?: boolean;
  enableFilters?: boolean;
  viewPermission: (typeof PermissionKeys)[keyof typeof PermissionKeys];
  addPermission?: (typeof PermissionKeys)[keyof typeof PermissionKeys];
  editPermission?: (typeof PermissionKeys)[keyof typeof PermissionKeys];
  deletePermission?: (typeof PermissionKeys)[keyof typeof PermissionKeys];
}

// Generic response interface for API calls
export interface ApiResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Props for individual components
export interface GridTableProps<T> {
  data: T[];
  columns: Column<T>[];
  sortInfo: SortInfo;
  onSort: (sortBy: string) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  editPermission?: (typeof PermissionKeys)[keyof typeof PermissionKeys];
  deletePermission?: (typeof PermissionKeys)[keyof typeof PermissionKeys];
}

export interface ActionMenuProps<T> {
  item: T;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  editPermission?: (typeof PermissionKeys)[keyof typeof PermissionKeys];
  deletePermission?: (typeof PermissionKeys)[keyof typeof PermissionKeys];
}

export interface PaginationControlsProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions: number[];
}

export interface EmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
  entityName: string;
}

export interface GridErrorProps {
  message: string;
  onRetry?: () => void;
}
