# Rose Chemicals WhatsApp AI Bot 🤖

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js_22-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Sarvam AI](https://img.shields.io/badge/Sarvam_AI-Multilingual_NLP-FF6B6B?style=for-the-badge)](https://www.sarvam.ai/)
[![WhatsApp Cloud API](https://img.shields.io/badge/WhatsApp-Cloud_API-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://developers.facebook.com/docs/whatsapp/cloud-api)
[![Deploy on Railway](https://img.shields.io/badge/Railway-Deploy-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)](https://railway.app/)

**Enterprise Multilingual WhatsApp Conversational Sales & Customer Support Bot for Rose Chemicals.**

</div>

---

## 📖 Overview

This repository powers the automated WhatsApp customer service and conversational commerce infrastructure for **Rose Chemicals** (a premier industrial, household, and cleaning chemicals manufacturer).

Integrated with **Sarvam AI** for native Indian language comprehension (Tamil, Hindi, English) and backed by **MongoDB**, the system qualifies inbound prospect leads, answers technical chemical product questions, suggests product quantities, and powers automated batch broadcast messaging campaigns.

---

## 🌟 Key Capabilities

- 🗣️ **Multilingual Intelligence**: Native processing of Indian languages and Romanized colloquial scripts powered by **Sarvam AI**.
- 📦 **Automated Product Catalog Sync**: Synchronizes products, pricing, and stock directly from the Rose Chemicals website API (`scripts/sync_products.js`).
- 📢 **Batch Template Messaging**: Broadcast utility for promotional marketing, order notifications, and wholesale client re-engagement.
- 🗄️ **Lead & Message Persistence**: Captures conversation histories, user phone numbers, and customer intent in MongoDB.
- 🛡️ **Webhook Security**: Verified Meta webhook handshakes and HMAC token authentication.

---

## 🛠️ Architecture & Tech Stack

```mermaid
flowchart LR
    User[WhatsApp User] <--> WA[WhatsApp Cloud API / Meta Webhook]
    WA <--> API[Express API Server]
    API <--> Sarvam[Sarvam AI Multilingual Engine]
    API <--> DB[(MongoDB Cluster)]
    API <--> Store[Rose Chemicals Web Catalog API]
```

- **Runtime**: Node.js 22.x LTS
- **Server**: Express.js with CORS and Body-Parser
- **Database**: MongoDB via Mongoose ODM
- **AI / NLP**: Sarvam AI API
- **Messaging Channel**: WhatsApp Business Cloud API (Graph API v18.0+)
- **Deployment**: Configured for Railway (`railway.json`) and Docker / VPS

---

## 📂 Directory Structure

```
Chatbot/
├── api/
│   ├── index.js            # Main Express application & webhook listener
│   └── routes/             # API routing endpoints
├── lib/
│   ├── sarvam.js           # Sarvam AI translation & NLP integration
│   ├── whatsapp.js         # WhatsApp Graph API message senders & templates
│   └── database.js         # Mongoose connection management
├── models/
│   ├── Conversation.js     # Chat session and message history schemas
│   ├── Lead.js             # Prospective buyer contact records
│   └── Product.js          # Cached product catalog items
├── scripts/
│   ├── sync_products.js    # Syncs live inventory from website API
│   ├── send_test_template_batch.js # Batch broadcast utility
│   └── send_template_to_previous_numbers.js
├── products.json           # Local fallback product definitions
├── training_data.json      # Domain FAQ and chemical query knowledge base
├── railway.json            # Railway deployment configuration
├── .env.example            # Environment variable specifications
└── package.json            # Project manifest
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# Server
PORT=3000
NODE_ENV=production

# WhatsApp Cloud API
WHATSAPP_PHONE_NUMBER_ID=your_meta_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_meta_system_user_token
WHATSAPP_VERIFY_TOKEN=your_custom_webhook_secret

# Sarvam AI
SARVAM_API_KEY=your_sarvam_ai_key

# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/rosechemicals?retryWrites=true&w=majority

# Website Catalog Integration
WEBSITE_API_URL=https://rosechemicals.in
WEBSITE_URL=https://rosechemicals.in
```

---

## 🚀 Getting Started

### Local Development

```bash
# 1. Clone repository
git clone https://github.com/A-Generative-Slice/Chatbot.git
cd Chatbot

# 2. Install dependencies
npm install

# 3. Start local server
npm start
```

### Running Batch Scripts

```bash
# Sync products from web store
npm run sync:products

# Send promotional template batch
npm run send:test-batch
```

---

## 🚢 Deployment on Railway

1. Push this repository to GitHub.
2. In Railway, click **New Project** → **Deploy from GitHub repo**.
3. Link this repository. Railway automatically reads `railway.json`.
4. Under **Variables**, input all variables from `.env.example`.
5. Configure your Meta Developer WhatsApp Webhook URL to:  
   `https://<your-railway-domain>.up.railway.app/webhook`

---

## 📄 License & Attribution

Designed and engineered by **A Generative Slice** for **Rose Chemicals**.  
Copyright © 2026 A Generative Slice. All rights reserved.
