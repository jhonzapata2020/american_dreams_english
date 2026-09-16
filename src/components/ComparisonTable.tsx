import React from 'react';
import { CheckCircle2, XCircle, Award, Sparkles, ShieldCheck } from 'lucide-react';

export const ComparisonTable: React.FC = () => {
  const comparisons = [
    {
      feature: 'Clases en VIVO ilimitadas todos los días',
      americanDream: true,
      openEnglish: true,
      duolingo: false,
      traditional: false,
    },
    {
      feature: 'Tutora con Inteligencia Artificial 24/7 (Jenny AI)',
      americanDream: true,
      openEnglish: true,
      duolingo: false,
      traditional: false,
    },
    {
      feature: 'Certificación Oficial MCER (A1-C1) habilitante en Colombia',
      americanDream: true,
      openEnglish: false, // Open English cert is internal, not localized Turbo Sec Education
      duolingo: false,
      traditional: true,
    },
    {
      feature: 'Fondo de Becas Auditado (1 Matrícula subsidia 1 Joven de Urabá)',
      americanDream: true,
      openEnglish: false,
      duolingo: false,
      traditional: false,
    },
    {
      feature: 'Sede Presencial Climatizada en Turbo + Aula Virtual Integrada',
      americanDream: true,
      openEnglish: false, // Open English is 100% online only, no local campuses
      duolingo: false,
      traditional: true,
    },
    {
      feature: 'Tarifa mensual justa en pesos colombianos (COP) sin cláusula de permanencia',
      americanDream: true,
      openEnglish: false,
      duolingo: true,
      traditional: false,
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 border border-blue-200 text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-blue-600" /> Comparativa de Valor Real
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-navy-900">
            ¿Por qué American Dream English Supera a otras Opciones?
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Combinamos la tecnología internacional de vanguardia con presencia física real en Urabá y un modelo de becas auditado.
          </p>
        </div>

        {/* COMPARISON TABLE CONTAINER */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b-2 border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-700">
                <th className="py-4 px-6 font-black w-2/5">Características & Beneficios</th>
                <th className="py-4 px-4 font-black text-center bg-blue-600 text-white rounded-t-2xl shadow-md w-1/5">
                  <div className="flex flex-col items-center">
                    <span className="text-amber-300 text-[10px] font-extrabold uppercase">Ecosistema Lider</span>
                    <span>American Dream</span>
                  </div>
                </th>
                <th className="py-4 px-4 font-bold text-center text-slate-700 w-1/5">Open English</th>
                <th className="py-4 px-4 font-bold text-center text-slate-500 w-1/5">Academia Tradicional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs sm:text-sm font-semibold text-slate-800">
              {comparisons.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                  <td className="py-4 px-6 text-navy-900 font-extrabold">
                    {row.feature}
                  </td>
                  
                  {/* American Dream */}
                  <td className="py-4 px-4 text-center bg-blue-50/80 border-x border-blue-200">
                    {row.americanDream ? (
                      <div className="inline-flex items-center space-x-1 text-emerald-700 font-black">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                        <span className="hidden sm:inline">Incluido</span>
                      </div>
                    ) : (
                      <XCircle className="w-5 h-5 text-slate-300 mx-auto" />
                    )}
                  </td>

                  {/* Open English */}
                  <td className="py-4 px-4 text-center">
                    {row.openEnglish ? (
                      <CheckCircle2 className="w-5 h-5 text-slate-400 mx-auto" />
                    ) : (
                      <span className="text-slate-400 text-xs font-bold">No dispone</span>
                    )}
                  </td>

                  {/* Traditional */}
                  <td className="py-4 px-4 text-center">
                    {row.traditional ? (
                      <CheckCircle2 className="w-5 h-5 text-slate-400 mx-auto" />
                    ) : (
                      <span className="text-slate-400 text-xs font-bold">No dispone</span>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
};
