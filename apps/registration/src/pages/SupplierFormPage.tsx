import { useState } from "react";
import { SupplierBaseForm } from "../components/suppliers/SupplierBaseForm";
import { useSupplierStore } from "../store/supplierStore";

interface SupplierFormPageProps {
  tenantId: string;
}

export function SupplierFormPage({ tenantId }: SupplierFormPageProps) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const { createSupplier } = useSupplierStore();

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-900">Nuevo proveedor</h2>
      </header>

      {feedback ? (
        <p className="rounded-md bg-emerald-50 p-2 text-sm text-emerald-700">
          {feedback}
        </p>
      ) : null}

      <SupplierBaseForm
        tenantId={tenantId}
        onSubmit={async (values) => {
          await createSupplier({
            tenantId,
            fullName: values.fullName,
            documentType: values.documentType as "NIT" | "RUT" | "CC",
            documentNumber: values.documentNumber,
            address: values.address,
            phone: values.phone,
            email: values.email,
            category: values.category as "goods" | "services" | "both",
            paymentTerms: values.paymentTerms,
            bankAccount: {
              bankName: values.bankName,
              accountType: values.accountType as "savings" | "checking",
              accountNumber: values.accountNumber,
            },
          });

          setFeedback("Proveedor registrado correctamente");
        }}
      />
    </div>
  );
}
