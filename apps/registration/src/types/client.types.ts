import type { ContractReference } from "./contract.types";
import type { ClientType } from "./formConfig.types";

export type ClientDocumentType = "CC" | "CE" | "PP" | "NIT" | "RUT";
export type ClientStatus = "active" | "inactive" | "suspended";

export interface ClientBase {
  id: string;
  tenantId: string;
  clientType: ClientType;
  fullName: string;
  documentType: ClientDocumentType;
  documentNumber: string;
  address: string;
  phone: string;
  email: string;
  status: ClientStatus;
  statusReason?: string;
  contractReference?: ContractReference;
  customFields?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export type Client = ClientBase;

export interface CreateClientInput {
  tenantId: string;
  clientType: ClientType;
  fullName: string;
  documentType: ClientDocumentType;
  documentNumber: string;
  address: string;
  phone: string;
  email: string;
  customFields?: Record<string, unknown>;
}

export interface UpdateClientInput {
  fullName?: string;
  documentType?: ClientDocumentType;
  address?: string;
  phone?: string;
  email?: string;
  status?: ClientStatus;
  statusReason?: string;
  customFields?: Record<string, unknown>;
}

export interface ClientFilters {
  query?: string;
  status?: ClientStatus | "all";
  clientType?: ClientType | "all";
  page?: number;
  pageSize?: number;
}
