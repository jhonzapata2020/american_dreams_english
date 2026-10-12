/**
 * Algoritmo de Optimización y Conversión de Imágenes a WebP
 * 
 * - Detecta cualquier formato de imagen (JPEG, PNG, HEIC, etc.)
 * - Aplica recorte cuadrado centrado inteligente (1:1 aspect ratio)
 * - Escala a resolución óptima para avatares (máx 400x400 px)
 * - Convierte y comprime nativamente a formato WebP usando HTML5 Canvas API
 * - Reduce el peso hasta un 90-95% manteniendo máxima fidelidad visual
 */

export interface OptimizeImageOptions {
  maxDimension?: number
  quality?: number // 0.1 a 1.0 (recomendado 0.85)
}

export interface OptimizedImageResult {
  blob: Blob
  file: File
  dataUrl: string
  width: number
  height: number
  originalSizeKB: number
  optimizedSizeKB: number
  savingsPercent: number
}

export async function optimizeAndConvertToWebP(
  sourceFile: File | Blob,
  options: OptimizeImageOptions = {}
): Promise<OptimizedImageResult> {
  const { maxDimension = 400, quality = 0.85 } = options
  const originalSizeKB = Math.round((sourceFile.size / 1024) * 10) / 10

  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(sourceFile)
    const img = new Image()

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)

      try {
        const { naturalWidth, naturalHeight } = img

        // 1. Recorte cuadrado centrado inteligente (Aspect Ratio 1:1)
        const minSide = Math.min(naturalWidth, naturalHeight)
        const sx = Math.floor((naturalWidth - minSide) / 2)
        const sy = Math.floor((naturalHeight - minSide) / 2)

        // 2. Escala proporcional (máximo maxDimension px para no sobredimensionar)
        const targetSize = Math.min(minSide, maxDimension)

        // 3. Renderizado en Canvas con suavizado de alta definición
        const canvas = document.createElement('canvas')
        canvas.width = targetSize
        canvas.height = targetSize
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          reject(new Error('No se pudo obtener el contexto 2D del canvas.'))
          return
        }

        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'

        // Dibujar el recorte cuadrado centrado escalado
        ctx.drawImage(
          img,
          sx,
          sy,
          minSide,
          minSide,
          0,
          0,
          targetSize,
          targetSize
        )

        // 4. Exportar como WebP
        const dataUrl = canvas.toDataURL('image/webp', quality)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              // Fallback en caso de que toBlob falle
              const binStr = atob(dataUrl.split(',')[1])
              const len = binStr.length
              const arr = new Uint8Array(len)
              for (let i = 0; i < len; i++) {
                arr[i] = binStr.charCodeAt(i)
              }
              const fallbackBlob = new Blob([arr], { type: 'image/webp' })
              const optimizedSizeKB = Math.round((fallbackBlob.size / 1024) * 10) / 10
              const savings = Math.max(0, Math.round((1 - fallbackBlob.size / sourceFile.size) * 100))

              const file = new File([fallbackBlob], 'avatar.webp', { type: 'image/webp' })
              resolve({
                blob: fallbackBlob,
                file,
                dataUrl,
                width: targetSize,
                height: targetSize,
                originalSizeKB,
                optimizedSizeKB,
                savingsPercent: savings
              })
              return
            }

            const optimizedSizeKB = Math.round((blob.size / 1024) * 10) / 10
            const savings = Math.max(0, Math.round((1 - blob.size / sourceFile.size) * 100))
            const file = new File([blob], 'avatar.webp', { type: 'image/webp' })

            resolve({
              blob,
              file,
              dataUrl,
              width: targetSize,
              height: targetSize,
              originalSizeKB,
              optimizedSizeKB,
              savingsPercent: savings
            })
          },
          'image/webp',
          quality
        )
      } catch (err) {
        reject(err)
      }
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('No se pudo cargar la imagen para su procesamiento.'))
    }

    img.src = objectUrl
  })
}
