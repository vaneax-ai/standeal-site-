import React, { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const StandealHomePage = () => {
  const [companyInfo, setCompanyInfo] = useState(null);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    client_name: '',
    email: '',
    phone: '',
    pickup_location: '',
    delivery_location: '',
    cargo_type: '',
    cargo_weight: '',
    cargo_dimensions: '',
    transport_type: '',
    urgency: '',
    additional_info: ''
  });
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  const fetchCompanyInfo = async () => {
    try {
      const response = await axios.get(`${API}/company-info`);
      setCompanyInfo(response.data);
    } catch (error) {
      console.error("Error fetching company info:", error);
    }
  };

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const quoteData = {
        ...quoteForm,
        cargo_weight: quoteForm.cargo_weight ? parseFloat(quoteForm.cargo_weight) : null
      };

      await axios.post(`${API}/transport-quote`, quoteData);
      
      toast({
        title: "Cererea a fost trimisă cu succes!",
        description: "Vă vom contacta în maxim 2 ore cu o cotație detaliată.",
        variant: "default",
      });

      // Reset form
      setQuoteForm({
        client_name: '',
        email: '',
        phone: '',
        pickup_location: '',
        delivery_location: '',
        cargo_type: '',
        cargo_weight: '',
        cargo_dimensions: '',
        transport_type: '',
        urgency: '',
        additional_info: ''
      });
      setShowQuoteForm(false);

    } catch (error) {
      toast({
        title: "Eroare la trimiterea cererii",
        description: "Vă rugăm să încercați din nou sau să ne contactați direct.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post(`${API}/contact`, contactForm);
      
      toast({
        title: "Mesajul a fost trimis cu succes!",
        description: "Vă vom răspunde în cel mai scurt timp.",
        variant: "default",
      });

      // Reset form
      setContactForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setShowContactForm(false);

    } catch (error) {
      toast({
        title: "Eroare la trimiterea mesajului",
        description: "Vă rugăm să încercați din nou sau să ne contactați direct.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuoteForm = (field, value) => {
    setQuoteForm(prev => ({ ...prev, [field]: value }));
  };

  const updateContactForm = (field, value) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
  };

  if (!companyInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Toaster />
      
      {/* Header */}
      <header className="bg-white shadow-lg fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <img 
                  src="https://customer-assets.emergentagent.com/job_domain-connect-9/artifacts/lupmxd9j_Logo%20Nou%20CDR.png" 
                  alt="Standeal Logo" 
                  className="h-12 w-auto"
                />
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <button 
                className="text-gray-600 hover:text-blue-600 transition-colors"
                onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}
              >
                Servicii
              </button>
              <button 
                className="text-gray-600 hover:text-blue-600 transition-colors"
                onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}
              >
                Despre noi
              </button>
              <button 
                className="text-gray-600 hover:text-blue-600 transition-colors"
                onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
              >
                Contact
              </button>
            </nav>
            <Button 
              onClick={() => setShowQuoteForm(true)}
              className="bg-green-600 hover:bg-green-700"
              data-testid="request-quote-btn"
            >
              Solicită Cotație
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-green-600 to-green-800 text-white" style={{
        backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.8), rgba(21, 128, 61, 0.8)), url('https://images.unsplash.com/photo-1656426650699-a76ffe479608?auto=format&fit=crop&w=2000&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <img 
              src="https://customer-assets.emergentagent.com/job_domain-connect-9/artifacts/lupmxd9j_Logo%20Nou%20CDR.png" 
              alt="Standeal Logo" 
              className="h-20 md:h-24 w-auto mr-6 filter brightness-0 invert"
            />
            <h1 className="text-5xl md:text-6xl font-bold" data-testid="hero-title">
              Standeal
            </h1>
          </div>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto" data-testid="hero-slogan">
            {companyInfo.slogan}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => setShowQuoteForm(true)}
              className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-4"
              data-testid="hero-quote-btn"
            >
              Solicită Cotație Gratuită
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}
              className="border-white text-white hover:bg-white hover:text-green-600 text-lg px-8 py-4"
              data-testid="hero-services-btn"
            >
              Vezi Serviciile
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" data-testid="services-title">Serviciile Noastre</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Oferim soluții complete de transport și logistică pentru afacerea dumneavoastră
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {companyInfo.services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`service-card-${index}`}>
                <CardHeader>
                  <CardTitle className="text-xl text-green-600">{service}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {service.includes('persoane') && "Transport confortabil pentru persoane cu microbuze Mercedes Sprinter moderne."}
                    {service.includes('marfă') && "Transport eficient de marfă cu microbuze Sprinter dotate complet."}
                    {service.includes('rapid') && "Servicii de transport rapid național și internațional cu monitorizare GPS."}
                    {service.includes('evenimente') && "Transport specializat pentru evenimente, conferințe și deplasări de grup."}
                    {service.includes('grupuri') && "Transport organizat pentru grupuri mari și delegații oficiale."}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1688619103602-35c5b27a6619?auto=format&fit=crop&w=800&q=80" 
                alt="Transport profesional cu microbuze Sprinter" 
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">De ce să alegeți Standeal?</h3>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <Badge className="bg-green-500 mr-3">✓</Badge>
                  <span>Experiență de peste 10 ani în domeniul transporturilor</span>
                </li>
                <li className="flex items-center">
                  <Badge className="bg-green-500 mr-3">✓</Badge>
                  <span>Flotă de microbuze Mercedes Sprinter moderne</span>
                </li>
                <li className="flex items-center">
                  <Badge className="bg-green-500 mr-3">✓</Badge>
                  <span>Asigurare completă pentru toate transporturile</span>
                </li>
                <li className="flex items-center">
                  <Badge className="bg-green-500 mr-3">✓</Badge>
                  <span>Monitorizare GPS în timp real</span>
                </li>
                <li className="flex items-center">
                  <Badge className="bg-green-500 mr-3">✓</Badge>
                  <span>Suport clienți 24/7</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6" data-testid="about-title">Despre Standeal</h2>
              <p className="text-lg text-gray-600 mb-6">
                {companyInfo.description}
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Cu o experiență îndelungată în domeniul transporturilor cu microbuze Mercedes Sprinter, ne mândrim cu servicii de calitate superioară 
                și cu o echipă dedicată care înțelege importanța încrederii în relația cu clienții noștri.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-2xl font-bold text-green-600 mb-2">500+</h4>
                  <p className="text-gray-600">Clienți mulțumiți</p>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-green-600 mb-2">10+</h4>
                  <p className="text-gray-600">Ani de experiență</p>
                </div>
              </div>
            </div>
            <div>
              <img 
                src="https://images.pexels.com/photos/19871522/pexels-photo-19871522.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Flota Standeal - Microbuze Sprinter moderne" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" data-testid="contact-title">Contactează-ne</h2>
            <p className="text-xl text-gray-600">
              Suntem aici să vă ajutăm cu toate nevoile de transport
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Informații de Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">📧 Email</h4>
                    <p className="text-gray-600" data-testid="contact-email">{companyInfo.email}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">📱 Telefon</h4>
                    <p className="text-gray-600" data-testid="contact-phone">{companyInfo.phone}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">📍 Adresa</h4>
                    <p className="text-gray-600" data-testid="contact-address">{companyInfo.address}</p>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-8">
                <img 
                  src="https://images.unsplash.com/photo-1656426650699-a76ffe479608?auto=format&fit=crop&w=800&q=80" 
                  alt="Mercedes Sprinter ultimul model - Servicii transport" 
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Trimite-ne un mesaj</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contact-name">Nume</Label>
                        <Input
                          id="contact-name"
                          data-testid="contact-form-name"
                          value={contactForm.name}
                          onChange={(e) => updateContactForm('name', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact-phone">Telefon</Label>
                        <Input
                          id="contact-phone"
                          data-testid="contact-form-phone"
                          value={contactForm.phone}
                          onChange={(e) => updateContactForm('phone', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="contact-email">Email</Label>
                      <Input
                        id="contact-email"
                        type="email"
                        data-testid="contact-form-email"
                        value={contactForm.email}
                        onChange={(e) => updateContactForm('email', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-subject">Subiect</Label>
                      <Input
                        id="contact-subject"
                        data-testid="contact-form-subject"
                        value={contactForm.subject}
                        onChange={(e) => updateContactForm('subject', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-message">Mesaj</Label>
                      <Textarea
                        id="contact-message"
                        data-testid="contact-form-message"
                        rows={4}
                        value={contactForm.message}
                        onChange={(e) => updateContactForm('message', e.target.value)}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isLoading}
                      data-testid="contact-form-submit"
                    >
                      {isLoading ? 'Se trimite...' : 'Trimite Mesajul'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Form Modal */}
      {showQuoteForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold" data-testid="quote-form-title">Solicită Cotație Transport</h3>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowQuoteForm(false)}
                  data-testid="quote-form-close"
                >
                  ✕
                </Button>
              </div>

              <form onSubmit={handleQuoteSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="client_name">Nume complet *</Label>
                    <Input
                      id="client_name"
                      data-testid="quote-form-name"
                      value={quoteForm.client_name}
                      onChange={(e) => updateQuoteForm('client_name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      data-testid="quote-form-email"
                      value={quoteForm.email}
                      onChange={(e) => updateQuoteForm('email', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Telefon *</Label>
                  <Input
                    id="phone"
                    data-testid="quote-form-phone"
                    value={quoteForm.phone}
                    onChange={(e) => updateQuoteForm('phone', e.target.value)}
                    required
                  />
                </div>

                <Separator />

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pickup_location">Locația ridicării *</Label>
                    <Input
                      id="pickup_location"
                      data-testid="quote-form-pickup"
                      placeholder="ex: Chișinău, str. Ștefan cel Mare 1"
                      value={quoteForm.pickup_location}
                      onChange={(e) => updateQuoteForm('pickup_location', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="delivery_location">Locația livrării *</Label>
                    <Input
                      id="delivery_location"
                      data-testid="quote-form-delivery"
                      placeholder="ex: București, str. Victoriei 10"
                      value={quoteForm.delivery_location}
                      onChange={(e) => updateQuoteForm('delivery_location', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="cargo_type">Tipul mărfii *</Label>
                    <Input
                      id="cargo_type"
                      data-testid="quote-form-cargo-type"
                      placeholder="ex: mobilier, electronice"
                      value={quoteForm.cargo_type}
                      onChange={(e) => updateQuoteForm('cargo_type', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cargo_weight">Greutatea (kg)</Label>
                    <Input
                      id="cargo_weight"
                      type="number"
                      data-testid="quote-form-weight"
                      placeholder="ex: 500"
                      value={quoteForm.cargo_weight}
                      onChange={(e) => updateQuoteForm('cargo_weight', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cargo_dimensions">Dimensiuni</Label>
                    <Input
                      id="cargo_dimensions"
                      data-testid="quote-form-dimensions"
                      placeholder="ex: 2x1x1m"
                      value={quoteForm.cargo_dimensions}
                      onChange={(e) => updateQuoteForm('cargo_dimensions', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="transport_type">Tipul transportului *</Label>
                    <Select value={quoteForm.transport_type} onValueChange={(value) => updateQuoteForm('transport_type', value)}>
                      <SelectTrigger data-testid="quote-form-transport-type">
                        <SelectValue placeholder="Selectează tipul" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="national">Transport național</SelectItem>
                        <SelectItem value="international">Transport internațional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="urgency">Urgența *</Label>
                    <Select value={quoteForm.urgency} onValueChange={(value) => updateQuoteForm('urgency', value)}>
                      <SelectTrigger data-testid="quote-form-urgency">
                        <SelectValue placeholder="Selectează urgența" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal (3-5 zile)</SelectItem>
                        <SelectItem value="urgent">Urgent (1-2 zile)</SelectItem>
                        <SelectItem value="express">Express (24h)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="additional_info">Informații adiționale</Label>
                  <Textarea
                    id="additional_info"
                    data-testid="quote-form-additional-info"
                    rows={3}
                    placeholder="Alte detalii importante pentru transport..."
                    value={quoteForm.additional_info}
                    onChange={(e) => updateQuoteForm('additional_info', e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowQuoteForm(false)}
                    data-testid="quote-form-cancel"
                  >
                    Anulează
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    data-testid="quote-form-submit"
                  >
                    {isLoading ? 'Se trimite...' : 'Solicită Cotația'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img 
                  src="https://customer-assets.emergentagent.com/job_domain-connect-9/artifacts/lupmxd9j_Logo%20Nou%20CDR.png" 
                  alt="Standeal Logo" 
                  className="h-8 w-auto mr-3 filter brightness-0 invert"
                />
                <h3 className="text-xl font-bold text-green-400">Standeal</h3>
              </div>
              <p className="text-gray-300 mb-4">{companyInfo.slogan}</p>
              <p className="text-gray-400">© 2024 Standeal.md. Toate drepturile rezervate.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Servicii</h4>
              <ul className="space-y-2 text-gray-300">
                {companyInfo.services.map((service, index) => (
                  <li key={index}>{service}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-300">
                <p>📧 {companyInfo.email}</p>
                <p>📱 {companyInfo.phone}</p>
                <p>📍 {companyInfo.address}</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StandealHomePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;