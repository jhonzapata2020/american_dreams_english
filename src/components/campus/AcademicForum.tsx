'use client'

import React, { useState, useEffect, useRef } from 'react'
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  X, 
  CornerDownRight, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  User, 
  Sparkles, 
  Maximize2,
  Reply,
  ShieldCheck,
  Award
} from 'lucide-react'
import { createClient } from '../../utils/supabase/client'
import { StudentProfileData } from './StudentProfileModal'

export interface ForumReply {
  id: string
  postId: string
  authorName: string
  authorRole: 'student' | 'teacher' | 'admin'
  authorAvatar?: string
  content: string
  imageUrl?: string
  createdAt: string
}

export interface ForumPost {
  id: string
  courseId: string
  authorName: string
  authorRole: 'student' | 'teacher' | 'admin'
  authorAvatar?: string
  content: string
  imageUrl?: string
  createdAt: string
  replies: ForumReply[]
}

interface AcademicForumProps {
  courseId: string
  teacherName: string
  student: StudentProfileData
}

const INITIAL_MOCK_POSTS: Record<string, ForumPost[]> = {
  a1: [
    {
      id: 'post-1',
      courseId: 'a1',
      authorName: 'Mateo Gómez',
      authorRole: 'student',
      authorAvatar: 'MG',
      content: 'Teacher, en la regla de la tercera persona del Present Simple, ¿cuándo se agrega "-es" en lugar de solo "-s"? ¿Aplica con todos los verbos terminados en "o"?',
      imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800',
      createdAt: 'Hace 2 horas',
      replies: [
        {
          id: 'rep-1',
          postId: 'post-1',
          authorName: 'Lic. Carlos Méndez',
          authorRole: 'teacher',
          authorAvatar: 'CM',
          content: '¡Excelente pregunta Mateo! Agregamos "-es" cuando el verbo termina en -ss, -sh, -ch, -x, -z y la vocal -o (ej: go -> goes, do -> does, watch -> watches). En la guía PDF página 12 tienes la tabla completa.',
          createdAt: 'Hace 1 hora'
        },
        {
          id: 'rep-2',
          postId: 'post-1',
          authorName: 'Valeria Morales',
          authorRole: 'student',
          authorAvatar: 'VM',
          content: 'Gracias Teacher! Yo también tenía la duda con el verbo "fix" -> "fixes".',
          createdAt: 'Hace 45 minutos'
        }
      ]
    },
    {
      id: 'post-2',
      courseId: 'a1',
      authorName: 'Camila Restrepo',
      authorRole: 'student',
      authorAvatar: 'CR',
      content: 'Hola a todos. ¿Alguien sabe si el audio lab 1 se puede descargar para escuchar sin internet en el celular?',
      createdAt: 'Ayer',
      replies: [
        {
          id: 'rep-3',
          postId: 'post-2',
          authorName: 'Lic. Carlos Méndez',
          authorRole: 'teacher',
          authorAvatar: 'CM',
          content: 'Hola Camila. Sí, en la pestaña "Material de Estudio" al lado del reproductor tienes el botón de descarga directa en formato MP3.',
          createdAt: 'Ayer'
        }
      ]
    }
  ]
}

