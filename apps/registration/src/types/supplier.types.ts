import type { ContractReference } from "./contract.types";

export type SupplierDocumentType = "NIT" | "RUT" | "CC";
export type SupplierStatus = "active" | "inactive" | "blacklisted";
export type SupplierCategory = "goods" | "services" | "both";

export interface BankAccountInfo {
  bankName: string;
  accountType: "savings" | "checking";
  accountNumber: string;
}

export interface Supplier {
  id: string;
  tenantId: string;
  fullName: string;
  documentType: SupplierDocumentType;
  documentNumber: string;
  address: string;
  phone: string;
  email: string;
  category: SupplierCategory;
  paymentTerms: string;
  bankAccount: BankAccountInfo;
  status: SupplierStatus;
  statusReason?: string;
  contractReference?: ContractReference;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupplierInput {
  tenantId: string;
  fullName: string;
  documentType: SupplierDocumentType;
  documentNumber: string;
  address: string;
  phone: string;
  email: string;
  category: SupplierCategory;
  paymentTerms: string;
  bankAccount: BankAccountInfo;
}

export interface UpdateSupplierInput {
  fullName?: string;
  documentType?: SupplierDocumentType;
  address?: string;
  phone?: string;
  email?: string;
  category?: SupplierCategory;
  paymentTerms?: string;
  bankAccount?: BankAccountInfo;
  status?: SupplierStatus;
  statusReason?: string;
}

export interface SupplierFilters {
  query?: string;
  status?: SupplierStatus | "all";
  category?: SupplierCategory | "all";
  hasActiveContract?: boolean;
  page?: number;
  pageSize?: number;
}
