-- Tabela de folha de pagamento
CREATE TABLE public.payroll_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  employee_name TEXT NOT NULL,
  position_title TEXT,
  reference_month DATE NOT NULL, -- sempre o dia 01 do mês (ex: 2026-03-01)
  gross_salary NUMERIC(12, 2),
  inss_deduction NUMERIC(12, 2) DEFAULT 0,
  irrf_deduction NUMERIC(12, 2) DEFAULT 0,
  other_deductions NUMERIC(12, 2) DEFAULT 0,
  total_deductions NUMERIC(12, 2) GENERATED ALWAYS AS (
    COALESCE(inss_deduction, 0) + COALESCE(irrf_deduction, 0) + COALESCE(other_deductions, 0)
  ) STORED,
  net_salary NUMERIC(12, 2) GENERATED ALWAYS AS (
    COALESCE(gross_salary, 0) - (COALESCE(inss_deduction, 0) + COALESCE(irrf_deduction, 0) + COALESCE(other_deductions, 0))
  ) STORED,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, employee_id, reference_month)
);

-- Índices
CREATE INDEX idx_payroll_org_month ON public.payroll_entries (organization_id, reference_month DESC);
CREATE INDEX idx_payroll_employee ON public.payroll_entries (employee_id);

-- RLS
ALTER TABLE public.payroll_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payroll_select" ON public.payroll_entries
  FOR SELECT USING (
    has_org_role(auth.uid(), organization_id, 'admin') OR
    has_org_role(auth.uid(), organization_id, 'people')
  );

CREATE POLICY "payroll_insert" ON public.payroll_entries
  FOR INSERT WITH CHECK (
    has_org_role(auth.uid(), organization_id, 'admin') OR
    has_org_role(auth.uid(), organization_id, 'people')
  );

CREATE POLICY "payroll_update" ON public.payroll_entries
  FOR UPDATE USING (
    has_org_role(auth.uid(), organization_id, 'admin') OR
    has_org_role(auth.uid(), organization_id, 'people')
  );

CREATE POLICY "payroll_delete" ON public.payroll_entries
  FOR DELETE USING (
    has_org_role(auth.uid(), organization_id, 'admin')
  );

-- Trigger updated_at
CREATE TRIGGER update_payroll_entries_updated_at
  BEFORE UPDATE ON public.payroll_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
