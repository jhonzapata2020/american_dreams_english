import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, email, documentNumber, programTitle } = body

    const numericAmount = Number(amount)
    if (!numericAmount || isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json(
        { error: 'El monto a liquidar debe ser un número positivo válido.' },
        { status: 400 }
      )
    }

    // 1. Generar Referencia Única de Transacción
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase()
    const reference = `ADE-${Date.now()}-${randomSuffix}`

    // 2. Calcular Monto en Centavos Estricto (Entero sin decimales)
    const amountInCents = Math.round(Number(amount) * 100)

    // 3. Obtener y Validar Secreto de Integridad de Wompi
    const integritySecret = process.env.WOMPI_INTEGRITY_SECRET?.trim()
    if (!integritySecret) {
      console.error('[Wompi Signature] Error: WOMPI_INTEGRITY_SECRET no está configurado en .env.local')
      return NextResponse.json(
        { error: 'El secreto de integridad de Wompi (WOMPI_INTEGRITY_SECRET) no está configurado en las variables de entorno del servidor.' },
        { status: 500 }
      )
    }

    // 4. Cadena a firmar en el orden estricto de Wompi: Referencia + MontoEnCentavos + Moneda(COP) + Secreto
    const rawSignatureString = `${reference}${amountInCents}COP${integritySecret}`
    console.log(`[Wompi Signature] Cadena antes de SHA256 (sin secreto completo): ${reference}${amountInCents}COP...`)

    // 5. Generación del Hash SHA-256
    const signature = crypto
      .createHash('sha256')
      .update(rawSignatureString)
      .digest('hex')

    console.log(`[Wompi Signature] Hash SHA-256 generado: ${signature}`)

    const publicKey = (process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || '').trim()

    return NextResponse.json({
      success: true,
      reference,
      amountInCents,
      currency: 'COP',
      signature,
      publicKey,
      customerDetails: {
        email: email ? email.trim().toLowerCase() : '',
        documentNumber: documentNumber ? documentNumber.toString().trim() : '',
        programTitle: programTitle || 'Matrícula Oficial'
      }
    })
  } catch (error: any) {
    console.error('[Wompi Signature] Error al generar firma de integridad:', error)
    return NextResponse.json(
      { error: error.message || 'Error interno al generar la firma de pago de Wompi.' },
      { status: 500 }
    )
  }
}
