import io
import re
from typing import List, Optional
# pyrefly: ignore [missing-import]
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore [missing-import]
from fastapi.responses import StreamingResponse
# pyrefly: ignore [missing-import]
from pydantic import BaseModel
# pyrefly: ignore [missing-import]
import pypdf
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

app = FastAPI(title="Startup Success Predictor AI API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SWOT(BaseModel):
    strengths: List[str]
    weaknesses: List[str]
    opportunities: List[str]
    threats: List[str]

class Recommendation(BaseModel):
    title: str
    detail: str
    impact: str  # High, Medium, Low

class RadarData(BaseModel):
    subject: str
    A: float  # Startup Score
    B: float  # Industry Average
    fullMark: float

class BenchmarkData(BaseModel):
    metric: str
    startup: float
    average: float
    topDecile: float

class TrendData(BaseModel):
    period: str
    probability: float
    marketTraction: float

class HeatmapCell(BaseModel):
    x: str
    y: str
    value: float  # Score or Density

class PredictionResponse(BaseModel):
    startup_name: str
    industry: str
    funding_stage: str
    success_probability: float
    status: str
    risk_score: float
    market_potential_score: float
    founder_strength_score: float
    innovation_score: float
    investment_readiness_score: float
    scalability_score: float
    competition_score: float
    swot: SWOT
    recommendations: List[Recommendation]
    radar_chart: List[RadarData]
    benchmarks: List[BenchmarkData]
    trends: List[TrendData]
    heatmap: List[HeatmapCell]
    growth_forecast: str
    funding_potential: str
    investor_readiness: str

# Helper to parse text from pitch deck PDF
def extract_pdf_text(file_bytes: bytes) -> str:
    try:
        pdf_reader = pypdf.PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        return text
    except Exception:
        return ""

# AI Scoring Heuristics Engine
def calculate_startup_scores(
    name: str,
    industry: str,
    stage: str,
    team_size: str,
    experience: str,
    description: str,
    business_model: str,
    target_market: str,
    pitch_deck_text: str = ""
) -> PredictionResponse:
    
    combined_text = (description + " " + pitch_deck_text).lower()

    # 1. Base scores based on form selections
    # Experience
    exp_bonus = 5
    if "5+" in experience:
        exp_bonus = 20
    elif "3-5" in experience:
        exp_bonus = 12
    elif "1-3" in experience:
        exp_bonus = 6

    # Team size
    team_bonus = 5
    if "16-50" in team_size:
        team_bonus = 15
    elif "6-15" in team_size:
        team_bonus = 10
    elif "50+" in team_size:
        team_bonus = 12

    # Stage modifier
    stage_bonus = 5
    if "Series B" in stage:
        stage_bonus = 25
    elif "Series A" in stage:
        stage_bonus = 18
    elif "Seed" in stage:
        stage_bonus = 10

    # Description Keyword Analysis
    ai_keywords = ["ai", "artificial intelligence", "machine learning", "deep learning", "neural network", "llm", "gpt"]
    saas_keywords = ["saas", "subscription", "cloud", "platform", "api", "infrastructure"]
    patent_keywords = ["patent", "proprietary", "algorithm", "rnd", "research", "scientific"]
    traction_keywords = ["revenue", "customer", "paying", "mrr", "arr", "growth", "active users", "traction"]
    market_keywords = ["tam", "sam", "market", "billion", "million", "cagr", "global", "expansion"]

    has_ai = any(kw in combined_text for kw in ai_keywords)
    has_saas = any(kw in combined_text for kw in saas_keywords)
    has_patent = any(kw in combined_text for kw in patent_keywords)
    has_traction = any(kw in combined_text for kw in traction_keywords)
    has_market = any(kw in combined_text for kw in market_keywords)

    # Compute Core Metrics
    # Innovation Score
    innovation = 50.0 + stage_bonus * 0.4
    if has_ai: innovation += 15
    if has_patent: innovation += 15
    if "fintech" in industry.lower() or "health" in industry.lower(): innovation += 5
    innovation = min(98.0, max(30.0, innovation))

    # Market Potential Score
    market_potential = 55.0 + (10 if has_market else 0)
    if "enterprise" in target_market.lower(): market_potential += 10
    if has_traction: market_potential += 8
    if "saas" in business_model.lower(): market_potential += 5
    # Industry growth factors
    if industry in ["AI/ML", "Healthcare", "CleanTech"]:
        market_potential += 10
    elif industry in ["E-commerce", "EdTech"]:
        market_potential += 2
    market_potential = min(96.0, max(40.0, market_potential))

    # Founder Strength Score
    founder_strength = 45.0 + exp_bonus + team_bonus * 0.5
    if has_traction: founder_strength += 5
    founder_strength = min(99.0, max(25.0, founder_strength))

    # Scalability Score
    scalability = 50.0 + team_bonus
    if has_saas or "saas" in business_model.lower(): scalability += 15
    if has_ai: scalability += 10
    if "b2c" in business_model.lower(): scalability += 5
    scalability = min(97.0, max(35.0, scalability))

    # Competition Score (Higher means startup has better moat/less threat)
    competition = 55.0 + (12 if has_patent else 0) - (8 if "e-commerce" in industry.lower() else 0)
    if "niche" in combined_text: competition += 8
    competition = min(95.0, max(20.0, competition))

    # Success Probability (Weighted Average with Jitter)
    success_prob = (
        market_potential * 0.30 +
        founder_strength * 0.25 +
        innovation * 0.20 +
        scalability * 0.15 +
        competition * 0.10
    )
    success_prob = round(min(97.5, max(15.0, success_prob)), 1)

    # Risk Score
    risk_score = round(100.0 - success_prob + (5.0 if "healthcare" in industry.lower() else 0.0), 1)
    risk_score = min(95.0, max(5.0, risk_score))

    # Investment Readiness Score
    investment_readiness = round(
        (success_prob * 0.4 + founder_strength * 0.3 + market_potential * 0.3), 1
    )

    # Categorize Status
    if success_prob >= 80.0:
        status = "VC-Grade Disruptor"
        investor_readiness = "Premium/Outstanding"
        funding_potential = "Exceptional"
        growth_forecast = "Exponential"
    elif success_prob >= 65.0:
        status = "Promising Growth"
        investor_readiness = "High"
        funding_potential = "Strong"
        growth_forecast = "Strong"
    elif success_prob >= 45.0:
        status = "Steady Venture"
        investor_readiness = "Moderate"
        funding_potential = "Moderate"
        growth_forecast = "Moderate"
    else:
        status = "High-Risk Concept"
        investor_readiness = "Low"
        funding_potential = "Early-Stage Incubation"
        growth_forecast = "Volatile"

    # SWOT Analysis Logic
    strengths = []
    weaknesses = []
    opportunities = []
    threats = []

    # Dynamic SWOT selection
    if "5+" in experience or "3-5" in experience:
        strengths.append("Highly experienced founding team with deep domain expertise.")
    else:
        weaknesses.append("Early-career/first-time founders; potential gaps in execution speed.")
        opportunities.append("Forming advisory boards or bringing in senior operational co-founders.")

    if team_bonus >= 12:
        strengths.append(f"Balanced team structure ({team_size} members) enabling parallel execution.")
    else:
        weaknesses.append("Lean team structure limits capacity to scale engineering and sales concurrently.")

    if has_patent:
        strengths.append("Intellectual property moat / patented core technology block.")
    else:
        threats.append("Lower barrier to entry for fast-following competitors mimicking core features.")

    if has_traction or "Series" in stage:
        strengths.append("Established market validation or funding traction.")
    else:
        weaknesses.append("Lack of early reference customers or quantifiable product-market validation.")

    # Industry specific SWOT
    if industry == "AI/ML":
        strengths.append("High innovation index, leverage of advanced machine learning pipelines.")
        opportunities.append("Enterprise automation demand driving massive TAM expansion.")
        threats.append("Compute cost volatility and dependency on major LLM/GPU providers.")
    elif industry == "Fintech":
        opportunities.append("Open banking APIs and digital asset rails opening new markets.")
        threats.append("Heavy regulatory compliance costs (KYC/AML) and security risks.")
    elif industry == "Healthcare":
        strengths.append("Potential to solve deep systemic bottlenecks or clinical inefficiencies.")
        opportunities.append("Integration with hospital system APIs and predictive diagnosis pipelines.")
        threats.append("Extremely long clinical trial timelines and FDA approval hurdles.")
    elif industry == "SaaS":
        strengths.append("High gross margin model with predictable recurring revenues.")
        opportunities.append("Self-serve PLG (Product Led Growth) funnel implementation.")
        threats.append("High customer acquisition costs (CAC) and customer churn risks.")
    else:
        opportunities.append("Underserved niche vertical expansion before general market rollout.")
        threats.append("Market fragmentation and lack of consumer/enterprise stickiness.")

    # Add defaults to satisfy lists
    if len(strengths) < 2: strengths.append("Modern digital architecture built for rapid cloud deployment.")
    if len(weaknesses) < 2: weaknesses.append("Undefined go-to-market playbook for scaling past early adopters.")
    if len(opportunities) < 2: opportunities.append("Strategic partnerships with platform distribution channels.")
    if len(threats) < 2: threats.append("Macroeconomic capital constraints and elongated enterprise sales cycles.")

    # Recommendations
    recommendations = []
    if "5+" not in experience:
        recommendations.append(Recommendation(
            title="Strategic Advisory Board",
            detail="Recruit 2-3 seasoned industry veterans or exit-proven founders to offset the team's early-career risk profile.",
            impact="High"
        ))
    if not has_patent:
        recommendations.append(Recommendation(
            title="Defensibility Moat",
            detail="File provisional patents on core proprietary algorithms or build proprietary data feedback loops that act as natural moats.",
            impact="High"
        ))
    if "Pre-Seed" in stage or "Bootstrapped" in stage:
        recommendations.append(Recommendation(
            title="MVP & Customer Validation",
            detail="Focus 90% of resources on launching a minimal viable product to acquire 5-10 highly active design partners/customers.",
            impact="High"
        ))
    if industry == "AI/ML":
        recommendations.append(Recommendation(
            title="Infrastructure Cost Optimization",
            detail="Optimize model inferencing via quantizations or caching to prevent skyrocketing GPU and API bills as user base grows.",
            impact="Medium"
        ))
    if industry == "Fintech" or industry == "Healthcare":
        recommendations.append(Recommendation(
            title="Regulatory Compliance Early-Start",
            detail="Partner with compliance consultants early to ensure SOC2, HIPAA, or financial audit guidelines are baked into your database schema.",
            impact="High"
        ))
    if len(recommendations) < 3:
        recommendations.append(Recommendation(
            title="Product-Led Growth (PLG)",
            detail="Implement a self-serve onboarding flow and a developer/user sandbox to drive organic viral loops.",
            impact="Medium"
        ))
    if len(recommendations) < 4:
        recommendations.append(Recommendation(
            title="Strategic Integrations",
            detail="Build native connectors for Slack, Salesforce, and Microsoft Teams to increase user retention and API stickiness.",
            impact="Medium"
        ))

    # Radar Chart Data
    radar_chart = [
        RadarData(subject="Market", A=round(market_potential, 1), B=65.0, fullMark=100.0),
        RadarData(subject="Team", A=round(founder_strength, 1), B=60.0, fullMark=100.0),
        RadarData(subject="Innovation", A=round(innovation, 1), B=55.0, fullMark=100.0),
        RadarData(subject="Funding", A=round(50.0 + stage_bonus, 1), B=50.0, fullMark=100.0),
        RadarData(subject="Competition", A=round(competition, 1), B=60.0, fullMark=100.0),
        RadarData(subject="Scalability", A=round(scalability, 1), B=62.0, fullMark=100.0),
    ]

    # Benchmarks Data
    benchmarks = [
        BenchmarkData(metric="Market Fit", startup=round(market_potential * 0.9, 1), average=58.0, topDecile=88.0),
        BenchmarkData(metric="Tech Innovation", startup=round(innovation, 1), average=52.0, topDecile=90.0),
        BenchmarkData(metric="Founder Strength", startup=round(founder_strength, 1), average=50.0, topDecile=85.0),
        BenchmarkData(metric="Capital Efficiency", startup=round(100.0 - risk_score * 0.8, 1), average=60.0, topDecile=82.0),
    ]

    # Trends Data (simulated growth projections)
    trends = [
        TrendData(period="Launch", probability=success_prob * 0.9, marketTraction=20.0),
        TrendData(period="Month 3", probability=success_prob * 0.95, marketTraction=35.0),
        TrendData(period="Month 6", probability=success_prob, marketTraction=50.0),
        TrendData(period="Month 12", probability=min(99.0, success_prob * 1.1), marketTraction=75.0),
        TrendData(period="Month 24", probability=min(99.5, success_prob * 1.25), marketTraction=95.0),
    ]

    # Heatmap Data (Opportunities vs Threat sectors)
    heatmap = [
        HeatmapCell(x="Low Risk", y="High Reward", value=market_potential * 0.9),
        HeatmapCell(x="Med Risk", y="High Reward", value=success_prob),
        HeatmapCell(x="High Risk", y="High Reward", value=innovation * 0.8),
        HeatmapCell(x="Low Risk", y="Med Reward", value=founder_strength * 0.85),
        HeatmapCell(x="Med Risk", y="Med Reward", value=scalability * 0.9),
        HeatmapCell(x="High Risk", y="Med Reward", value=risk_score),
    ]

    return PredictionResponse(
        startup_name=name,
        industry=industry,
        funding_stage=stage,
        success_probability=success_prob,
        status=status,
        risk_score=risk_score,
        market_potential_score=market_potential,
        founder_strength_score=founder_strength,
        innovation_score=innovation,
        investment_readiness_score=investment_readiness,
        scalability_score=scalability,
        competition_score=competition,
        swot=SWOT(
            strengths=strengths,
            weaknesses=weaknesses,
            opportunities=opportunities,
            threats=threats
        ),
        recommendations=recommendations,
        radar_chart=radar_chart,
        benchmarks=benchmarks,
        trends=trends,
        heatmap=heatmap,
        growth_forecast=growth_forecast,
        funding_potential=funding_potential,
        investor_readiness=investor_readiness
    )

@app.post("/api/predict", response_model=PredictionResponse)
async def predict_success(
    name: str = Form(...),
    industry: str = Form(...),
    stage: str = Form(...),
    team_size: str = Form(...),
    experience: str = Form(...),
    description: str = Form(...),
    business_model: str = Form(...),
    target_market: str = Form(...),
    website_url: Optional[str] = Form(""),
    pitch_deck: Optional[UploadFile] = File(None)
):
    try:
        pitch_deck_text = ""
        if pitch_deck:
            file_bytes = await pitch_deck.read()
            # If it's a PDF, extract text
            if pitch_deck.filename.endswith(".pdf"):
                pitch_deck_text = extract_pdf_text(file_bytes)
        
        scores = calculate_startup_scores(
            name=name,
            industry=industry,
            stage=stage,
            team_size=team_size,
            experience=experience,
            description=description,
            business_model=business_model,
            target_market=target_market,
            pitch_deck_text=pitch_deck_text
        )
        return scores
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/api/download-report")
async def download_report(
    name: str = Form(...),
    industry: str = Form(...),
    stage: str = Form(...),
    team_size: str = Form(...),
    experience: str = Form(...),
    description: str = Form(...),
    business_model: str = Form(...),
    target_market: str = Form(...),
    success_probability: float = Form(...),
    risk_score: float = Form(...),
    market_potential: float = Form(...),
    founder_strength: float = Form(...),
    innovation: float = Form(...),
    investment_readiness: float = Form(...),
    strengths_list: str = Form(...),
    weaknesses_list: str = Form(...),
    opportunities_list: str = Form(...),
    threats_list: str = Form(...),
    recommendations_list: str = Form(...)  # Format: "Title 1: Detail 1|Title 2: Detail 2"
):
    try:
        # Generate PDF
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40
        )
        
        styles = getSampleStyleSheet()
        
        # Define Custom Styles
        title_style = ParagraphStyle(
            'ReportTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#4F46E5'),
            spaceAfter=15
        )
        
        subtitle_style = ParagraphStyle(
            'ReportSubtitle',
            parent=styles['Normal'],
            fontSize=10,
            textColor=colors.HexColor('#6B7280'),
            spaceAfter=25
        )
        
        h2_style = ParagraphStyle(
            'SectionHeader',
            parent=styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor('#1F2937'),
            spaceBefore=15,
            spaceAfter=10,
            keepWithNext=True
        )

        body_style = ParagraphStyle(
            'BodyTextCustom',
            parent=styles['Normal'],
            fontSize=10.5,
            textColor=colors.HexColor('#374151'),
            spaceAfter=8,
            leading=14
        )

        label_style = ParagraphStyle(
            'LabelStyle',
            parent=styles['Normal'],
            fontSize=10,
            textColor=colors.HexColor('#4F46E5'),
            fontName='Helvetica-Bold'
        )

        bullet_style = ParagraphStyle(
            'BulletStyle',
            parent=styles['Normal'],
            fontSize=10,
            textColor=colors.HexColor('#374151'),
            leftIndent=15,
            spaceAfter=5,
            bulletIndent=5,
            leading=13
        )

        story = []

        # Header Section
        story.append(Paragraph(f"Startup Success Predictor AI - Evaluation Report", title_style))
        story.append(Paragraph(f"Startup Evaluated: <b>{name}</b> &nbsp;|&nbsp; Industry: <b>{industry}</b> &nbsp;|&nbsp; Funding Stage: <b>{stage}</b>", subtitle_style))
        
        # 1. Summary Cards Table
        summary_data = [
            [
                Paragraph("<b>Success Probability</b>", label_style),
                Paragraph("<b>Risk Index</b>", label_style),
                Paragraph("<b>Investment Readiness</b>", label_style)
            ],
            [
                Paragraph(f"<font size=16 color='#10B981'><b>{success_probability}%</b></font>", body_style),
                Paragraph(f"<font size=16 color='#EF4444'><b>{risk_score}%</b></font>", body_style),
                Paragraph(f"<font size=16 color='#4F46E5'><b>{investment_readiness}/100</b></font>", body_style)
            ],
            [
                Paragraph("<b>Founder Strength</b>", label_style),
                Paragraph("<b>Market Potential</b>", label_style),
                Paragraph("<b>Innovation Index</b>", label_style)
            ],
            [
                Paragraph(f"<font size=14><b>{founder_strength}%</b></font>", body_style),
                Paragraph(f"<font size=14><b>{market_potential}%</b></font>", body_style),
                Paragraph(f"<font size=14><b>{innovation}%</b></font>", body_style)
            ]
        ]
        
        t = Table(summary_data, colWidths=[2.3*inch, 2.3*inch, 2.3*inch])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F9FAFB')),
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E5E7EB')),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#D1D5DB')),
            ('BOTTOMPADDING', (0,0), (-1,-1), 10),
            ('TOPPADDING', (0,0), (-1,-1), 10),
        ]))
        story.append(t)
        story.append(Spacer(1, 20))

        # Description
        story.append(Paragraph("Startup Concept Overview", h2_style))
        story.append(Paragraph(description, body_style))
        story.append(Spacer(1, 15))

        # SWOT Analysis Table
        story.append(Paragraph("SWOT Analysis Matrix", h2_style))
        
        s_list = [Paragraph(f"• {x.strip()}", bullet_style) for x in strengths_list.split('|') if x.strip()]
        w_list = [Paragraph(f"• {x.strip()}", bullet_style) for x in weaknesses_list.split('|') if x.strip()]
        o_list = [Paragraph(f"• {x.strip()}", bullet_style) for x in opportunities_list.split('|') if x.strip()]
        t_list = [Paragraph(f"• {x.strip()}", bullet_style) for x in threats_list.split('|') if x.strip()]

        swot_data = [
            [
                Paragraph("<b>STRENGTHS (S)</b>", ParagraphStyle('GreenText', parent=label_style, textColor=colors.HexColor('#059669'))),
                Paragraph("<b>WEAKNESSES (W)</b>", ParagraphStyle('AmberText', parent=label_style, textColor=colors.HexColor('#D97706')))
            ],
            [
                s_list,
                w_list
            ],
            [
                Paragraph("<b>OPPORTUNITIES (O)</b>", ParagraphStyle('CyanText', parent=label_style, textColor=colors.HexColor('#0891B2'))),
                Paragraph("<b>THREATS (T)</b>", ParagraphStyle('RedText', parent=label_style, textColor=colors.HexColor('#DC2626')))
            ],
            [
                o_list,
                t_list
            ]
        ]
        
        swot_table = Table(swot_data, colWidths=[3.5*inch, 3.5*inch])
        swot_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (0,0), colors.HexColor('#ECFDF5')),
            ('BACKGROUND', (1,0), (1,0), colors.HexColor('#FFFBEB')),
            ('BACKGROUND', (0,2), (0,2), colors.HexColor('#ECFEFF')),
            ('BACKGROUND', (1,2), (1,2), colors.HexColor('#FEF2F2')),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('BOX', (0,0), (0,1), 1, colors.HexColor('#A7F3D0')),
            ('BOX', (1,0), (1,1), 1, colors.HexColor('#FDE68A')),
            ('BOX', (0,2), (0,3), 1, colors.HexColor('#A5F3FC')),
            ('BOX', (1,2), (1,3), 1, colors.HexColor('#FCA5A5')),
            ('BOTTOMPADDING', (0,0), (-1,-1), 8),
            ('TOPPADDING', (0,0), (-1,-1), 8),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ]))
        story.append(swot_table)
        story.append(Spacer(1, 20))

        # Recommendations
        story.append(Paragraph("Strategic AI Recommendations", h2_style))
        for rec in recommendations_list.split('|'):
            if ':' in rec:
                r_title, r_detail = rec.split(':', 1)
                story.append(Paragraph(f"<b>{r_title.strip()}</b>: {r_detail.strip()}", bullet_style))
        
        # Build Document
        doc.build(story)
        
        buffer.seek(0)
        return StreamingResponse(
            buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={name.replace(' ', '_')}_Success_Report.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")

if __name__ == "__main__":
    # pyrefly: ignore [missing-import]
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
