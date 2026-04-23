export type ContractType = "client" | "supplier";

export type ContractStatus =
  | "draft"
  | "active"
  | "suspended"
  | "expired"
  | "terminated";

export interface ContractReference {
  contractId: string;
  contractType: ContractType;
  contractStatus: ContractStatus;
}
