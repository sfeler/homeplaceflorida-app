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

// Legacy export for backward compatibility
export const SendEmailViaWeb3Forms = SubmitToHubSpot;

