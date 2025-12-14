// Contact form integration using HubSpot Forms API

// Stub exports for backward compatibility with other components
export const InvokeLLM = () => Promise.resolve({ response: '' });
export const SendEmail = () => Promise.resolve({ success: true });
export const UploadFile = () => Promise.resolve({ file_url: '' });

/**
 * Submit form to HubSpot Forms API
 * Get your Portal ID and Form GUID from HubSpot
 * Free tier: Unlimited submissions forever!
 * 
 * Setup:
 * 1. Sign up at https://www.hubspot.com/products/get-started
 * 2. Create a form in HubSpot (Marketing > Lead Capture > Forms)
 * 3. Get your Portal ID from Settings > Account Setup > Account Defaults
 * 4. Get your Form GUID from the form settings (it's in the embed code)
 * 5. Add both to your .env file
 */
export const SubmitToHubSpot = async (formData) => {
  const HUBSPOT_PORTAL_ID = import.meta.env.VITE_HUBSPOT_PORTAL_ID;
  const HUBSPOT_FORM_GUID = import.meta.env.VITE_HUBSPOT_FORM_GUID;

  console.log('🔍 HubSpot Debug - Portal ID:', HUBSPOT_PORTAL_ID ? 'Found ✓' : 'Missing ✗');
  console.log('🔍 HubSpot Debug - Form GUID:', HUBSPOT_FORM_GUID ? 'Found ✓' : 'Missing ✗');

  if (!HUBSPOT_PORTAL_ID || !HUBSPOT_FORM_GUID) {
    console.error('HubSpot credentials not configured');
    throw new Error('HubSpot not configured. Please add VITE_HUBSPOT_PORTAL_ID and VITE_HUBSPOT_FORM_GUID to your .env file');
  }

  const hubspotUrl = `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_GUID}`;

  // Map form fields to HubSpot properties
  const fields = [
    {
      objectTypeId: "0-1", // Contact object type
      name: "firstname",
      value: formData.name.split(' ')[0] || formData.name
    },
    {
      objectTypeId: "0-1",
      name: "lastname", 
      value: formData.name.split(' ').slice(1).join(' ') || formData.name
    },
    {
      objectTypeId: "0-1",
      name: "email",
      value: formData.email
    }
  ];

  // Add phone if provided
  if (formData.phone) {
    fields.push({
      objectTypeId: "0-1",
      name: "phone",
      value: formData.phone
    });
  }

  // Add interest/inquiry type
  if (formData.interest) {
    fields.push({
      objectTypeId: "0-1",
      name: "inquiry_type",
      value: formData.interest
    });
  }

  // Add message
  if (formData.message) {
    fields.push({
      objectTypeId: "0-1",
      name: "message",
      value: formData.message
    });
  }

  // Add property ID if provided
  if (formData.property_id) {
    fields.push({
      objectTypeId: "0-1",
      name: "property_id",
      value: formData.property_id
    });
  }

  const payload = {
    fields: fields,
    context: {
      pageUri: window.location.href,
      pageName: document.title
    }
  };

  console.log('📤 Sending to HubSpot:', {
    url: hubspotUrl,
    name: formData.name,
    email: formData.email,
    interest: formData.interest
  });

  const response = await fetch(hubspotUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });

  console.log('📥 HubSpot Response Status:', response.status, response.statusText);

  const responseData = await response.json();
  console.log('📥 HubSpot Response Data:', responseData);

  if (!response.ok) {
    console.error('❌ HubSpot Error:', responseData);
    throw new Error(`HubSpot submission failed: ${responseData.message || JSON.stringify(responseData)}`);
  }

  console.log('✅ HubSpot Success! Contact created/updated in CRM');
  return responseData;
};

/**
 * Submit form to Web3Forms API
 * Free tier: 250 submissions/month
 * 
 * Setup:
 * 1. Go to https://web3forms.com/
 * 2. Enter your email address
 * 3. Get your Access Key
 * 4. Add VITE_WEB3FORMS_ACCESS_KEY to your .env file
 */
export const SubmitToWeb3Forms = async (formData) => {
  const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

  console.log('🔍 Web3Forms Debug - Access Key:', WEB3FORMS_ACCESS_KEY ? 'Found ✓' : 'Missing ✗');

  if (!WEB3FORMS_ACCESS_KEY) {
    console.error('Web3Forms access key not configured');
    throw new Error('Web3Forms not configured. Please add VITE_WEB3FORMS_ACCESS_KEY to your .env file');
  }

  // Prepare form data for web3forms
  const subject = formData.property_id 
    ? `New ${formData.interest || 'Inquiry'} - Property ID: ${formData.property_id} from ${formData.name}`
    : `New ${formData.interest || 'Inquiry'} from ${formData.name}`;
  
  // Enhance message with property context if available
  let enhancedMessage = formData.message || '';
  if (formData.property_id && !enhancedMessage.includes('Property ID')) {
    enhancedMessage = `Property ID: ${formData.property_id}\n\n${enhancedMessage}`;
  }

  const payload = {
    access_key: WEB3FORMS_ACCESS_KEY,
    subject: subject,
    from_name: formData.name,
    email: formData.email,
    phone: formData.phone || '',
    interest: formData.interest || 'General Inquiry',
    message: enhancedMessage,
    property_id: formData.property_id || '',
    page_url: window.location.href,
    page_name: document.title
  };

  console.log('📤 Sending to Web3Forms:', {
    name: formData.name,
    email: formData.email,
    interest: formData.interest,
    property_id: formData.property_id || 'N/A'
  });

  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });

  console.log('📥 Web3Forms Response Status:', response.status, response.statusText);

  const responseData = await response.json();
  console.log('📥 Web3Forms Response Data:', responseData);

  if (!response.ok || !responseData.success) {
    console.error('❌ Web3Forms Error:', responseData);
    throw new Error(`Web3Forms submission failed: ${responseData.message || JSON.stringify(responseData)}`);
  }

  console.log('✅ Web3Forms Success! Email sent');
  return responseData;
};

/**
 * Smart form submission - tries Web3Forms first, falls back to HubSpot
 */
export const SubmitForm = async (formData) => {
  const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
  const HUBSPOT_PORTAL_ID = import.meta.env.VITE_HUBSPOT_PORTAL_ID;
  const HUBSPOT_FORM_GUID = import.meta.env.VITE_HUBSPOT_FORM_GUID;

  // Try Web3Forms first if configured
  if (WEB3FORMS_ACCESS_KEY) {
    try {
      return await SubmitToWeb3Forms(formData);
    } catch (error) {
      console.warn('Web3Forms failed, trying HubSpot...', error);
      // Fall through to HubSpot if Web3Forms fails
    }
  }

  // Fall back to HubSpot if configured
  if (HUBSPOT_PORTAL_ID && HUBSPOT_FORM_GUID) {
    return await SubmitToHubSpot(formData);
  }

  // If neither is configured, throw error
  throw new Error('No form service configured. Please add VITE_WEB3FORMS_ACCESS_KEY or HubSpot credentials to your .env file');
};

// Legacy export for backward compatibility
export const SendEmailViaWeb3Forms = SubmitToWeb3Forms;

