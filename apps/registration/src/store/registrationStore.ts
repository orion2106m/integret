import { create } from "zustand";
import type {
  RegistrationRecord,
  RegistrationStatus,
} from "../types/registration.types";

export interface RegistrationStoreState {
  // Data
  records: RegistrationRecord[];
  currentRecord: RegistrationRecord | null;
  isLoading: boolean;
  error: string | null;

  // Pagination
  totalCount: number;
  currentPage: number;
  pageSize: number;

  // Filters
  statusFilter: RegistrationStatus | null;
  searchQuery: string;

  // Actions
  setRecords: (records: RegistrationRecord[]) => void;
  setCurrentRecord: (record: RegistrationRecord | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setTotalCount: (count: number) => void;
  setCurrentPage: (page: number) => void;
  setStatusFilter: (status: RegistrationStatus | null) => void;
  setSearchQuery: (query: string) => void;

  // UI State
  showForm: boolean;
  formMode: "create" | "edit" | null;
  setShowForm: (show: boolean) => void;
  setFormMode: (mode: "create" | "edit" | null) => void;

  // Reset
  reset: () => void;
}

const initialState = {
  records: [],
  currentRecord: null,
  isLoading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  pageSize: 10,
  statusFilter: null,
  searchQuery: "",
  showForm: false,
  formMode: null,
};

export const useRegistrationStore = create<RegistrationStoreState>((set) => ({
  ...initialState,

  setRecords: (records) => set({ records }),
  setCurrentRecord: (record) => set({ currentRecord: record }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setTotalCount: (count) => set({ totalCount: count }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setShowForm: (show) => set({ showForm: show }),
  setFormMode: (mode) => set({ formMode: mode }),

  reset: () => set(initialState),
}));
