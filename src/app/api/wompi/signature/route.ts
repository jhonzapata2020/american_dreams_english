import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, email, documentNumber, currency = 'COP', programTitle } = body

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

    // 2. Calcular Monto en Centavos (Requerimiento Wompi: 50000 COP -> 5000000)
    const amountInCents = Math.round(numericAmount * 100)
    const activeCurrency = (currency || 'COP').toUpperCase()

    // 3. Secreto de Integridad de Wompi (Desde variables de entorno o fallback sandbox seguro)
    const integritySecret =
      process.env.WOMPI_INTEGRITY_SECRET || 'test_integrity_b8YwP2lZ0f9g8Q7w5e4r3t2y1u0i9o8p'

    // 4. Cadena de Integridad: Referencia + MontoEnCentavos + Moneda + SecretoDeIntegridad
    const rawSignatureString = `${reference}${amountInCents}${activeCurrency}${integritySecret}`

    // 5. Generación del Hash SHA-256
    const signature = crypto
      .createHash('sha256')
      .update(rawSignatureString)
      .digest('hex')

    const publicKey =
      process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || 'pub_test_Q5yDA9xoKdePzhSGeVe9HAUr1jiBmYH8'

    return NextResponse.json({
      success: true,
      reference,
      amountInCents,
      currency: activeCurrency,
      signature,
      publicKey,
      customerDetails: {
        email: email ? email.trim().toLowerCase() : '',
        documentNumber: documentNumber ? documentNumber.toString().trim() : '',
        programTitle: programTitle || 'Matrícula Oficial'
      }
    })
  } catch (error: any) {
    console.error('Error al generar firma de integridad Wompi:', error)
    return NextResponse.json(
      { error: error.message || 'Error interno al generar la firma de pago de Wompi.' },
      { status: 500 }
    )
  }
}
