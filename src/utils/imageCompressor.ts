/**
 * Utilidad de compresión y conversión de imágenes a WebP en el cliente
 * Redimensiona a un ancho máximo preservando el aspect ratio y convierte a formato image/webp
 */
export interface WebPCompressionResult {
  blob: Blob
  fileName: string
  previewUrl: string
  originalSizeKb: number
  compressedSizeKb: number
  compressionRatio: number
}

export async function compressImageToWebP(
  file: File,
  maxWidth = 1200,
  quality = 0.92
): Promise<WebPCompressionResult> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error('El archivo seleccionado no es una imagen válida.'))
    }

    const originalSizeKb = Math.round(file.size / 1024)
    const reader = new FileReader()

    reader.onload = (event) => {
      const img = new Image()

      img.onload = () => {
        let width = img.width
        let height = img.height

        // Redimensionar si supera el ancho máximo preservando aspect ratio
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          return reject(new Error('No se pudo inicializar el contexto de renderizado HTMLCanvas.'))
        }

        // Calidad de renderizado suave
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Falló la conversión al formato WebP.'))
            }

            const cleanBaseName = file.name
              .replace(/\.[^/.]+$/, '')
              .toLowerCase()
              .replace(/[^a-z0-9_-]/g, '-')
              .slice(0, 40)

            const fileName = `${cleanBaseName}-${Date.now()}.webp`
            const previewUrl = URL.createObjectURL(blob)
            const compressedSizeKb = Math.round(blob.size / 1024)
            const compressionRatio =
              originalSizeKb > 0
                ? Math.round(((originalSizeKb - compressedSizeKb) / originalSizeKb) * 100)
                : 0

            resolve({
              blob,
              fileName,
              previewUrl,
              originalSizeKb,
              compressedSizeKb,
              compressionRatio
            })
          },
          'image/webp',
          quality
        )
      }

      img.onerror = () => {
        reject(new Error('No se pudo cargar la imagen para su procesamiento.'))
      }

      img.src = event.target?.result as string
    }

    reader.onerror = () => {
      reject(new Error('Error al leer el archivo en el navegador.'))
    }

    reader.readAsDataURL(file)
  })
}
