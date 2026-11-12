# Nourma AI Assistant — Backend

> **Phase 1 — Skeleton & Knowledge Base**  
> AI connection is NOT yet active. Awaiting approval for Phase 2.

---

## Folder Structure

```
backend/
├── src/
│   ├── worker.js          # Cloudflare Worker — request handler + Phase 2 Gemini stub
│   └── knowledge-base.js  # Single source of truth for all Nourma business data
├── wrangler.toml          # Cloudflare Workers deployment config
└── README.md              # This file
```

---

## Technology Stack

| Layer | Service | Plan |
|---|---|---|
| AI Model | Google Gemini 1.5 Flash | Free tier (60 req/min) |
| Backend | Cloudflare Workers | Free tier (100k req/day) |
| Frontend | Existing HTML/CSS/JS | No changes to design |

---

## Phase 1 — Completed ✅

- [x] Inspect existing website and chatbot code
- [x] Identify Ask Nourma HTML, CSS, and JavaScript
- [x] Create backend folder structure
- [x] Create structured knowledge base (`knowledge-base.js`)
- [x] Create Cloudflare Worker skeleton (`worker.js`)
- [x] Document AI behavior rules and system prompt template

---

## Phase 2 — Pending Approval 🔒

Before starting Phase 2, the following is needed:

1. **Gemini API Key** — Get free at https://aistudio.google.com/app/apikey
2. **Cloudflare Account** — Free at https://cloudflare.com
3. **Confirm business details** — Fill in PLACEHOLDER fields in `knowledge-base.js`
4. **Confirm WhatsApp number** — Replace placeholder in knowledge base

### Phase 2 Tasks:
- [ ] Activate Gemini API call in `worker.js` (code is already written, just uncomment)
- [ ] Deploy Worker to Cloudflare (free tier)
- [ ] Update frontend JS to call the Worker endpoint
- [ ] Replace scripted chatbot responses with live AI responses
- [ ] Test all FAQ scenarios against knowledge base
- [ ] Add rate limiting and abuse protection

---

## Knowledge Base — Placeholders to Fill

Before going live, replace these in `src/knowledge-base.js`:

| Field | Location | Action Needed |
|---|---|---|
| WhatsApp number | `company.whatsapp` | Add official WA number |
| WhatsApp URL | `company.whatsappUrl` | Add `https://wa.me/628XXXXXXXXXX` |
| Email | `company.email` | Add official email |
| Allergen info | `ingredientsPolicy.allergenInfo` | Confirm with nutritionist |
| Preservatives policy | `ingredientsPolicy.preservatives` | Confirm with kitchen team |
| Delivery time | `delivery.deliveryTime` | Confirm operating hours |
| Packaging info | `delivery.packaging` | Confirm packaging type |
| Nutritional data | `menu.nutritionalData` | Provide from nutritionist |
| Confirmed menu items | `menu.confirmedItems` | Add real menu items |
| Cloudflare account ID | `wrangler.toml` | After creating CF account |
| Production domain | `wrangler.toml` | After domain is set up |

---

## Existing Chatbot (Ask Nourma)

The current chatbot in `js/script.js` uses:

```javascript
// HTML trigger
<button class="ask-trigger" aria-expanded="false" aria-controls="ask-panel">
  <span class="chat-symbol">✿</span> Ask Nourma
</button>

// Panel ID
<div class="ask-panel" id="ask-panel" hidden>

// Open/close logic
askTrigger.addEventListener('click', () => { ... })
askClose.addEventListener('click', () => { ... })

// Pre-written answers object
const answers = { menu: "...", packages: "...", delivery: "..." }
```

**Phase 2 integration point:**  
Replace the `answers` object lookup with a `fetch()` call to the Cloudflare Worker `/chat` endpoint.

---

## Security Notes

- API key is stored as a Cloudflare Worker secret — never in frontend JS
- Worker validates request origin (CORS whitelist)
- Input is sanitised (HTML stripped, 500 char limit) before sending to Gemini
- Worker does not log or store conversation data
