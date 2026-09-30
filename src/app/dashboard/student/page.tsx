'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '../../../utils/supabase/client'
import { 
  GraduationCap, 
  BookOpen, 
  Award, 
  CheckCircle, 
  Calendar, 
  Clock, 
  ExternalLink,
  MapPin,
  RefreshCw,
  Sparkles,
  UserCheck,
  AlertCircle
} from 'lucide-react'

interface Enrollment {
  id: string;
  scholarship_type: string;
  completed_hours: number;
  grade: number;
  status: string;
  course: {
    id: string;
    title: string;
    level: string;
    description: string;
    total_hours: number;
  } | null;
}

interface ScheduledClass {
  id: string;
  title: string;
  scheduled_at: string;
  meeting_link: string | null;
  location: string | null;
  status: string;
  course?: {
    title: string;
  } | null;
}

export default function StudentDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [profileName, setProfileName] = useState<string>('');
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<ScheduledClass[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchStudentData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // 1. Fetch Profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      if (profile?.full_name) {
        setProfileName(profile.full_name);
      } else {
        setProfileName(user.email || 'Estudiante');
      }

      // 2. Fetch Enrollments with Course details
      const { data: enrollData, error: enrollError } = await supabase
        .from('enrollments')
        .select(`
          id,
          scholarship_type,
          completed_hours,
          grade,
          status,
          course:courses (
            id,
            title,
            level,
            description,
            total_hours
          )
        `)
        .eq('student_id', user.id);

      if (enrollError) {
        console.error('Error al cargar inscripciones:', enrollError);
      } else if (enrollData) {
        setEnrollments(enrollData as any);

        // Extract enrolled course IDs to fetch classes
        const courseIds = enrollData
          .map((e: any) => e.course?.id)
          .filter(Boolean);

        if (courseIds.length > 0) {
          const { data: classesData, error: classesError } = await supabase
            .from('classes')
            .select(`
              id,
              title,
              scheduled_at,
              meeting_link,
              location,
              status,
              course:courses ( title )
            `)
            .in('course_id', courseIds)
            .gte('scheduled_at', new Date().toISOString())
            .order('scheduled_at', { ascending: true })
            .limit(5);

          if (!classesError && classesData) {
            setUpcomingClasses(classesData as any);
          }
        }
      }
    } catch (err: any) {
      console.error('Error al cargar el dashboard de estudiante:', err);
      setErrorMsg('Ocurrió un error al cargar tus datos. Reintentando...');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  // Calculate active enrollment stats
  const activeEnrollment = enrollments.find(e => e.status === 'active') || enrollments[0];
  const activeCourse = activeEnrollment?.course;

  const totalHours = activeCourse?.total_hours || 120;
  const completedHours = activeEnrollment?.completed_hours || 0;
  const progressPercent = Math.min(100, Math.round((completedHours / totalHours) * 100));

  const formatScholarshipType = (type?: string) => {
    switch (type) {
      case 'beca_total':
        return 'Beca Total Bilingüe (100%)';
      case 'beca_parcial':
        return 'Beca Parcial Mensual Activa (50%)';
      case 'particular':
        return 'Matrícula Estándar';
      default:
        return type || 'Beca Parcial Activa';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 sm:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-600/20 text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/30 mb-2">
              <GraduationCap className="w-4 h-4" />
              <span>Rol Autorizado: Estudiante</span>
            </div>
            <h1 className="text-3xl font-black">
              Portal del Estudiante & Becario
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {profileName ? `Bienvenido/a, ${profileName}` : 'American Dream English - Sede Urabá & Plataforma Global'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchStudentData}
              disabled={loading}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1 border border-slate-700"
              title="Actualizar datos"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Link
              href="/"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition-colors border border-slate-700"
            >
              Ver Sitio Público
            </Link>
          </div>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="p-4 bg-red-900/40 border border-red-500/50 text-red-200 text-xs rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button onClick={fetchStudentData} className="underline font-bold text-xs">Reintentar</button>
          </div>
        )}

        {/* SKELETON LOADING STATE */}
        {loading ? (
          <div className="space-y-8 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 h-36 flex flex-col justify-between">
                  <div className="h-4 bg-slate-700/70 rounded w-1/2" />
                  <div className="h-6 bg-slate-700/70 rounded w-3/4" />
                  <div className="h-3 bg-slate-700/70 rounded w-2/3" />
                </div>
              ))}
            </div>
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 h-64" />
          </div>
        ) : (
          <>
            {/* METRICS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Nivel MCER */}
              <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 hover:border-emerald-500/50 transition">
                <h3 className="text-xs font-bold mb-2 flex items-center gap-2 text-emerald-400 uppercase tracking-wider">
                  <Award className="w-4 h-4" />
                  Nivel MCER Actual
                </h3>
                <p className="text-2xl font-black text-white">
                  {activeCourse ? `${activeCourse.level} - ${activeCourse.title}` : 'B1 Pre-Intermedio'}
                </p>
                <div className="mt-3 space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-400 font-semibold">
                    <span>Progreso de Horas</span>
                    <span>{completedHours} de {totalHours}h ({progressPercent}%)</span>
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${progressPercent}%` }} 
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Materiales & Recursos */}
              <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 hover:border-blue-500/50 transition">
                <h3 className="text-xs font-bold mb-2 flex items-center gap-2 text-blue-400 uppercase tracking-wider">
                  <BookOpen className="w-4 h-4" />
                  Materiales Habilitados
                </h3>
                <p className="text-lg font-bold text-white">
                  Audios Fonéticos & Masterclasses 4K
                </p>
                <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Acceso 24/7 desde cualquier dispositivo
                </p>
              </div>

              {/* Card 3: Estado de Beca */}
              <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 hover:border-amber-500/50 transition">
                <h3 className="text-xs font-bold mb-2 flex items-center gap-2 text-amber-400 uppercase tracking-wider">
                  <CheckCircle className="w-4 h-4" />
                  Estado de Beca / Matrícula
                </h3>
                <p className="text-lg font-bold text-white">
                  {formatScholarshipType(activeEnrollment?.scholarship_type)}
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  Fondo Social Urabá (Turbo, Apartadó & Región)
                </p>
              </div>

            </div>

            {/* SECCIÓN 1: CURSOS Y CLASES PROGRAMADAS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Cursos Matriculados (7 cols) */}
              <div className="lg:col-span-7 bg-slate-800 border border-slate-700 rounded-3xl p-6 space-y-4">
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2 border-b border-slate-700 pb-3">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                  Mis Cursos & Módulos Activos
                </h2>

                {enrollments.length === 0 ? (
                  /* EMPTY STATE FOR ENROLLMENTS */
                  <div className="bg-slate-900/60 border border-slate-700/80 rounded-2xl p-8 text-center space-y-3">
                    <UserCheck className="w-10 h-10 text-slate-500 mx-auto" />
                    <h4 className="font-bold text-slate-200 text-sm">No tienes cursos matriculados actualmente</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Tu solicitud de beca o matrícula está en proceso de asignación por parte de un asesor pedagógico.
                    </p>
                    <Link
                      href="/#donaciones"
                      className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition mt-2"
                    >
                      Ver Opciones de Beca y Catálogo
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {enrollments.map((enr) => (
                      <div key={enr.id} className="bg-slate-900/80 border border-slate-700 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-black rounded-md border border-emerald-500/30">
                              {enr.course?.level || 'B1'}
                            </span>
                            <h4 className="font-extrabold text-sm text-white">{enr.course?.title || 'Curso Bilingüe'}</h4>
                          </div>
                          <p className="text-xs text-slate-400">{enr.course?.description || 'Programa de conversación e inglés laboral.'}</p>
                        </div>
                        <div className="text-left sm:text-right flex-shrink-0">
                          <span className="text-xs font-bold text-slate-300 block">Horas: {enr.completed_hours} / {enr.course?.total_hours || 120}h</span>
                          <span className="text-[11px] text-emerald-400 font-semibold uppercase">{enr.status === 'active' ? '● En Curso' : enr.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Próximas Clases Sincrónicas / Presenciales (5 cols) */}
              <div className="lg:col-span-5 bg-slate-800 border border-slate-700 rounded-3xl p-6 space-y-4">
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2 border-b border-slate-700 pb-3">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  Próximas Clases Agendadas
                </h2>

                {upcomingClasses.length === 0 ? (
                  /* EMPTY STATE FOR CLASSES */
                  <div className="bg-slate-900/60 border border-slate-700/80 rounded-2xl p-8 text-center space-y-2">
                    <Clock className="w-9 h-9 text-slate-500 mx-auto" />
                    <h4 className="font-bold text-slate-200 text-xs">No hay clases programadas para esta semana</h4>
                    <p className="text-[11px] text-slate-400">
                      Tus profesores publicarán los enlaces sincrónicos de Zoom/Meet o tutorías de Sede Urabá en breve.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingClasses.map((cls) => (
                      <div key={cls.id} className="bg-slate-900/80 border border-slate-700 p-4 rounded-2xl space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-xs text-white">{cls.title}</h4>
                            <p className="text-[11px] text-blue-400 font-semibold">{cls.course?.title}</p>
                          </div>
                          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-[10px] font-extrabold rounded-md border border-blue-500/30">
                            {new Date(cls.scheduled_at).toLocaleDateString('es-CO', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800">
                          <span className="flex items-center gap-1 text-[11px]">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            {new Date(cls.scheduled_at).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                          </span>

                          {cls.meeting_link ? (
                            <a
                              href={cls.meeting_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] px-3 py-1 rounded-lg transition"
                            >
                              <span>Unirse a Clase</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-[11px] text-slate-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-emerald-400" />
                              {cls.location || 'Sede Urabá'}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </>
        )}

      </div>
    </div>
  )
}
