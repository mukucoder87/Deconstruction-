import React from 'react';
import { TextBreakdown } from '../services/gemini';

interface CategorizationSectionProps {
  categorization: TextBreakdown['categorization'];
}

export function CategorizationSection({ categorization }: CategorizationSectionProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-semibold text-slate-900 mb-6">Logical Categorization</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CategoryCard title="Premises" items={categorization.premises} color="bg-blue-50 border-blue-200 text-blue-900" />
        <CategoryCard title="Arguments" items={categorization.arguments} color="bg-purple-50 border-purple-200 text-purple-900" />
        <CategoryCard title="Assumptions" items={categorization.assumptions} color="bg-amber-50 border-amber-200 text-amber-900" />
        <CategoryCard title="Conclusions" items={categorization.conclusions} color="bg-emerald-50 border-emerald-200 text-emerald-900" />
      </div>
    </div>
  );
}

function CategoryCard({ title, items, color }: { title: string; items: string[]; color: string }) {
  return (
    <div className={`p-4 rounded-xl border ${color}`}>
      <h3 className="font-semibold mb-3 text-lg">{title}</h3>
      {items.length > 0 ? (
        <ul className="space-y-2">
          {items.map((item, idx) => (
            <li key={idx} className="text-sm leading-relaxed flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-current opacity-50 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm opacity-60 italic">None identified.</p>
      )}
    </div>
  );
}
