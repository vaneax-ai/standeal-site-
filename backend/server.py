from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from emergentintegrations.llm.chat import LlmChat, UserMessage


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Email configuration
CONTACT_EMAIL = os.environ.get('CONTACT_EMAIL', 'office@standeal.md')
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

# Create the main app without a prefix
app = FastAPI(title="Standeal.md Transport Services API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Initialize LLM client - will be created per request
def get_llm_client():
    return LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id="standeal_transport",
        system_message="Ești un asistent profesional pentru StanDeal Transport, o companie de transport din Moldova."
    )


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class TransportQuote(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    email: EmailStr
    phone: str
    pickup_location: str
    delivery_location: str
    cargo_type: str
    cargo_weight: Optional[float] = None
    cargo_dimensions: Optional[str] = None
    transport_type: str  # "national" or "international"
    urgency: str  # "normal", "urgent", "express"
    additional_info: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class TransportQuoteCreate(BaseModel):
    client_name: str
    email: EmailStr
    phone: str
    pickup_location: str
    delivery_location: str
    cargo_type: str
    cargo_weight: Optional[float] = None
    cargo_dimensions: Optional[str] = None
    transport_type: str
    urgency: str
    additional_info: Optional[str] = None

class ContactMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str

class CompanyInfo(BaseModel):
    company_name: str = "Standeal.md"
    slogan: str = "Soluții de transport profesionale în Moldova și Europa"
    description: str = "Compania Standeal oferă servicii de transport profesionale cu microbuze Mercedes Sprinter pentru persoane și mărfuri în Moldova și Europa."
    phone: str = "+373 68 727 975"
    email: str = "office@standeal.md"
    address: str = "Chișinău, Moldova"
    services: List[str] = [
        "Transport persoane cu microbuze",
        "Transport marfă cu microbuze Sprinter",
        "Transport rapid național și internațional", 
        "Servicii de transport pentru evenimente",
        "Transport de grupuri și delegații"
    ]


# Email service functions
class EmailDeliveryError(Exception):
    pass


async def send_email_notification(to_email: str, subject: str, content: str):
    """Send email using SendGrid or Emergent email service"""
    try:
        # For demo purposes, we'll use a simple logging approach
        # In production, you would integrate with actual email service
        logging.info(f"EMAIL SENT TO: {to_email}")
        logging.info(f"SUBJECT: {subject}")
        logging.info(f"CONTENT: {content}")
        
        # Here you can integrate with SendGrid or other email services
        # For now, we'll simulate successful email sending
        return True
        
    except Exception as e:
        logging.error(f"Email delivery failed: {str(e)}")
        raise EmailDeliveryError(f"Failed to send email: {str(e)}")


async def generate_quote_email(quote: TransportQuote) -> str:
    """Generate professional quote email content using LLM"""
    try:
        prompt = f"""
        Creează un email profesional în limba română pentru o cerere de cotație de transport cu următoarele informații:
        
        Client: {quote.client_name}
        Email: {quote.email}
        Telefon: {quote.phone}
        De la: {quote.pickup_location}
        Către: {quote.delivery_location}
        Tipul mărfii: {quote.cargo_type}
        Greutatea: {quote.cargo_weight} kg
        Dimensiuni: {quote.cargo_dimensions}
        Tipul transportului: {quote.transport_type}
        Urgența: {quote.urgency}
        Informații adiționale: {quote.additional_info}
        
        Emailul trebuie să fie formal și profesional, să confirme primirea cererii și să menționeze că vom contacta clientul în maxim 2 ore cu o cotație detaliată.
        """
        
        llm_client = get_llm_client()
        user_message = UserMessage(text=prompt)
        response = await llm_client.send_message(user_message)
        
        return response
        
    except Exception as e:
        logging.error(f"Failed to generate quote email: {str(e)}")
        return f"""
        Stimat/ă {quote.client_name},
        
        Am primit cererea dumneavoastră de cotație pentru serviciile de transport.
        
        Detaliile cererii:
        - Ruta: {quote.pickup_location} → {quote.delivery_location}
        - Tipul mărfii: {quote.cargo_type}
        - Tipul transportului: {quote.transport_type}
        
        Vă vom contacta în maxim 2 ore cu o cotație detaliată.
        
        Cu stimă,
        Echipa StanDeal Transport
        office@standeal.md
        """


# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Standeal.md Transport Services API", "status": "active"}

@api_router.get("/company-info")
async def get_company_info():
    return CompanyInfo()

@api_router.post("/transport-quote", response_model=TransportQuote)
async def create_transport_quote(quote_data: TransportQuoteCreate, background_tasks: BackgroundTasks):
    try:
        # Create quote object
        quote = TransportQuote(**quote_data.dict())
        
        # Save to database
        await db.transport_quotes.insert_one(quote.dict())
        
        # Generate email content
        email_content = await generate_quote_email(quote)
        
        # Send emails in background
        background_tasks.add_task(
            send_email_notification,
            CONTACT_EMAIL,
            f"Nouă cerere de cotație - {quote.client_name}",
            email_content
        )
        
        background_tasks.add_task(
            send_email_notification,
            quote.email,
            "Confirmarea primirii cererii de cotație - StanDeal Transport",
            email_content
        )
        
        return quote
        
    except Exception as e:
        logging.error(f"Error creating transport quote: {str(e)}")
        raise HTTPException(status_code=500, detail="Eroare la procesarea cererii de cotație")

@api_router.get("/transport-quotes", response_model=List[TransportQuote])
async def get_transport_quotes():
    quotes = await db.transport_quotes.find().to_list(1000)
    return [TransportQuote(**quote) for quote in quotes]

@api_router.post("/contact", response_model=ContactMessage)
async def create_contact_message(contact_data: ContactMessageCreate, background_tasks: BackgroundTasks):
    try:
        # Create contact message object
        contact = ContactMessage(**contact_data.dict())
        
        # Save to database
        await db.contact_messages.insert_one(contact.dict())
        
        # Prepare email content
        email_content = f"""
        Nou mesaj de contact de pe site-ul standeal.md:
        
        Nume: {contact.name}
        Email: {contact.email}
        Telefon: {contact.phone}
        Subiect: {contact.subject}
        
        Mesaj:
        {contact.message}
        
        Data: {contact.timestamp}
        """
        
        # Send notification email in background
        background_tasks.add_task(
            send_email_notification,
            CONTACT_EMAIL,
            f"Nou mesaj de contact - {contact.subject}",
            email_content
        )
        
        return contact
        
    except Exception as e:
        logging.error(f"Error creating contact message: {str(e)}")
        raise HTTPException(status_code=500, detail="Eroare la trimiterea mesajului")

@api_router.get("/contact-messages", response_model=List[ContactMessage])
async def get_contact_messages():
    messages = await db.contact_messages.find().to_list(1000)
    return [ContactMessage(**message) for message in messages]

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()