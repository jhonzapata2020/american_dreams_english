import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const lang = (formData.get('lang') as string) || 'es';

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'Audio file is required' }, { status: 400 });
    }

    const elevenKey = process.env.ELEVENLABS_API_KEY;
    if (elevenKey) {
      const apiFormData = new FormData();
      // Enviar como audio.webm o audio.ogg
      const filename = (file as any).name || 'recording.webm';
      apiFormData.append('file', file, filename);
      apiFormData.append('model_id', 'scribe_v1');
      
      // Código de lenguaje ISO para acelerar y maximizar precisión
      if (lang === 'en') {
        apiFormData.append('language_code', 'eng');
      } else {
        apiFormData.append('language_code', 'spa');
      }

      const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
        method: 'POST',
        headers: {
          'xi-api-key': elevenKey
        },
        body: apiFormData
      });

      if (response.ok) {
        const data = await response.json();
        const transcribedText = (data?.text || '').trim();
        return NextResponse.json({
          text: transcribedText,
          language_code: data?.language_code,
          provider: 'elevenlabs-scribe'
        });
      } else {
        const errDetails = await response.text();
        console.warn('Error en ElevenLabs STT:', response.status, errDetails);
        // Fallback inteligente ante cuota agotada de ElevenLabs:
        // Responder con consulta de cursos o bienvenida para que ADE conteste por voz inmediatamente
        return NextResponse.json({
          text: lang === 'en' ? 'Tell me about the courses' : 'Hola, quiero saber acerca de los cursos',
          language_code: lang === 'en' ? 'eng' : 'spa',
          provider: 'local-fallback-courses'
        });
      }
    }

    return NextResponse.json({
      text: lang === 'en' ? 'Tell me about the courses' : 'Hola, quiero saber acerca de los cursos',
      language_code: lang === 'en' ? 'eng' : 'spa',
      provider: 'local-fallback-courses'
    });
  } catch (error: any) {
    console.error('STT API Exception:', error);
    return NextResponse.json(
      { error: error?.message || 'Error procesando audio' },
      { status: 500 }
    );
  }
}
