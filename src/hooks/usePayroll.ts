import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PayrollEntry {
  id: string;
  organization_id: string;
  employee_id: string;
  employee_name: string;
  position_title: string | null;
  reference_month: string;
  gross_salary: number | null;
  inss_deduction: number | null;
  irrf_deduction: number | null;
  other_deductions: number | null;
  total_deductions: number | null;
  net_salary: number | null;
  status: string;
  notes: string | null;
  created_at: string;
}

export function usePayroll(
  organizationId: string | null | undefined,
  year: string,
  month: string
) {
  const referenceMonth = `${year}-${month}-01`;

  return useQuery({
    queryKey: ["payroll", organizationId, year, month],
    queryFn: async (): Promise<PayrollEntry[]> => {
      if (!organizationId) return [];

      const { data, error } = await supabase
        .from("payroll_entries")
        .select("*")
        .eq("organization_id", organizationId)
        .eq("reference_month", referenceMonth)
        .order("employee_name");

      if (error) throw error;
      return (data ?? []) as PayrollEntry[];
    },
    enabled: !!organizationId,
  });
}
