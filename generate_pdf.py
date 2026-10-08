# -*- coding: utf-8 -*-
import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, PageBreak, HRFlowable, KeepTogether
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 750, "AMERICAN DREAM ENGLISH S.A.S. — PLAN MAESTRO DE MEJORA Y AUDITORÍA INTEGRAL")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, 742, 558, 742)
            
        # Footer (all pages)
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(54, 45, 558, 45)
        
        footer_text = "American Dream English S.A.S. & CORPLEX Solutions S.A.S. — Estándares Mundiales de Auditoría"
        page_text = f"Página {self._pageNumber} de {page_count}"
        self.drawString(54, 32, footer_text)
        self.drawRightString(558, 32, page_text)
        self.restoreState()

def build_pdf(filename="informe_plataforma_american_dream_english.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=50,
        rightMargin=50,
        topMargin=55,
        bottomMargin=55
    )

    styles = getSampleStyleSheet()
    
    # Palette
    c_primary = colors.HexColor("#0B1B3D")    # Navy
    c_secondary = colors.HexColor("#1D4ED8")  # Royal Blue
    c_accent = colors.HexColor("#D97706")     # Amber Gold
    c_dark = colors.HexColor("#0F172A")       # Slate 900
    c_body = colors.HexColor("#334155")       # Slate 700
    c_light_bg = colors.HexColor("#F8FAFC")   # Slate 50
    c_card_border = colors.HexColor("#CBD5E1")
    c_badge_bg = colors.HexColor("#EFF6FF")
    c_badge_border = colors.HexColor("#BFDBFE")
    c_highlight = colors.HexColor("#FEF3C7")

    # Typography
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=c_primary,
        spaceAfter=3
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=c_primary,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13,
        textColor=c_secondary,
        spaceBefore=6,
        spaceAfter=2,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=c_body,
        spaceAfter=4
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=c_body,
        leftIndent=10,
        firstLineIndent=-6,
        spaceAfter=2
    )

    callout_style = ParagraphStyle(
        'Callout_Text',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8,
        leading=11,
        textColor=c_dark
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=9.5,
        textColor=c_body
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.white
    )

    story = []

    # HEADER & LOGO
    logo_path = os.path.abspath("src/assets/logo-american-dream.png")
    header_table_data = []
    if os.path.exists(logo_path):
        img = Image(logo_path, width=55, height=55)
        img.hAlign = 'LEFT'
        title_para = Paragraph("<b>AMERICAN DREAM ENGLISH S.A.S.</b><br/><font size=8.5 color='#1D4ED8'><b>PLAN MAESTRO DE MEJORA, ESTÁNDARES MUNDIALES Y AUDITORÍA INTEGRAL</b></font>", title_style)
        header_table_data.append([img, title_para])
    else:
        title_para = Paragraph("<b>AMERICAN DREAM ENGLISH S.A.S.</b><br/><font size=8.5 color='#1D4ED8'><b>PLAN MAESTRO DE MEJORA, ESTÁNDARES MUNDIALES Y AUDITORÍA INTEGRAL</b></font>", title_style)
        header_table_data.append(["", title_para])

    header_table = Table(header_table_data, colWidths=[65, 447])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 4))

    meta_html = """
    <b>Propósito:</b> Marco Estratégico de Calidad Mundial, Blindaje de Auditorías (Fiscal, Académica, Seguridad y UX) y Plan de Crecimiento<br/>
    <b>Entidades:</b> American Dream English S.A.S. & CORPLEX Solutions S.A.S. | <b>Sede:</b> Turbo, Antioquia | <b>Vigencia:</b> 2026 - 2028<br/>
    <b>Estándares de Referencia:</b> ISO 21001 (Educación), MCER (Idiomas), PCI-DSS / SHA-256 (Pagos), Ley 1581 / Habeas Data, WCAG 2.1 AA (Accesibilidad)
    """
    meta_table = Table([[Paragraph(meta_html, ParagraphStyle('Meta', parent=styles['Normal'], fontName='Helvetica', fontSize=7.5, leading=10, textColor=c_primary))]], colWidths=[512])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), c_badge_bg),
        ('BOX', (0, 0), (-1, -1), 0.8, c_badge_border),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 6))

    # SECCIÓN 1: VISIÓN DE CALIDAD MUNDIAL
    story.append(Paragraph("1. Visión y Compromiso de Calidad Mundial (Audit-Ready)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_secondary, spaceAfter=4, spaceBefore=1))
    p1 = ("Para posicionar a <b>American Dream English</b> como una institución EdTech referente a nivel regional e internacional, "
          "cada componente de la plataforma debe superar con éxito auditorías de cuatro tipos: <b>(1) Fiscal/Tributaria</b> (DIAN y cooperantes internacionales), "
          "<b>(2) Académica/Pedagógica</b> (Ministerio de Educación y Marco Común Europeo MCER), <b>(3) Seguridad y Datos</b> (PCI-DSS, ISO 27001, Habeas Data) "
          "y <b>(4) Experiencia y Accesibilidad</b> (WCAG 2.1 AA). A continuación se detallan las oportunidades de mejora y especificaciones técnicas para cada dimensión.")
    story.append(Paragraph(p1, body_style))

    # SECCIÓN 2: AUDITORÍA DE DONACIONES Y SUBVENCIONES
    story.append(Paragraph("2. Oportunidades de Mejora: Módulo de Donaciones y Subvenciones (Filantropía)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_secondary, spaceAfter=4, spaceBefore=1))
    
    don_table_data = [
        [Paragraph("<b>Requisito de Auditoría</b>", table_header_style), Paragraph("<b>Brecha / Oportunidad Identificada</b>", table_header_style), Paragraph("<b>Solución de Clase Mundial a Implementar</b>", table_header_style)],
        [
            Paragraph("<b>Certificación Tributaria DIAN<br/>(Art. 257 E.T.)</b>", table_cell_style),
            Paragraph("No se emite automáticamente certificado fiscal con validez tributaria para donantes.", table_cell_style),
            Paragraph("Módulo generador de certificados PDF con firma digital criptográfica, código QR de verificación hash en línea y reporte anual DIAN.", table_cell_style)
        ],
        [
            Paragraph("<b>Recaudación Recurrente<br/>(Sostenibilidad)</b>", table_cell_style),
            Paragraph("Solo existen pagos únicos por pasarela, lo que genera incertidumbre en el patrocinio de becas.", table_cell_style),
            Paragraph("Suscripciones de débito automático mensual (Tokenización Wompi/Stripe) con cobro programado y notificación al padrino.", table_cell_style)
        ],
        [
            Paragraph("<b>Transparencia y Trazabilidad<br/>(Donor Portal)</b>", table_cell_style),
            Paragraph("El donante no tiene panel privado para hacer seguimiento continuo a su estudiante.", table_cell_style),
            Paragraph("Portal del Padrino (<code>/dashboard/donor</code>) con registro de horas asistidas en Teams (4x/semana), notas y testimonios en video.", table_cell_style)
        ],
        [
            Paragraph("<b>Validación de Vulnerabilidad<br/>(Auditoría Social)</b>", table_cell_style),
            Paragraph("La asignación de becas requiere validación documental formal y auditable.", table_cell_style),
            Paragraph("Workflow de postulación digital con carga y validación de certificados SISBÉN A1-B4, RUV (Víctimas) y residencia en Turbo.", table_cell_style)
        ]
    ]
    t_don = Table(don_table_data, colWidths=[110, 182, 220])
    t_don.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_primary),
        ('GRID', (0, 0), (-1, -1), 0.5, c_card_border),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, c_light_bg]),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(t_don)
    story.append(Spacer(1, 6))

    # SECCIÓN 3: AUDITORÍA DE CAMPUS VIRTUAL Y EXPERIENCIA DE USUARIO (UX)
    story.append(Paragraph("3. Oportunidades de Mejora: Campus Virtual y Experiencia de Usuario (LMS 2.0)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_secondary, spaceAfter=4, spaceBefore=1))

    lms_table_data = [
        [Paragraph("<b>Dimensión Pedagógica / UX</b>", table_header_style), Paragraph("<b>Estado Actual</b>", table_header_style), Paragraph("<b>Estándar Mundial a Implementar</b>", table_header_style)],
        [
            Paragraph("<b>Clases Sincrónicas en Vivo<br/>(4 Días / Semana)</b>", table_cell_style),
            Paragraph("Enlace directo a reunión de Teams en bloque superior del aula.", table_cell_style),
            Paragraph("Integración profunda: control biométrico de asistencia por log de conexión, agenda con Google/Outlook y alertas de WhatsApp 15 min antes.", table_cell_style)
        ],
        [
            Paragraph("<b>Videoteca On-Demand<br/>(Clases Grabadas)</b>", table_cell_style),
            Paragraph("No existe módulo de consulta diferida para alumnos ausentes.", table_cell_style),
            Paragraph("Repositorio de grabaciones organizadas por nivel/tema con streaming adaptativo (HLS) y marcadores de contenido pedagógico.", table_cell_style)
        ],
        [
            Paragraph("<b>Guías Didácticas e Interactividad</b>", table_cell_style),
            Paragraph("Descarga estática de guías PDF y pistas de audio MP3.", table_cell_style),
            Paragraph("Actividades interactivas en navegador (quizzes autocalificables, flashcards, ejercicios de listening sincronizados) complementarias al PDF.", table_cell_style)
        ],
        [
            Paragraph("<b>Gamificación y Retención Estudiantil</b>", table_cell_style),
            Paragraph("Cuadro de calificaciones básico sin métricas de constancia.", table_cell_style),
            Paragraph("Motor de gamificación: barras de progreso porcentual, insignias por racha de estudio semanal y alertas tempranas de deserción.", table_cell_style)
        ],
        [
            Paragraph("<b>Comunidad y Tutoría IA</b>", table_cell_style),
            Paragraph("Simulador de IA básico en landing institucional.", table_cell_style),
            Paragraph("Entrenador fonético de IA integrado al aula para evaluar pronunciación oral con feedback fonético inmediato (sonido Schwa / Flap T).", table_cell_style)
        ]
    ]
    t_lms = Table(lms_table_data, colWidths=[110, 182, 220])
    t_lms.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_primary),
        ('GRID', (0, 0), (-1, -1), 0.5, c_card_border),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, c_light_bg]),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(t_lms)
    story.append(Spacer(1, 6))

    # SECCIÓN 4: AUDITORÍA DE SEGURIDAD, ARQUITECTURA Y CUMPLIMIENTO
    story.append(Paragraph("4. Blindaje Técnico: Seguridad, Base de Datos y Cumplimiento Normativo", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_secondary, spaceAfter=4, spaceBefore=1))

    sec_points = [
        "<b>Políticas RLS y Aislamiento de Datos (Multi-Tenant Seguro):</b> Verificación estricta de roles ENUM (<code>admin</code>, <code>teacher</code>, <code>student</code>, <code>donor</code>) a nivel de motor PostgreSQL, impidiendo fugas de información.",
        "<b>Seguridad Criptográfica en Transacciones:</b> Firma SHA-256 computada en el backend con secretos de entorno blindados para cada solicitud de pago en Wompi Bancolombia.",
        "<b>Audit Trail Inmutable:</b> Registro de auditoría con fecha, hora y usuario para toda modificación de calificaciones académicas, aprobaciones de becas y liquidaciones CORPLEX.",
        "<b>Cumplimiento Ley 1581 (Habeas Data):</b> Consentimiento explícito de tratamiento de datos en matrícula, donaciones y postulación de becarios.",
        "<b>Respaldo y Continuidad del Servicio:</b> Base de datos con Point-in-Time Recovery (PITR) y CDN global para garantizar 99.9% de disponibilidad operativa."
    ]
    for sp in sec_points:
        story.append(Paragraph(f"• {sp}", bullet_style))

    story.append(Spacer(1, 6))

    # SECCIÓN 5: HOJA DE RUTA ESTRATÉGICA
    story.append(Paragraph("5. Cronograma y Priorización de Desarrollo (Roadmap Ejecutivo)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=c_secondary, spaceAfter=4, spaceBefore=1))

    road_data = [
        [Paragraph("<b>Fase de Desarrollo</b>", table_header_style), Paragraph("<b>Módulos y Entregables de Alto Impacto</b>", table_header_style), Paragraph("<b>Criterio de Éxito para Auditoría</b>", table_header_style)],
        [
            Paragraph("<b>Fase 1:<br/>Filantropía & DIAN</b>", table_cell_style),
            Paragraph("• Suscripción de donación mensual automática (Wompi).<br/>• Generador de Certificados Tributarios DIAN con QR.<br/>• Portal privado del Padrino con informes de notas.", table_cell_style),
            Paragraph("Cumplimiento 100% Art. 257 E.T. y trazabilidad bancaria auditable.", table_cell_style)
        ],
        [
            Paragraph("<b>Fase 2:<br/>Campus LMS 2.0</b>", table_cell_style),
            Paragraph("• Videoteca On-Demand de clases grabadas de Teams.<br/>• Quizzes interactivos autoevaluables en navegador.<br/>• Alertas de WhatsApp y recordatorio de clases 4x/semana.", table_cell_style),
            Paragraph("Incremento del 25% en retención y registro de asistencia verificable.", table_cell_style)
        ],
        [
            Paragraph("<b>Fase 3:<br/>IA & Escala Global</b>", table_cell_style),
            Paragraph("• Evaluador fonético de pronunciación con IA.<br/>• Pasarelas de pago internacionales (Stripe / PayPal).", table_cell_style),
            Paragraph("Alineación con estándares MCER C1 y captación internacional.", table_cell_style)
        ]
    ]
    t_road = Table(road_data, colWidths=[100, 242, 170])
    t_road.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_primary),
        ('GRID', (0, 0), (-1, -1), 0.5, c_card_border),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, c_light_bg]),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(t_road)
    story.append(Spacer(1, 8))

    # CONCLUSIÓN BLINDADA
    concl_html = (
        "<b>Dictamen de Auditoría y Calidad Mundial:</b> La plataforma <b>American Dream English S.A.S.</b> posee una arquitectura base "
        "altamente calificada. La ejecución de este Plan Maestro subsana las brechas en donaciones recurrentes, formalización tributaria DIAN, "
        "interactividad del campus y seguimiento sincrónico de clases por Teams, dotando a la institución de una plataforma de nivel internacional "
        "capaz de superar las más rigurosas auditorías académicas, financieras y tecnológicas."
    )
    concl_table = Table([[Paragraph(concl_html, callout_style)]], colWidths=[512])
    concl_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), c_highlight),
        ('BOX', (0, 0), (-1, -1), 0.8, c_accent),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(concl_table)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF successfully generated: {filename}")

if __name__ == "__main__":
    build_pdf()
