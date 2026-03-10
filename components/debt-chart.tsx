"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type ChartItem = {
  nome: string;
  totalAberto: number;
};

type Props = {
  data: ChartItem[];
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function DebtChart({ data }: Props) {
  return (
    <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <p className="text-sm font-semibold text-green-700">Financeiro</p>
        <h3 className="text-2xl font-bold text-slate-900">Quem deve mais</h3>
        <p className="mt-1 text-sm text-slate-500">
          Comparativo dos maiores valores em aberto da família.
        </p>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="nome"
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <YAxis
              tickFormatter={(value) => `R$ ${value}`}
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <Tooltip
              formatter={(value) => formatCurrency(Number(value ?? 0))}
              cursor={{ opacity: 0.08 }}
            />
            <Bar
              dataKey="totalAberto"
              fill="#16a34a"
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
