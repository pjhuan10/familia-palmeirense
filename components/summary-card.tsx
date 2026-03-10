import { ReactNode } from "react";

type Props = {
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
};

export default function SummaryCard({ title, value, subtitle, icon }: Props) {
  return (
    <div className="glass-card lift-hover rounded-[30px] p-6 fade-up">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-3 text-3xl font-black tracking-[-0.03em] text-slate-900">
            {value}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-green-50/90 text-green-700 shadow-inner">
          {icon}
        </div>
      </div>
    </div>
  );
}
