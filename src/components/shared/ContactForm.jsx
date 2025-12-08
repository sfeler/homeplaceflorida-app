import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ContactSubmission } from '@/api/entities';
import { SubmitToHubSpot, SendEmailViaEmailJS, SendEmailViaWeb3Forms } from '@/api/integrations';

export default function ContactForm({ propertyId = null, defaultInterest = "General Inquiry" }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: defaultInterest,
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Try services in priority order: HubSpot > Web3Forms > EmailJS > Database
      const hubspotPortalId = import.meta.env.VITE_HUBSPOT_PORTAL_ID;
      const web3formsKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
      const emailjsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;

      if (hubspotPortalId) {
        // Submit to HubSpot (includes CRM tracking)
        await SubmitToHubSpot({
          ...formData,
          property_id: propertyId
        });
      } else if (web3formsKey) {
        // Web3Forms - easiest option!
        await SendEmailViaWeb3Forms({
          ...formData,
          property_id: propertyId
        });
      } else if (emailjsServiceId) {
        // Fallback to EmailJS
        await SendEmailViaEmailJS({
          ...formData,
          property_id: propertyId
        });
      } else {
        // Save to database as fallback
        await ContactSubmission.create({
          ...formData,
          property_id: propertyId
        });
        console.warn('No email service configured. Form data saved to database only.');
      }

      setIsSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        interest: defaultInterest,
        message: ''
      });

      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your form. Please try again or call us at (727) 492-6291.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const fillTestData = () => {
    setFormData({
      name: 'Steve',
      email: 'sfeler@gmail.com',
      phone: '(727) 492-6291',
      interest: defaultInterest,
      message: 'This is a test message from my contact form to make sure Web3Forms is working correctly!'
    });
  };

  if (isSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-semibold text-slate-900 mb-2">Message Sent!</h3>
        <p className="text-slate-600">
          Thank you for reaching out. We'll get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            required
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="John Doe"
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="john@example.com"
            className="h-12"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="(555) 123-4567"
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="interest">I'm interested in *</Label>
          <Select value={formData.interest} onValueChange={(val) => handleChange('interest', val)}>
            <SelectTrigger className="h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Buy">Buying a Property</SelectItem>
              <SelectItem value="Sell">Selling a Property</SelectItem>
              <SelectItem value="Schedule Tour">Schedule a Tour</SelectItem>
              <SelectItem value="General Inquiry">General Inquiry</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          required
          value={formData.message}
          onChange={(e) => handleChange('message', e.target.value)}
          placeholder="Tell us more about what you're looking for..."
          rows={6}
          className="resize-none"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-14 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold text-base rounded-full"
      >
        {isSubmitting ? (
          'Sending...'
        ) : (
          <>
            <Send className="mr-2 h-5 w-5" />
            Send Message
          </>
        )}
      </Button>
    </form>
  );
}