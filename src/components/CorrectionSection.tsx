import React, { useState } from 'react';
import { Save, Send, Download } from 'lucide-react';

interface CorrectionSectionProps {
  originalText: string;
}

export function CorrectionSection({ originalText }: CorrectionSectionProps) {
  const [correctedText, setCorrectedText] = useState(originalText);

  const handleDownload = () => {
    const blob = new Blob([correctedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'logically-corrected-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleEmail = () => {
    const subject = encodeURIComponent('Logically Corrected Text');
    const body = encodeURIComponent(correctedText);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Logical Correction Editor</h2>
          <p className="text-sm text-slate-500 mt-1">
            Apply the recommendations to improve logical consistency.
          </p>
        </div>
      </div>

      <textarea
        className="w-full h-64 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none text-slate-700 font-sans leading-relaxed"
        value={correctedText}
        onChange={(e) => setCorrectedText(e.target.value)}
      />

      <div className="mt-6 flex flex-wrap gap-4 justify-end">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-xl transition-colors"
        >
          <Download className="w-4 h-4" />
          Download .txt
        </button>
        <button
          onClick={handleEmail}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors"
        >
          <Send className="w-4 h-4" />
          Send via Email
        </button>
      </div>
    </div>
  );
}
