# Instrucțiuni pentru Editarea Site-ului StanDeal.md

## 🎯 Cum să Editez Textele din Pagina Web

### 1. **Informații de Contact (Email, Telefon, Adresă)**

Pentru a modifica informațiile de contact, editați fișierul: `/app/backend/server.py`

**Găsiți această secțiune:**
```python
class CompanyInfo(BaseModel):
    company_name: str = "StanDeal Transport"
    slogan: str = "Soluții de transport profesionale în Moldova și Europa"
    description: str = "Compania StanDeal oferă servicii de transport..."
    phone: str = "+373 68 123 456"
    email: str = "office@standeal.md"
    address: str = "Chișinău, Moldova"
```

**Modificați valorile după cum doriți:**
- `phone`: Numărul de telefon al companiei
- `email`: Adresa de email pentru contact general
- `address`: Adresa fizică a companiei
- `company_name`: Numele companiei
- `slogan`: Sloganul companiei
- `description`: Descrierea completă a companiei

### 2. **Lista de Servicii**

În același fișier, găsiți:
```python
services: List[str] = [
    "Transport marfă național",
    "Transport marfă internațional", 
    "Transport urgent",
    "Servicii logistice complete",
    "Transport de valori"
]
```

Puteți adăuga, șterge sau modifica serviciile din această listă.

### 3. **Texte din Pagina Principală**

Pentru a modifica textele din interface-ul web, editați: `/app/frontend/src/App.js`

**Exemple de texte editabile:**
- Titlul și descrierile pentru fiecare secțiune de serviciu
- Textul din secțiunea "De ce să ne alegeți?"
- Statisticile (500+ clienți, 10+ ani)

## 📧 Configurarea Adresei de Email pentru Cotații

### Adresa Actuală: `office@standeal.md`

Pentru a schimba adresa unde sosesc cererile de cotație:

1. **Editați fișierul:** `/app/backend/.env`
2. **Modificați linia:**
   ```
   CONTACT_EMAIL="office@standeal.md"
   ```
   Înlocuiți cu noua adresă, de exemplu:
   ```
   CONTACT_EMAIL="transport@standeal.md"
   ```

3. **Restartați serverul:**
   ```bash
   sudo supervisorctl restart backend
   ```

## 🖼️ Schimbarea Imaginilor și Logo-ului

### Logo-ul Companiei
**Logo-ul actual:** StanDeal cu simbol circular verde
**Locația:** `https://customer-assets.emergentagent.com/job_domain-connect-9/artifacts/lupmxd9j_Logo%20Nou%20CDR.png`

Pentru a schimba logo-ul:
1. **În fișierul:** `/app/frontend/src/App.js`
2. **Căutați** toate aparițiile de `src="https://customer-assets.emergentagent.com/job_domain-connect-9/artifacts/lupmxd9j_Logo%20Nou%20CDR.png"`
3. **Înlocuiți** cu noul URL al logo-ului

**Logo-ul apare în:**
- Header (sus în stânga)
- Hero section (pagina principală, centru)
- Footer (jos în stânga)

### Imaginile de fundal și ilustrative
Imaginile sunt găzduite pe Unsplash și se încarcă automat. Pentru a schimba imaginile:

1. **În fișierul:** `/app/frontend/src/App.js`
2. **Căutați linkurile către imagini** (încep cu `https://images.unsplash.com/`)
3. **Înlocuiți cu noile URL-uri** de imagini

**Imaginile actuale:**
- Hero section: Camion pe drum la apus
- Servicii: Camion alb și albastru
- Despre noi: Flotă de camioane
- Contact: Containere de transport

## ⚙️ Aplicarea Modificărilor

După orice modificare:

### Pentru Backend (server.py, .env):
```bash
sudo supervisorctl restart backend
```

### Pentru Frontend (App.js, App.css):
```bash
sudo supervisorctl restart frontend
```

### Pentru a verifica toate serviciile:
```bash
sudo supervisorctl status
```

## 🔧 Testarea Funcționalității

### 1. **Testarea API-ului:**
```bash
curl -X GET https://domain-connect-9.preview.emergentagent.com/api/company-info
```

### 2. **Testarea Formularului de Cotație:**
Accesați site-ul și folosiți butonul "Solicită Cotație"

### 3. **Verificarea Email-urilor:**
Verificați logurile pentru a vedea email-urile generate:
```bash
tail -f /var/log/supervisor/backend.out.log
```

## 📝 Personalizări Avansate

### 1. **Modificarea Culorilor**
- Editați `/app/frontend/src/App.css`
- Căutați clase CSS cu `blue-600`, `blue-700` etc.
- Înlocuiți cu alte culori Tailwind

### 2. **Adăugarea Unei Noi Secțiuni**
- Editați `/app/frontend/src/App.js`
- Adăugați noua secțiune între secțiunile existente
- Folosiți aceleași clase CSS pentru consistență

### 3. **Modificarea Formularului de Cotație**
- Editați câmpurile în `/app/frontend/src/App.js`
- Pentru backend, modificați modelul `TransportQuote` în `/app/backend/server.py`

## 🚨 Atenție!

1. **Întotdeauna faceți backup** înainte de modificări majore
2. **Testați modificările** înainte de a le face publice
3. **Nu modificați** structura de bază a fișierelor dacă nu știți ce faceți
4. **Respectați formatul JSON** când editați datele

## 📞 Suport

Pentru asistență suplimentară cu modificările, consultați documentația sau contactați echipa de suport tehnic.

---

## 🎨 Schema de Culori

**Culorile principale ale site-ului** sunt setate să se potrivească cu logo-ul StanDeal:
- **Verde principal**: #16a34a (green-600)
- **Verde închis**: #15803d (green-700) 
- **Verde deschis**: #22c55e (green-500)

Pentru a schimba culorile, căutați în `/app/frontend/src/App.js` și `/app/frontend/src/App.css`:
- `green-600`, `green-700`, `green-500` pentru butoane și accente
- `text-green-600` pentru texte verzi
- `bg-green-600` pentru fundal verde

**Ultima actualizare:** 29 septembrie 2024  
**Versiunea site-ului:** 2.1 - Standeal.md cu microbuze Sprinter și branding curat