import React, { useState, useEffect } from 'react';
import { 
  X, 
  Heart, 
  GraduationCap, 
  ShieldCheck, 
  CheckCircle2, 
  MessageCircle, 
  ArrowRight,
  Building2,
  Lock,
  CreditCard,
  Receipt,
  DollarSign
} from 'lucide-react';
import { Currency, PaymentProvider } from '../types';
import { DONATION_TIERS, SCHOLARSHIP_RECIPIENTS } from '../data/sprint1Data';
import { formatCOPK } from '../utils/formatters';

interface ScholarshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency?: Currency;
}

export const ScholarshipModal: React.FC<ScholarshipModalProps> = ({
  isOpen,
  onClose,
  currency = 'COP',
}) => {
  const [activeTab, setActiveTab] = useState<'apply' | 'donate'>('apply');
  
  // Student Application State
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [municipio, setMunicipio] = useState('Turbo');
  const [studyLevel, setStudyLevel] = useState('Bachillerato');
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  // Donor State
  const [selectedTierId, setSelectedTierId] = useState<string>('tier-2');
  const [coversFee, setCoversFee] = useState(true);
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [activeGateway, setActiveGateway] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isUSD = currency === 'USD' || currency === 'EUR';
  const selectedTier = DONATION_TIERS.find(t => t.id === selectedTierId) || DONATION_TIERS[1];
  const baseAmount = isUSD ? selectedTier.usdAmount : selectedTier.copAmount;
  const feeAmount = coversFee ? baseAmount * 0.035 : 0;
  const totalAmount = baseAmount + feeAmount;

  const formatMoney = (amount: number, curr: Currency) => {
    if (curr === 'USD') {
      return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} USD`;
    }
    return `$${Math.round(amount).toLocaleString('es-CO')} COP`;
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSuccess(true);
    setTimeout(() => {
      const message = encodeURIComponent(
        `Hola American Dream English, me llamo ${studentName}, vivo en ${municipio} (${studyLevel}) y quiero postularme al Fondo de Becas Urabá.`
      );
      window.open(`https://wa.me/573127459728?text=${message}`, '_blank');
    }, 1200);
  };

  const handleProcessPayment = (provider: PaymentProvider, e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName || !donorEmail) {
      alert('Por favor completa tu Nombre y Correo Electrónico.');
      return;
    }
    setActiveGateway(provider);
    setTimeout(() => {
      setPaymentSuccess(true);
      setActiveGateway(null);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fadeIn font-sans">
      
      {/* Backdrop Click Listener */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[92vh]">
        
        {/* MODAL HEADER */}
        <div className="bg-navy-900 text-white p-6 flex items-center justify-between border-b border-navy-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-orange-600 rounded-xl text-white shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">Fondo Social de Becas Urabá</h3>
              <p className="text-xs text-slate-300">
                Oportunidades bilingües para jóvenes de Apartadó, Turbo, Currulao y la región
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-navy-800 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* TAB NAVIGATION HEADER */}
        <div className="bg-slate-100 p-1.5 border-b border-slate-200 grid grid-cols-2 text-xs font-extrabold">
          <button
            type="button"
            onClick={() => setActiveTab('apply')}
            className={`py-3 rounded-xl transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'apply'
                ? 'bg-white text-navy-900 shadow-sm font-black'
                : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-orange-600" />
            <span>🎓 Postularme a una Beca</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('donate')}
            className={`py-3 rounded-xl transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'donate'
                ? 'bg-white text-navy-900 shadow-sm font-black'
                : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            <Heart className="w-4 h-4 text-red-600 fill-red-600/20" />
            <span>❤ Aportar al Fondo (Donantes)</span>
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          
          {activeTab === 'apply' ? (
            /* TAB 1: STUDENT APPLICATION */
            <div className="space-y-5">
              
              {appliedSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-3xl text-center space-y-4 animate-fadeIn">
                  <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
                  <h4 className="text-xl font-black text-navy-900">¡Postulación Registrada!</h4>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                    Tu pre-inscripción ha sido enviada. Te redirigiremos a WhatsApp con un asesor pedagógico de la Sede Urabá para validar tus documentos.
                  </p>
                  <button
                    onClick={onClose}
                    className="bg-navy-900 hover:bg-navy-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs"
                  >
                    Entendido / Cerrar
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-4">
                  
                  <div className="bg-orange-50 border border-orange-200 p-4 rounded-2xl text-xs text-orange-900 space-y-1">
                    <strong className="font-bold flex items-center gap-1">
                      <Building2 className="w-4 h-4 text-orange-600" /> Requisitos de Postulación:
                    </strong>
                    <p className="text-[11px] text-orange-800 leading-relaxed">
                      Residir en municipios de Urabá (Turbo, Apartadó, Currulao, Necoclí, Carepa, Chigorodó) y contar con disposición para clases presenciales o virtuales.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Completo del Estudiante *</label>
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="Ej. Juan David Gómez"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={studentPhone}
                        onChange={(e) => setStudentPhone(e.target.value)}
                        placeholder="+57 300 000 0000"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Municipio de Residencia *</label>
                      <select
                        value={municipio}
                        onChange={(e) => setMunicipio(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                      >
                        <option value="Turbo">Turbo (Sede Principal)</option>
                        <option value="Apartadó">Apartadó</option>
                        <option value="Currulao">Currulao</option>
                        <option value="Necoclí">Necoclí</option>
                        <option value="Carepa">Carepa</option>
                        <option value="Chigorodó">Chigorodó</option>
                        <option value="Otro">Otro Municipio de Urabá</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nivel Educativo Actual *</label>
                    <select
                      value={studyLevel}
                      onChange={(e) => setStudyLevel(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                    >
                      <option value="Primaria">Primaria (Niños 6 - 12 años)</option>
                      <option value="Bachillerato">Bachillerato (13 - 17 años)</option>
                      <option value="Universidad / Técnico">Universidad / Educación Técnica</option>
                      <option value="Búsqueda de Empleo">Búsqueda de Empleo / Laboral</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-extrabold py-4 px-6 rounded-2xl shadow-md transition-all text-xs uppercase tracking-wider flex items-center justify-center space-x-2 mt-4"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Enviar Postulación a Beca por WhatsApp</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[10px] text-slate-400 text-center">
                    * Datos protegidos en cumplimiento de la Ley de Habeas Data (Ley 1581 de 2012).
                  </p>

                </form>
              )}

            </div>
          ) : (
            /* TAB 2: DONOR SUPPORT */
            <div className="space-y-6">
              
              {paymentSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-3xl text-center space-y-4 animate-fadeIn">
                  <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
                  <h4 className="text-xl font-black text-navy-900">¡Muchas Gracias por tu Donación!</h4>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                    Tu contribución por <strong className="text-navy-900">{formatMoney(totalAmount, currency)}</strong> ha sido procesada. Se ha enviado el Certificado Tributario a <strong>{donorEmail}</strong>.
                  </p>
                  <button
                    onClick={onClose}
                    className="bg-navy-900 text-white font-bold px-6 py-2.5 rounded-xl text-xs"
                  >
                    Cerrar
                  </button>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                  
                  {/* Select Tier Level */}
                  <div>
                    <label className="block text-xs font-extrabold text-navy-900 uppercase tracking-wider mb-2">
                      Selecciona el Nivel de Impacto:
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {DONATION_TIERS.map(t => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setSelectedTierId(t.id)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            selectedTierId === t.id ? 'bg-navy-900 text-white border-navy-900 shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          <span className="font-bold block text-xs">{t.title}</span>
                          <span className={`text-xs font-extrabold ${selectedTierId === t.id ? 'text-amber-400' : 'text-red-600'}`} suppressHydrationWarning>
                            {isUSD ? `$${t.usdAmount} USD` : `$${formatCOPK(t.copAmount)}k COP`}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Donor details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Completo *</label>
                      <input
                        type="text"
                        required
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        placeholder="Ej. Dr. Roberto Gómez"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico *</label>
                      <input
                        type="email"
                        required
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        placeholder="roberto@empresa.org"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Gateway options */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-600">Total a Procesar:</span>
                      <span className="text-lg font-black text-red-600">{formatMoney(totalAmount, currency)}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                      {isUSD ? (
                        <>
                          <button
                            type="button"
                            onClick={(e) => handleProcessPayment('stripe', e)}
                            className="bg-indigo-700 hover:bg-indigo-800 text-white py-3.5 px-4 rounded-xl flex items-center justify-center space-x-1.5"
                          >
                            <CreditCard className="w-4 h-4 text-indigo-200" />
                            <span>Stripe (USD)</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleProcessPayment('paypal', e)}
                            className="bg-amber-400 hover:bg-amber-500 text-navy-950 py-3.5 px-4 rounded-xl flex items-center justify-center space-x-1.5"
                          >
                            <DollarSign className="w-4 h-4 text-navy-900" />
                            <span>PayPal</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={(e) => handleProcessPayment('redeban', e)}
                            className="bg-navy-900 hover:bg-navy-950 text-white py-3.5 px-4 rounded-xl flex items-center justify-center space-x-1.5"
                          >
                            <Receipt className="w-4 h-4 text-amber-400" />
                            <span>Redeban (Tarjetas)</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleProcessPayment('wompi', e)}
                            className="bg-red-600 hover:bg-red-700 text-white py-3.5 px-4 rounded-xl flex items-center justify-center space-x-1.5"
                          >
                            <CreditCard className="w-4 h-4 text-white" />
                            <span>Wompi (PSE / Nequi)</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                </form>
              )}

            </div>
          )}

          {/* FOOTER AUDIT / SECURITY */}
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex items-center justify-between text-[11px] text-slate-600">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Garantía Institucional American Dream English</span>
            </div>
            <span className="text-navy-900 font-bold flex items-center gap-1">
              <Lock className="w-3 h-3 text-navy-900" /> 256-bit SSL
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
