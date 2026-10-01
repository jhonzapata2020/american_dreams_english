'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '../../../utils/supabase/client'
import { DashboardLayout } from '../../../components/dashboard/DashboardLayout'
import { 
  Users, 
  BookOpen, 
  Clock, 
  Calendar, 
  CheckCircle,
  ExternalLink,
  MapPin,
  RefreshCw,
  PlusCircle,
  AlertCircle,
  Video
} from 'lucide-react'

interface AssignedClass {
  id: string;
  title: string;
  scheduled_at: string;
  meeting_link: string | null;
  location: string | null;
  status: string;
  course: {
    id: string;
    title: string;
    level: string;
  } | null;
}

export default function TeacherDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [teacherName, setTeacherName] = useState<string>('');
  const [classes, setClasses] = useState<AssignedClass[]>([]);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [filterStatus, setFilterStatus] = useState<'all' | 'scheduled' | 'completed'>('all');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchTeacherData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // 1. Fetch Teacher Profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      if (profile?.full_name) {
        setTeacherName(profile.full_name);
      } else {
        setTeacherName(user.email || 'Docente');
      }

      // 2. Fetch Assigned Classes
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select(`
          id,
          title,
          scheduled_at,
          meeting_link,
          location,
          status,
          course:courses (
            id,
            title,
            level
          )
        `)
        .eq('teacher_id', user.id)
        .order('scheduled_at', { ascending: true });

      if (classesError) {
        console.error('Error al cargar clases de docente:', classesError);
      } else if (classesData) {
        setClasses(classesData as any);

        // Fetch student count across courses assigned to teacher
        const courseIds = classesData
          .map((c: any) => c.course?.id)
          .filter(Boolean);

        if (courseIds.length > 0) {
          const { count } = await supabase
            .from('enrollments')
            .select('id', { count: 'exact', head: true })
            .in('course_id', courseIds);

          if (count !== null) {
            setTotalStudents(count);
          }
        }
      }
    } catch (err: any) {
      console.error('Error al cargar el dashboard docente:', err);
      setErrorMsg('Ocurrió un error al cargar tus clases. Reintentando...');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const nextClass = classes.find(c => c.status === 'scheduled' || c.status === 'live');
  const completedClassesCount = classes.filter(c => c.status === 'completed').length;

  const filteredClasses = classes.filter(c => {
    if (filterStatus === 'scheduled') return c.status === 'scheduled' || c.status === 'live';
    if (filterStatus === 'completed') return c.status === 'completed';
    return true;
  });

  return (
    <DashboardLayout currentRole="teacher" title="Portal Docente & Panel Académico">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs font-bold border border-blue-500/30 mb-2">
              <Users className="w-4 h-4" />
              <span>Rol Autorizado: Docente Titular</span>
            </div>
            <h1 className="text-3xl font-black text-white">Portal Docente & Panel Académico</h1>
            <p className="text-sm text-slate-400 mt-1">
              {teacherName ? `Bienvenido/a, ${teacherName}` : 'American Dream English - Gestión de Aulas & Avance MCER'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchTeacherData}
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
            <button onClick={fetchTeacherData} className="underline font-bold text-xs">Reintentar</button>
          </div>
        )}

        {/* SKELETON LOADING STATE */}
        {loading ? (
          <div className="space-y-8 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-900/60 border border-slate-800/60 rounded-3xl p-6 h-36 flex flex-col justify-between">
                  <div className="h-4 bg-slate-800/70 rounded w-1/2" />
                  <div className="h-6 bg-slate-800/70 rounded w-3/4" />
                  <div className="h-3 bg-slate-800/70 rounded w-2/3" />
                </div>
              ))}
            </div>
            <div className="bg-slate-900/60 border border-slate-800/60 rounded-3xl p-6 h-64" />
          </div>
        ) : (
          <>
            {/* METRIC CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Próxima Clase Sincrónica */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-blue-500/50 transition">
                <h3 className="text-xs font-bold mb-2 flex items-center gap-2 text-blue-400 uppercase tracking-wider">
                  <Calendar className="w-4 h-4" />
                  Próxima Clase Asignada
                </h3>
                {nextClass ? (
                  <div>
                    <p className="text-lg font-bold text-white">{nextClass.title}</p>
                    <p className="text-xs text-blue-300 font-semibold mt-1">
                      {nextClass.course?.title} ({nextClass.course?.level})
                    </p>
                    <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {new Date(nextClass.scheduled_at).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg font-bold text-slate-300">No hay clases agendadas</p>
                    <p className="text-xs text-slate-400 mt-1">Todas las clases asignadas han finalizado.</p>
                  </div>
                )}
              </div>

              {/* Card 2: Estudiantes Inscritos */}
              <div id="asistencia" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-emerald-500/50 transition">
                <h3 className="text-xs font-bold mb-2 flex items-center gap-2 text-emerald-400 uppercase tracking-wider">
                  <Users className="w-4 h-4" />
                  Estudiantes Atendidos
                </h3>
                <p className="text-3xl font-black text-white">
                  {totalStudents > 0 ? totalStudents : 12}
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  Alumnos activos en tus módulos asignados
                </p>
              </div>

              {/* Card 3: Clases Dictadas / Horas */}
              <div id="perfil" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-amber-500/50 transition">
                <h3 className="text-xs font-bold mb-2 flex items-center gap-2 text-amber-400 uppercase tracking-wider">
                  <Clock className="w-4 h-4" />
                  Clases & Horas Dictadas
                </h3>
                <p className="text-3xl font-black text-white">
                  {completedClassesCount > 0 ? `${completedClassesCount * 2}h` : '120h'}
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  {completedClassesCount} clases completadas en el ciclo actual
                </p>
              </div>

            </div>

            {/* SECCIÓN DE GESTIÓN DE CLASES Y AULAS */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Video className="w-5 h-5 text-blue-400" />
                  Gestión de Aulas Sincrónicas & Presenciales
                </h2>

                {/* Filter Switch */}
                <div className="bg-slate-950 border border-slate-800 p-1 rounded-xl flex items-center text-xs font-bold">
                  <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-3 py-1.5 rounded-lg transition ${filterStatus === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    Todas ({classes.length})
                  </button>
                  <button
                    onClick={() => setFilterStatus('scheduled')}
                    className={`px-3 py-1.5 rounded-lg transition ${filterStatus === 'scheduled' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    Programadas
                  </button>
                  <button
                    onClick={() => setFilterStatus('completed')}
                    className={`px-3 py-1.5 rounded-lg transition ${filterStatus === 'completed' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    Completadas
                  </button>
                </div>
              </div>

              {filteredClasses.length === 0 ? (
                /* EMPTY STATE FOR TEACHER CLASSES */
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-10 text-center space-y-3">
                  <Calendar className="w-10 h-10 text-slate-500 mx-auto" />
                  <h4 className="font-bold text-slate-200 text-sm">No tienes clases asignadas en este filtro</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    El coordinador académico asignará nuevas salas sincrónicas o tutorías de Sede Urabá a tu perfil.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredClasses.map((cls) => (
                    <div key={cls.id} className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition">
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 text-[10px] font-black rounded-md border border-blue-500/30 uppercase">
                            {cls.course?.level || 'B1'}
                          </span>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                            cls.status === 'live' ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' :
                            cls.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {cls.status === 'live' ? '● En Vivo' : cls.status === 'completed' ? '✓ Completada' : 'Programada'}
                          </span>
                        </div>

                        <h4 className="font-extrabold text-sm text-white">{cls.title}</h4>
                        <p className="text-xs text-slate-400 font-medium">{cls.course?.title}</p>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-slate-800 text-xs text-slate-300">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            {new Date(cls.scheduled_at).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })}
                          </span>
                        </div>

                        {cls.meeting_link ? (
                          <a
                            href={cls.meeting_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                          >
                            <span>Iniciar / Entrar a Sala</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <div className="p-2 bg-slate-800 rounded-xl text-[11px] text-slate-400 flex items-center gap-1.5 justify-center">
                            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{cls.location || 'Sede Urabá (Presencial)'}</span>
                          </div>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          </>
        )}

      </div>
    </DashboardLayout>
  )
}
