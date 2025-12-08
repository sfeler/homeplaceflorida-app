// Base44 integrations removed - no longer using Base44 API

// Stub exports to prevent import errors
export const Core = {};

export const InvokeLLM = () => Promise.resolve({ response: '' });

/**
 * Submit form to HubSpot
 * Requires HubSpot Portal ID and Form GUID
 * Get these from: HubSpot Settings > Integrations > Forms
 */
export const SubmitToHubSpot = async (formData) => {
  const HUBSPOT_PORTAL_ID = import.meta.env.VITE_HUBSPOT_PORTAL_ID;
  const HUBSPOT_FORM_GUID = import.meta.env.VITE_HUBSPOT_FORM_GUID;

  if (!HUBSPOT_PORTAL_ID || !HUBSPOT_FORM_GUID) {
    console.error('HubSpot credentials not configured. Please set VITE_HUBSPOT_PORTAL_ID and VITE_HUBSPOT_FORM_GUID');
    throw new Error('HubSpot not configured');
  }

  const hubspotFormUrl = `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_GUID}`;

  const payload = {
    fields: [
      {
        objectTypeId: '0-1',
        name: 'firstname',
        value: formData.name.split(' ')[0] || formData.name
      },
      {
        objectTypeId: '0-1',
        name: 'lastname',
        value: formData.name.split(' ').slice(1).join(' ') || ''
      },
      {
        objectTypeId: '0-1',
        name: 'email',
        value: formData.email
      },
      {
        objectTypeId: '0-1',
        name: 'phone',
        value: formData.phone || ''
      },
      {
        objectTypeId: '0-1',
        name: 'message',
        value: formData.message || ''
      },
      {
        objectTypeId: '0-1',
        name: 'interest_type',
        value: formData.interest || 'General Inquiry'
      }
    ],
    context: {
      pageUri: window.location.href,
      pageName: document.title
    }
  };

  const response = await fetch(hubspotFormUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HubSpot submission failed: ${error}`);
  }

  return await response.json();
};

/**
 * Send email via EmailJS (simpler alternative)
 * Requires EmailJS Service ID, Template ID, and Public Key
 * Get these from: https://www.emailjs.com/
 */
export const SendEmailViaEmailJS = async (formData) => {
  const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    console.error('EmailJS credentials not configured');
    throw new Error('EmailJS not configured');
  }

  const emailjsUrl = `https://api.emailjs.com/api/v1.0/email/send`;

  const payload = {
    service_id: EMAILJS_SERVICE_ID,
    template_id: EMAILJS_TEMPLATE_ID,
    user_id: EMAILJS_PUBLIC_KEY,
    template_params: {
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.phone || 'Not provided',
      interest: formData.interest || 'General Inquiry',
      message: formData.message,
      to_email: 'steve@homeplaceflorida.com' // Your email
    }
  };

  const response = await fetch(emailjsUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`EmailJS failed: ${error}`);
  }

  return await response.json();
};

/**
 * Send email via Web3Forms (EASIEST - no signup needed!)
 * Just get an access key from: https://web3forms.com/
 * Free tier: 250 submissions/month
 */
export const SendEmailViaWeb3Forms = async (formData) => {
  const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

  if (!WEB3FORMS_ACCESS_KEY) {
    console.error('Web3Forms access key not configured');
    throw new Error('Web3Forms not configured');
  }

  const web3formsUrl = 'https://api.web3forms.com/submit';

  const payload = {
    access_key: WEB3FORMS_ACCESS_KEY,
    name: formData.name,
    email: formData.email,
    phone: formData.phone || 'Not provided',
    subject: `New Contact: ${formData.interest}`,
    message: `
Interest: ${formData.interest}
Phone: ${formData.phone || 'Not provided'}

Message:
${formData.message}

---
From: ${formData.name} (${formData.email})
${formData.property_id ? `Property ID: ${formData.property_id}` : ''}
    `.trim()
  };

  const response = await fetch(web3formsUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Web3Forms failed: ${error}`);
  }

  return await response.json();
};

// Legacy stub - keeping for backward compatibility
export const SendEmail = () => Promise.resolve({ success: true });

export const UploadFile = () => Promise.resolve({ file_url: '' });

export const GenerateImage = () => Promise.resolve({ image_url: '' });

export const ExtractDataFromUploadedFile = () => Promise.resolve({ data: {} });

export const CreateFileSignedUrl = () => Promise.resolve({ url: '' });

export const UploadPrivateFile = () => Promise.resolve({ file_url: '' });