export const AcademicForum: React.FC<AcademicForumProps> = ({
  courseId,
  teacherName,
  student
}) => {
  const supabase = createClient()
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [loading, setLoading] = useState(true)

  // Estado para nueva pregunta principal
  const [newPostContent, setNewPostContent] = useState('')
  const [newPostImage, setNewPostImage] = useState<string | null>(null)
  const [isSubmittingPost, setIsSubmittingPost] = useState(false)
  const postFileInputRef = useRef<HTMLInputElement>(null)

  // Estado para responder a un hilo
  const [replyingToPostId, setReplyingToPostId] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [replyImage, setReplyImage] = useState<string | null>(null)
  const [isSubmittingReply, setIsSubmittingReply] = useState(false)
  const replyFileInputRef = useRef<HTMLInputElement>(null)

  // Modal Lightbox para visualización de imagen en tamaño completo
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null)

  // Carga inicial con fallback a localStorage o Mock
  useEffect(() => {
    async function loadForum() {
      setLoading(true)
      try {
        const storageKey = `ade_forum_posts_${courseId}`
        const cached = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null
        
        let loadedPosts: ForumPost[] = []

        if (cached) {
          try {
            loadedPosts = JSON.parse(cached)
          } catch (e) {}
        }

        // Si no hay posts en localStorage, cargar mocks iniciales
        if (!loadedPosts || loadedPosts.length === 0) {
          loadedPosts = INITIAL_MOCK_POSTS[courseId] || INITIAL_MOCK_POSTS['a1'] || []
        }

        // Intentar consultar Supabase si las tablas existen
        try {
          const { data: dbPosts, error: pErr } = await supabase
            .from('forum_posts')
            .select('*')
            .eq('course_id', courseId)
            .order('created_at', { ascending: false })

          if (!pErr && dbPosts && dbPosts.length > 0) {
            const { data: dbReplies } = await supabase
              .from('forum_replies')
              .select('*')
              .order('created_at', { ascending: true })

            const formatted: ForumPost[] = dbPosts.map((p) => ({
              id: p.id,
              courseId: p.course_id,
              authorName: p.author_name,
              authorRole: p.author_role || 'student',
              authorAvatar: p.author_avatar || p.author_name.split(' ').map((n: string) => n[0]).slice(0, 2).join(''),
              content: p.content,
              imageUrl: p.image_url,
              createdAt: new Date(p.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
              replies: (dbReplies || [])
                .filter((r) => r.post_id === p.id)
                .map((r) => ({
                  id: r.id,
                  postId: r.post_id,
                  authorName: r.author_name,
                  authorRole: r.author_role || 'student',
                  authorAvatar: r.author_avatar || r.author_name.split(' ').map((n: string) => n[0]).slice(0, 2).join(''),
                  content: r.content,
                  imageUrl: r.image_url,
                  createdAt: new Date(r.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
                }))
            }))

            loadedPosts = formatted
          }
        } catch (supabaseErr) {
          // Continuar con caché
        }

        setPosts(loadedPosts)
      } catch (err) {
        setPosts(INITIAL_MOCK_POSTS['a1'] || [])
      } finally {
        setLoading(false)
      }
    }

    loadForum()
  }, [courseId])

  // Guardar en localStorage al modificar posts
  const persistPosts = (updatedList: ForumPost[]) => {
    setPosts(updatedList)
    try {
      localStorage.setItem(`ade_forum_posts_${courseId}`, JSON.stringify(updatedList))
    } catch (e) {}
  }

  // Soporte para Pegar Imagen desde el Portapapeles (Ctrl+V / Paste)
  const handlePasteImage = (e: React.ClipboardEvent<HTMLTextAreaElement>, target: 'post' | 'reply') => {
    const items = e.clipboardData?.items
    if (!items) return

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile()
        if (file) {
          e.preventDefault()
          const reader = new FileReader()
          reader.onload = (uploadEvent) => {
            const result = uploadEvent.target?.result as string
            if (target === 'post') {
              setNewPostImage(result)
            } else {
              setReplyImage(result)
            }
          }
          reader.readAsDataURL(file)
        }
      }
    }
  }

  // Manejar selector de archivo para publicación principal
  const handlePostFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setNewPostImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Manejar selector de archivo para respuesta
  const handleReplyFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setReplyImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Enviar Nueva Pregunta Principal
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPostContent.trim()) return

    setIsSubmittingPost(true)

    try {
      let finalImageUrl = newPostImage

      // Intentar subir a Supabase Storage si es un archivo
      if (newPostImage && newPostImage.startsWith('data:image')) {
        try {
          const blob = await (await fetch(newPostImage)).blob()
          const fileName = `post-${Date.now()}-${Math.random().toString(36).substring(7)}.png`
          const { data: uploadData, error: upErr } = await supabase.storage
            .from('forum-attachments')
            .upload(fileName, blob, { contentType: 'image/png', upsert: true })

          if (!upErr && uploadData?.path) {
            const { data: publicUrlData } = supabase.storage
              .from('forum-attachments')
              .getPublicUrl(uploadData.path)
            if (publicUrlData?.publicUrl) {
              finalImageUrl = publicUrlData.publicUrl
            }
          }
        } catch (storageErr) {
          // Mantener data URL
        }
      }

      const newPostObj: ForumPost = {
        id: `post-${Date.now()}`,
        courseId,
        authorName: student.fullName,
        authorRole: 'student',
        authorAvatar: student.avatarUrl || student.fullName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase(),
        content: newPostContent.trim(),
        imageUrl: finalImageUrl || undefined,
        createdAt: 'Hace un momento',
        replies: []
      }

      // Intentar persistir en Supabase DB
      try {
        const { data: { session } } = await supabase.auth.getSession()
        await supabase.from('forum_posts').insert([
          {
            course_id: courseId,
            user_id: session?.user?.id || null,
            author_name: student.fullName,
            author_role: 'student',
            author_avatar: student.avatarUrl || student.fullName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase(),
            content: newPostContent.trim(),
            image_url: finalImageUrl || null
          }
        ])
      } catch (dbErr) {}

      const updated = [newPostObj, ...posts]
      persistPosts(updated)

      setNewPostContent('')
      setNewPostImage(null)
      if (postFileInputRef.current) postFileInputRef.current.value = ''

    } catch (err) {
      console.error('Error al publicar post:', err)
    } finally {
      setIsSubmittingPost(false)
    }
  }

  // Enviar Respuesta a un Hilo
  const handleCreateReply = async (postId: string, e: React.FormEvent) => {
    e.preventDefault()
    if (!replyContent.trim()) return

    setIsSubmittingReply(true)

    try {
      let finalImageUrl = replyImage

      // Intentar subir a Supabase Storage
      if (replyImage && replyImage.startsWith('data:image')) {
        try {
          const blob = await (await fetch(replyImage)).blob()
          const fileName = `reply-${Date.now()}-${Math.random().toString(36).substring(7)}.png`
          const { data: uploadData, error: upErr } = await supabase.storage
            .from('forum-attachments')
            .upload(fileName, blob, { contentType: 'image/png', upsert: true })

          if (!upErr && uploadData?.path) {
            const { data: publicUrlData } = supabase.storage
              .from('forum-attachments')
              .getPublicUrl(uploadData.path)
            if (publicUrlData?.publicUrl) {
              finalImageUrl = publicUrlData.publicUrl
            }
          }
        } catch (storageErr) {}
      }

      const newReplyObj: ForumReply = {
        id: `reply-${Date.now()}`,
        postId,
        authorName: student.fullName,
        authorRole: 'student',
        authorAvatar: student.avatarUrl || student.fullName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase(),
        content: replyContent.trim(),
        imageUrl: finalImageUrl || undefined,
        createdAt: 'Hace un momento'
      }

      // Intentar insertar en Supabase DB
      try {
        const { data: { session } } = await supabase.auth.getSession()
        await supabase.from('forum_replies').insert([
          {
            post_id: postId,
            user_id: session?.user?.id || null,
            author_name: student.fullName,
            author_role: 'student',
            author_avatar: student.avatarUrl || student.fullName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase(),
            content: replyContent.trim(),
            image_url: finalImageUrl || null
          }
        ])
      } catch (dbErr) {}

      const updated = posts.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            replies: [...(p.replies || []), newReplyObj]
          }
        }
        return p
      })

      persistPosts(updated)
      setReplyContent('')
      setReplyImage(null)
      setReplyingToPostId(null)
      if (replyFileInputRef.current) replyFileInputRef.current.value = ''

    } catch (err) {
      console.error('Error al responder post:', err)
    } finally {
      setIsSubmittingReply(false)
    }
  }

  return (
    <div className="space-y-6">
      
      {/* =================================================================== */}
      {/* 1. CAJA PRINCIPAL DE PREGUNTAR AL DOCENTE / COMUNIDAD               */}
      {/* =================================================================== */}
      <div className="bg-slate-50/90 rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#002B49] text-amber-400 flex items-center justify-center font-bold">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider">
                Foro Académico & Preguntas al Docente
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Docente Titular: <strong className="text-slate-800">{teacherName}</strong>
              </p>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] bg-blue-50 text-blue-700 font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Soporta Capturas (Ctrl+V)</span>
          </span>
        </div>

        <form onSubmit={handleCreatePost} className="space-y-3">
          <div className="relative">
            <textarea
              rows={3}
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              onPaste={(e) => handlePasteImage(e, 'post')}
              placeholder="Escribe tu duda sobre gramática, fonética o ejercicios. Puedes pegar capturas directamente con Ctrl+V..."
              className="w-full p-3.5 sm:p-4 bg-white border border-slate-200 focus:border-[#002B49] focus:ring-2 focus:ring-[#002B49]/20 rounded-2xl text-xs sm:text-sm text-slate-800 font-medium outline-none transition-all shadow-2xs resize-none"
            />
          </div>

          {/* Previsualización de Imagen Adjunta */}
          {newPostImage && (
            <div className="relative inline-block border-2 border-[#002B49] rounded-2xl overflow-hidden shadow-md group animate-fadeIn bg-slate-900">
              <img 
                src={newPostImage} 
                alt="Captura adjunta" 
                className="max-h-48 sm:max-h-56 max-w-full object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setNewPostImage(null)
                  if (postFileInputRef.current) postFileInputRef.current.value = ''
                }}
                className="absolute top-2 right-2 bg-rose-600 hover:bg-rose-700 text-white p-1.5 rounded-full shadow-lg transition-transform hover:scale-110"
                title="Eliminar imagen"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Barra de Acciones: Adjuntar Archivo y Publicar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
            <div className="flex items-center gap-2">
              <input
                ref={postFileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handlePostFileSelected}
                className="hidden"
              />
              
              <button
                type="button"
                onClick={() => postFileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors shadow-2xs active:scale-95"
              >
                <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                <span>Adjuntar Captura / Imagen</span>
              </button>
              
              <span className="text-[10px] text-slate-400 font-medium hidden md:inline">
                PNG, JPG o pega una captura
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmittingPost || !newPostContent.trim()}
              className="bg-[#002B49] hover:bg-[#001f35] active:scale-95 disabled:opacity-50 text-white font-black px-6 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm"
            >
              {isSubmittingPost ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Publicando...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                  <span>Publicar Pregunta</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* =================================================================== */}
      {/* 2. LISTADO DE PREGUNTAS Y RESPUESTAS EN HILO                        */}
      {/* =================================================================== */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs font-medium space-y-2">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#002B49]" />
            <p>Cargando discusiones académicas...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs font-medium">
            <MessageSquare className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p>Aún no hay preguntas en este nivel. ¡Sé el primero en consultar!</p>
          </div>
        ) : (
          posts.map((post) => {
            const isReplyingThis = replyingToPostId === post.id
            const isTeacherPost = post.authorRole === 'teacher'

            return (
              <div 
                key={post.id} 
                className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/90 space-y-4 hover:border-slate-300 transition-all"
              >
                {/* Cabecera del Post */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 shadow-2xs border ${
                      isTeacherPost 
                        ? 'bg-[#002B49] text-amber-400 border-amber-400' 
                        : 'bg-slate-100 text-slate-800 border-slate-300'
                    }`}>
                      {post.authorAvatar?.startsWith('http') ? (
                        <img src={post.authorAvatar} alt={post.authorName} className="w-full h-full object-cover rounded-2xl" />
                      ) : (
                        <span>{post.authorAvatar || 'ST'}</span>
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <strong className="text-xs sm:text-sm font-extrabold text-slate-900">
                          {post.authorName}
                        </strong>
                        
                        {isTeacherPost ? (
                          <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-2 py-0.2 rounded-md">
                            👨‍🏫 Docente Titular
                          </span>
                        ) : (
                          <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.2 rounded-md">
                            🎓 Estudiante
                          </span>
                        )}

                        <span className="text-[10px] text-slate-400 font-medium">
                          {post.createdAt}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1.5 leading-relaxed whitespace-pre-wrap">
                        {post.content}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Imagen del Post con Lightbox */}
                {post.imageUrl && (
                  <div className="pl-13">
                    <div 
                      onClick={() => setLightboxImage({ url: post.imageUrl!, title: `Captura de ${post.authorName}` })}
                      className="relative inline-block cursor-pointer group rounded-2xl overflow-hidden border border-slate-200 shadow-sm max-w-sm sm:max-w-md"
                    >
                      <img 
                        src={post.imageUrl} 
                        alt="Adjunto del foro" 
                        className="max-h-60 sm:max-h-72 w-auto object-cover transition-transform duration-300 group-hover:scale-102"
                      />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs gap-1.5 backdrop-blur-2xs">
                        <Maximize2 className="w-4 h-4" />
                        <span>Ver en tamaño completo</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Botón para Abrir Caja de Respuesta */}
                <div className="pl-13 flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (isReplyingThis) {
                        setReplyingToPostId(null)
                      } else {
                        setReplyingToPostId(post.id)
                        setReplyContent('')
                        setReplyImage(null)
                      }
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      isReplyingThis 
                        ? 'bg-slate-200 text-slate-800' 
                        : 'bg-slate-50 hover:bg-slate-100 text-[#002B49] border border-slate-200'
                    }`}
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span>{isReplyingThis ? 'Cancelar Respuesta' : 'Responder'}</span>
                  </button>

                  <span className="text-[11px] text-slate-400 font-medium">
                    {post.replies?.length || 0} {post.replies?.length === 1 ? 'respuesta' : 'respuestas'}
                  </span>
                </div>

                {/* ========================================================= */}
                {/* 3. RESPUESTAS ANIDADAS EN HILO                            */}
                {/* ========================================================= */}
                {post.replies && post.replies.length > 0 && (
                  <div className="ml-4 sm:ml-10 pl-3 sm:pl-4 border-l-2 border-slate-200 space-y-3 pt-2">
                    {post.replies.map((reply) => {
                      const isTeacherReply = reply.authorRole === 'teacher'

                      return (
                        <div 
                          key={reply.id} 
                          className={`p-3.5 sm:p-4 rounded-2xl space-y-2 border transition-all ${
                            isTeacherReply 
                              ? 'bg-amber-50/70 border-amber-300 shadow-2xs' 
                              : 'bg-slate-50/80 border-slate-200/80'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                              isTeacherReply 
                                ? 'bg-[#002B49] text-amber-400 border border-amber-400' 
                                : 'bg-white text-slate-800 border border-slate-200'
                            }`}>
                              {reply.authorAvatar?.startsWith('http') ? (
                                <img src={reply.authorAvatar} alt={reply.authorName} className="w-full h-full object-cover rounded-xl" />
                              ) : (
                                <span>{reply.authorAvatar || 'ST'}</span>
                              )}
                            </div>

                            <div className="flex-1 overflow-hidden">
                              <div className="flex flex-wrap items-center gap-2">
                                <strong className={`text-xs font-extrabold ${isTeacherReply ? 'text-amber-950' : 'text-slate-900'}`}>
                                  {reply.authorName}
                                </strong>

                                {isTeacherReply ? (
                                  <span className="bg-amber-200 text-amber-950 text-[10px] font-black px-2 py-0.2 rounded-md">
                                    👨‍🏫 Docente Titular
                                  </span>
                                ) : (
                                  <span className="bg-white text-slate-600 text-[10px] font-bold px-2 py-0.2 rounded-md border border-slate-200">
                                    🎓 Compañero(a)
                                  </span>
                                )}

                                <span className="text-[10px] text-slate-400">
                                  {reply.createdAt}
                                </span>
                              </div>

                              <p className="text-xs text-slate-800 font-medium mt-1 leading-relaxed whitespace-pre-wrap">
                                {reply.content}
                              </p>

                              {/* Imagen en Respuesta */}
                              {reply.imageUrl && (
                                <div className="pt-2">
                                  <div 
                                    onClick={() => setLightboxImage({ url: reply.imageUrl!, title: `Respuesta de ${reply.authorName}` })}
                                    className="relative inline-block cursor-pointer group rounded-xl overflow-hidden border border-slate-200 shadow-2xs max-w-xs sm:max-w-sm"
                                  >
                                    <img 
                                      src={reply.imageUrl} 
                                      alt="Adjunto en respuesta" 
                                      className="max-h-48 w-auto object-cover transition-transform group-hover:scale-102"
                                    />
                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                                      <Maximize2 className="w-3.5 h-3.5" />
                                      <span>Ver</span>
                                    </div>
                                  </div>
                                </div>
                              )}

                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* ========================================================= */}
                {/* 4. FORMULARIO DE RESPUESTA RÁPIDA DESPLEGABLE             */}
                {/* ========================================================= */}
                {isReplyingThis && (
                  <form 
                    onSubmit={(e) => handleCreateReply(post.id, e)} 
                    className="ml-4 sm:ml-10 pl-3 sm:pl-4 border-l-2 border-[#002B49] bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 animate-fadeIn"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>Respondiendo a {post.authorName}:</span>
                      <button 
                        type="button" 
                        onClick={() => setReplyingToPostId(null)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <textarea
                      rows={2}
                      required
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      onPaste={(e) => handlePasteImage(e, 'reply')}
                      placeholder="Escribe tu respuesta o aclaración... (Puedes pegar una imagen con Ctrl+V)"
                      className="w-full p-3 bg-white border border-slate-300 focus:border-[#002B49] rounded-xl text-xs text-slate-800 font-medium outline-none shadow-2xs resize-none"
                    />

                    {/* Previsualización imagen de respuesta */}
                    {replyImage && (
                      <div className="relative inline-block border border-slate-300 rounded-xl overflow-hidden shadow-sm bg-slate-900">
                        <img src={replyImage} alt="Captura respuesta" className="max-h-36 max-w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setReplyImage(null)
                            if (replyFileInputRef.current) replyFileInputRef.current.value = ''
                          }}
                          className="absolute top-1.5 right-1.5 bg-rose-600 text-white p-1 rounded-full shadow-md"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <input
                          ref={replyFileInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          onChange={handleReplyFileSelected}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => replyFileInputRef.current?.click()}
                          className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                        >
                          <Paperclip className="w-3 h-3 text-slate-500" />
                          <span>Adjuntar</span>
                        </button>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingReply || !replyContent.trim()}
                        className="bg-[#002B49] hover:bg-[#001f35] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                      >
                        {isSubmittingReply ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                            <span>Enviando...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5 text-amber-400" />
                            <span>Enviar Respuesta</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}

              </div>
            )
          })
        )}
      </div>

      {/* =================================================================== */}
      {/* 5. MODAL LIGHTBOX PARA VISUALIZACIÓN DE CAPTURAS EN TAMAÑO COMPLETO */}
      {/* =================================================================== */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={() => setLightboxImage(null)}
        >
          <div 
            className="relative max-w-4xl w-full max-h-[90vh] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Barra superior de Lightbox */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-white">
              <span className="text-xs sm:text-sm font-bold truncate text-slate-200">
                {lightboxImage.title}
              </span>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Contenedor de la Imagen */}
            <div className="flex-1 overflow-auto p-2 sm:p-4 flex items-center justify-center bg-black/40">
              <img 
                src={lightboxImage.url} 
                alt="Vista ampliada" 
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
