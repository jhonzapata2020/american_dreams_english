import { Metadata } from 'next'
import { IsometricNotFound } from '../components/not-found/IsometricNotFound'

export const metadata: Metadata = {
  title: '404 - Página no encontrada | American Dreams English',
  description: 'La página solicitada no está disponible o la URL contiene un error. Explora nuestros cursos o accede al campus virtual.',
}

export default function NotFound() {
  return <IsometricNotFound />
}
