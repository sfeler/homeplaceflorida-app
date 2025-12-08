// Contact form integration using Web3Forms

/**
 * Send email via Web3Forms (EASIEST - no signup needed!)
 * Just get an access key from: https://web3forms.com/
 * Free tier: 250 submissions/month
 */
export const SendEmailViaWeb3Forms = async (formData) => {
  const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

  console.log('🔍 Web3Forms Debug - Access Key:', WEB3FORMS_ACCESS_KEY ? 'Found ✓' : 'Missing ✗');

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

  console.log('📤 Sending to Web3Forms:', {
    url: web3formsUrl,
    name: payload.name,
    email: payload.email,
    subject: payload.subject
  });

  const response = await fetch(web3formsUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  console.log('📥 Web3Forms Response Status:', response.status, response.statusText);

  const responseData = await response.json();
  console.log('📥 Web3Forms Response Data:', responseData);

  if (!response.ok) {
    console.error('❌ Web3Forms Error:', responseData);
    throw new Error(`Web3Forms failed: ${JSON.stringify(responseData)}`);
  }

  console.log('✅ Web3Forms Success!');
  return responseData;
};

