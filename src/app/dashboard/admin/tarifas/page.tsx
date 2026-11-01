'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '../../../../components/dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Building2, 
  Laptop, 
  HeartHandshake, 
  Users, 
  GraduationCap, 
  ShieldCheck, 
  Clock, 
  RotateCcw,
  Info,
  ChevronRight,
  Globe
} from 'lucide-react';
import { useAcademicPricing } from '../../../../context/PricingContext';
import { AcademicPricingData } from '../../../../lib/academicPricing';

export default function AdminTarifasPage() {
  const { pricing, refreshPricing, formatCop } = useAcademicPricing();

  const [formData, setFormData] = useState<AcademicPricingData>(pricing);
  const [saving, setSaving] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (pricing) {
      setFormData(pricing);
    }
  }, [pricing]);

  const handlePresencialChange = (category: 'ninos' | 'adultos', field: 'matricula' | 'mensualidad', value: string) => {
    const num = Math.max(0, parseInt(value.replace(/\D/g, '') || '0', 10));
    setFormData(prev => ({
      ...prev,
      presencial: {
        ...prev.presencial,
        [category]: {
          ...prev.presencial[category],
          [field]: num
        }
      }
    }));
  };

  const handleVirtualChange = (category: 'ninos' | 'adultos', field: 'matricula' | 'mensualidad', value: string) => {
    const num = Math.max(0, parseInt(value.replace(/\D/g, '') || '0', 10));
    setFormData(prev => ({
      ...prev,
      virtual: {
        ...prev.virtual,
        [category]: {
          ...prev.virtual[category],
          [field]: num
        }
      }
    }));
  };

  const handleBecadosChange = (category: 'ninos' | 'adultos', field: 'matricula' | 'mensualidad', value: string) => {
    const num = Math.max(0, parseInt(value.replace(/\D/g, '') || '0', 10));
    setFormData(prev => ({
      ...prev,
      becados: {
        ...prev.becados,
        [category]: {
          ...prev.becados[category],
          [field]: num
        }
      }
    }));
  };

  const handlePorcentajeChange = (value: string) => {
    const num = Math.min(100, Math.max(0, parseInt(value || '0', 10)));
    setFormData(prev => ({
      ...prev,
      becados: {
        ...prev.becados,
        porcentajeSubvencion: num
      }
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/admin/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok && data?.success) {
        setStatusMessage({
          type: 'success',
          text: '¡Tarifas actualizadas con éxito! Los precios en la página de inicio, programas y matrículas ya están sincronizados.'
        });
        await refreshPricing();
      } else {
        throw new Error(data?.error || 'No se pudieron guardar las tarifas');
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Error de conexión al guardar tarifas.'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout title="Gestión de Tarifas & Matrículas" activeTab="tarifas">
      <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
        
        {/* ========================================================= */}
        {/* 1. HEADER ESTANDARIZADO DE TARIFAS                        */}
        {/* ========================================================= */}
        <header className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs p-5 sm:p-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="space-y-1">
            <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Link href="/dashboard/admin" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                <span>Dashboard</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className="font-bold text-slate-900">Tarifas & Matrículas</span>
            </nav>
            <div className="flex items-center gap-2.5 pt-0.5">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                Tarifas Académicas y Subvenciones
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase tracking-wider">
                Control Central 2026
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium max-w-2xl">
              Configura los valores de matrículas y mensualidades para modalidad presencial y virtual. Los cambios que guardes aquí se reflejan de inmediato en toda la plataforma pública sin tocar código.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="py-2.5 px-5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95 disabled:opacity-60"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-emerald-400" />
                  <span>Publicar Tarifas en la Web</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* ========================================================= */}
        {/* 2. 4 CARDS DE MÉTRICAS (DISEÑO BLANCO HOMOGÉNEO)          */}
        {/* ========================================================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div 
            whileHover={{ y: -3 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Matrícula Base</p>
                <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{formatCop(formData.presencial.adultos.matricula)}</p>
                <p className="text-[10px] text-slate-500 font-medium mt-1">Presencial y Virtual</p>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-2xs">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Presencial Adultos</p>
                <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{formatCop(formData.presencial.adultos.mensualidad)}</p>
                <p className="text-[10px] text-slate-500 font-medium mt-1">Sede Turbo ({formatCop(formData.presencial.ninos.mensualidad)} Niños)</p>
              </div>
              <div className="p-3 rounded-2xl bg-blue-50 text-blue-700 border border-blue-100 shadow-2xs">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Virtual Adultos</p>
                <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{formatCop(formData.virtual.adultos.mensualidad)}</p>
                <p className="text-[10px] text-slate-500 font-medium mt-1">100% Online ({formatCop(formData.virtual.ninos.mensualidad)} Niños)</p>
              </div>
              <div className="p-3 rounded-2xl bg-purple-50 text-purple-700 border border-purple-100 shadow-2xs">
                <Laptop className="w-5 h-5" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Subvención Urabá</p>
                <p className="text-xl sm:text-2xl font-black text-rose-600 mt-1">{formatCop(formData.becados.adultos.mensualidad)}</p>
                <p className="text-[10px] text-rose-700 font-bold mt-1">Exclusiva Sede Física Turbo</p>
              </div>
              <div className="p-3 rounded-2xl bg-rose-50 text-rose-700 border border-rose-100 shadow-2xs">
                <HeartHandshake className="w-5 h-5" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* FEEDBACK DE ESTADO */}
        <AnimatePresence>
          {statusMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`p-4 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-3 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* GRID PRINCIPAL: PRESENCIAL VS VIRTUAL */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* 1. MODALIDAD PRESENCIAL (SEDE CAMPENSTRE TURBO) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Modalidad Presencial</h2>
                    <p className="text-xs text-slate-500">Sede Campestre Turbo - Urabá (Km 1.5)</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-100/70 text-blue-800 text-[11px] font-bold">
                  Sede Física
                </span>
              </div>

              {/* NIÑOS PRESENCIAL */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-800">Niños (Kids & Teens · 3 a 16 años)</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">Presencial</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Matrícula Única ($ COP)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData?.presencial?.ninos?.matricula || 0}
                        onChange={(e) => handlePresencialChange('ninos', 'matricula', e.target.value)}
                        className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Vista: {formatCop(formData?.presencial?.ninos?.matricula || 0)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Mensualidad ($ COP)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData?.presencial?.ninos?.mensualidad || 0}
                        onChange={(e) => handlePresencialChange('ninos', 'mensualidad', e.target.value)}
                        className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Vista: {formatCop(formData?.presencial?.ninos?.mensualidad || 0)}
                    </p>
                  </div>
                </div>
              </div>

              {/* ADULTOS PRESENCIAL */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-800">Jóvenes & Adultos (A1 a C1)</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">Presencial</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Matrícula Única ($ COP)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData?.presencial?.adultos?.matricula || 0}
                        onChange={(e) => handlePresencialChange('adultos', 'matricula', e.target.value)}
                        className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Vista: {formatCop(formData?.presencial?.adultos?.matricula || 0)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Mensualidad ($ COP)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData?.presencial?.adultos?.mensualidad || 0}
                        onChange={(e) => handlePresencialChange('adultos', 'mensualidad', e.target.value)}
                        className="w-full bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Vista: {formatCop(formData?.presencial?.adultos?.mensualidad || 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Elegible para Beca:</strong> Los alumnos presenciales de Urabá pueden postularse al fondo de subvención comunitaria.</span>
              </div>
            </div>

            {/* 2. MODALIDAD VIRTUAL (CAMPUS ONLINE & TEAMS) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Modalidad Virtual en Vivo</h2>
                    <p className="text-xs text-slate-500">Campus Virtual Teams + Plataforma 24/7</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-purple-100/70 text-purple-800 text-[11px] font-bold">
                  Online Global
                </span>
              </div>

              {/* NIÑOS VIRTUAL */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-bold text-slate-800">Niños Virtual (Kids Online · 3 a 16 años)</span>
                  </div>
                  <span className="text-[11px] font-bold text-purple-700">Online</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Matrícula Virtual ($ COP)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData?.virtual?.ninos?.matricula || 0}
                        onChange={(e) => handleVirtualChange('ninos', 'matricula', e.target.value)}
                        className="w-full bg-white border border-slate-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Vista: {formatCop(formData?.virtual?.ninos?.matricula || 0)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Mensualidad Virtual ($ COP)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData?.virtual?.ninos?.mensualidad || 0}
                        onChange={(e) => handleVirtualChange('ninos', 'mensualidad', e.target.value)}
                        className="w-full bg-white border border-slate-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Vista: {formatCop(formData?.virtual?.ninos?.mensualidad || 0)}
                    </p>
                  </div>
                </div>
              </div>

              {/* ADULTOS VIRTUAL */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-bold text-slate-800">Jóvenes & Adultos Virtual (En Vivo)</span>
                  </div>
                  <span className="text-[11px] font-bold text-purple-700">Online</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Matrícula Virtual ($ COP)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData?.virtual?.adultos?.matricula || 0}
                        onChange={(e) => handleVirtualChange('adultos', 'matricula', e.target.value)}
                        className="w-full bg-white border border-slate-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Vista: {formatCop(formData?.virtual?.adultos?.matricula || 0)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Mensualidad Virtual ($ COP)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData?.virtual?.adultos?.mensualidad || 0}
                        onChange={(e) => handleVirtualChange('adultos', 'mensualidad', e.target.value)}
                        className="w-full bg-white border border-slate-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Vista: {formatCop(formData?.virtual?.adultos?.mensualidad || 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span><strong>Sin Beca Comunitaria:</strong> La modalidad virtual incluye acceso a Microsoft Teams 24/7 y plataforma internacional, por lo que no es objeto de subvención social local.</span>
              </div>
            </div>

          </div>

          {/* 3. SECCIÓN ESPECIAL: FONDO DE BECAS & SUBVENCIONES (SEDE URABÁ) */}
          <div className="bg-gradient-to-br from-amber-50/60 via-white to-amber-50/30 rounded-2xl border border-amber-200 shadow-sm p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                  <HeartHandshake className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Tarifas Solidarias para Estudiantes Becados
                  </h2>
                  <p className="text-xs text-amber-800 font-semibold">
                    Exclusivo: Estudiantes locales de bajos recursos · Sede Presencial Turbo
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-200/80 text-amber-900 text-xs font-extrabold w-fit">
                Impacto Social Urabá
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* NIÑOS BECADOS */}
              <div className="p-4 rounded-xl bg-white border border-amber-200 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Niños Becados</span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-100 text-amber-800">Solidario</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-600 mb-0.5">Matrícula Solidaria ($ COP)</label>
                    <input
                      type="text"
                      value={formData?.becados?.ninos?.matricula ?? 25000}
                      onChange={(e) => handleBecadosChange('ninos', 'matricula', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900"
                    />
                    <p className="text-[10px] text-slate-400 mt-0.5">{formatCop(formData?.becados?.ninos?.matricula ?? 25000)}</p>
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-600 mb-0.5">Mensualidad Becado ($ COP)</label>
                    <input
                      type="text"
                      value={formData?.becados?.ninos?.mensualidad ?? 75000}
                      onChange={(e) => handleBecadosChange('ninos', 'mensualidad', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900"
                    />
                    <p className="text-[10px] text-slate-400 mt-0.5">{formatCop(formData?.becados?.ninos?.mensualidad ?? 75000)}</p>
                  </div>
                </div>
              </div>

              {/* ADULTOS BECADOS */}
              <div className="p-4 rounded-xl bg-white border border-amber-200 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Jóvenes & Adultos Becados</span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-100 text-amber-800">Solidario</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-600 mb-0.5">Matrícula Solidaria ($ COP)</label>
                    <input
                      type="text"
                      value={formData?.becados?.adultos?.matricula ?? 25000}
                      onChange={(e) => handleBecadosChange('adultos', 'matricula', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900"
                    />
                    <p className="text-[10px] text-slate-400 mt-0.5">{formatCop(formData?.becados?.adultos?.matricula ?? 25000)}</p>
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-600 mb-0.5">Mensualidad Becado ($ COP)</label>
                    <input
                      type="text"
                      value={formData?.becados?.adultos?.mensualidad ?? 100000}
                      onChange={(e) => handleBecadosChange('adultos', 'mensualidad', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900"
                    />
                    <p className="text-[10px] text-slate-400 mt-0.5">{formatCop(formData?.becados?.adultos?.mensualidad ?? 100000)}</p>
                  </div>
                </div>
              </div>

              {/* PORCENTAJE & CONDICIÓN ÉTICA */}
              <div className="p-4 rounded-xl bg-white border border-amber-200 space-y-3 shadow-2xs flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900">Porcentaje de Subvención Oficial</span>
                  <div className="mt-2">
                    <label className="block text-[10.5px] font-bold text-slate-600 mb-0.5">Beca Social Máxima (%)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData?.becados?.porcentajeSubvencion ?? 50}
                        onChange={(e) => handlePorcentajeChange(e.target.value)}
                        className="w-24 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900"
                      />
                      <span className="text-sm font-extrabold text-amber-700">% Beca</span>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200/80 text-[10.5px] text-amber-900 font-medium">
                  <strong>Compromiso Ético:</strong> Aplicable exclusivamente para estudiantes con residencia comprobada en Turbo, Apartadó, Carepa o Necoclí que asisten físicamente.
                </div>
              </div>

            </div>
          </div>

          {/* BOTÓN INFERIOR DE PUBLICAR */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto py-3 px-8 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30 transition-all cursor-pointer active:scale-95 disabled:opacity-60"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Guardando y sincronizando precios...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Publicar Tarifas en la Web</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </DashboardLayout>
  );
}
