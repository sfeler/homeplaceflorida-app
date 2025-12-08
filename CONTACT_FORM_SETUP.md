# Contact Form Setup Guide

The contact form now supports two email service options:

## Option 1: HubSpot (Recommended for Real Estate)

HubSpot is the best choice because it includes:
- ✅ Free CRM (up to 1,000 contacts)
- ✅ Automatic lead tracking
- ✅ Email notifications
- ✅ Contact management
- ✅ Deal pipeline tracking

### Setup Steps:

1. **Create a HubSpot account** (free): https://www.hubspot.com/products/crm

2. **Create a form in HubSpot:**
   - Go to Marketing > Lead Capture > Forms
   - Click "Create form"
   - Add these fields:
     - First Name (required)
     - Last Name
     - Email (required)
     - Phone Number
     - Message/Notes
     - Interest Type (custom property)
   - Save the form

3. **Get your credentials:**
   - Go to Settings > Integrations > Forms
   - Find your **Portal ID** (looks like: `12345678`)
   - Find your **Form GUID** (looks like: `abc12345-def6-7890-ghij-klmnopqrstuv`)

4. **Add to your `.env` file:**
   ```bash
   VITE_HUBSPOT_PORTAL_ID=your_portal_id_here
   VITE_HUBSPOT_FORM_GUID=your_form_guid_here
   ```

5. **Restart your dev server** after adding the env variables

---

## Option 2: EmailJS (Simpler, Email Only)

EmailJS is simpler if you just want email notifications without CRM features.

### Setup Steps:

1. **Create an EmailJS account** (free): https://www.emailjs.com/

2. **Set up email service:**
   - Go to Email Services and connect Gmail/Outlook/etc.
   - Note your **Service ID**

3. **Create an email template:**
   - Go to Email Templates
   - Create a new template with these variables:
     - `{{from_name}}` - Sender's name
     - `{{from_email}}` - Sender's email
     - `{{phone}}` - Phone number
     - `{{interest}}` - Interest type
     - `{{message}}` - Message content
   - Set "To Email" to: `steve@homeplaceflorida.com`
   - Note your **Template ID**

4. **Get your Public Key:**
   - Go to Account > API Keys
   - Copy your **Public Key**

5. **Add to your `.env` file:**
   ```bash
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   ```

6. **Restart your dev server** after adding the env variables

---

## Environment Variables

Create a `.env` file in the root directory with your chosen service credentials:

**For HubSpot:**
```bash
VITE_HUBSPOT_PORTAL_ID=your_portal_id
VITE_HUBSPOT_FORM_GUID=your_form_guid
```

**For EmailJS:**
```bash
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

**Note:** The form will automatically use HubSpot if configured, otherwise fall back to EmailJS, or just save to database if neither is configured.

---

## Testing

After setup, test the form:
1. Fill out the contact form on your site
2. Submit it
3. Check:
   - **HubSpot**: Go to Contacts in HubSpot to see the new contact
   - **EmailJS**: Check your email inbox (steve@homeplaceflorida.com)

---

## Recommendation

For real estate, **HubSpot is recommended** because:
- Free CRM helps track all leads
- Automatic contact creation
- Can set up email workflows
- Better for long-term lead management
- Free tier is very generous (1,000 contacts)

