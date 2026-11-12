/**
 * Nourma AI Assistant — Cloudflare Worker
 * ─────────────────────────────────────────────────────────────────────────────
 * STATUS: Phase 1 Skeleton — API connection NOT yet implemented.
 *
 * This file defines the Worker structure, CORS handling, request routing,
 * and response format. The Gemini API call is stubbed out and clearly marked
 * TODO for Phase 2.
 *
 * Deploy: wrangler deploy
 * Env vars needed (Phase 2): GEMINI_API_KEY (set via wrangler secret)
 * ─────────────────────────────────────────────────────────────────────────────
 */

// NOTE: In a real Cloudflare Worker, `require` is not available.
// knowledge-base.js content will be inlined / bundled by wrangler in Phase 2.
// For now this file documents the intended structure.

// ─── CORS Configuration ───────────────────────────────────────────────────────
// Only allow requests from the Nourma website domain.
// Update ALLOWED_ORIGINS when the domain is confirmed.
const ALLOWED_ORIGINS = [
  'https://nourmacatering.github.io',      // GitHub Pages (if used)
  'https://nourmacatering-landing-page.pages.dev', // Cloudflare Pages (if used)
  'http://localhost:5500',                 // VS Code Live Server (development)
  'http://localhost:3000',                 // Local dev server
  'http://127.0.0.1:5500',
  // TODO: Add production domain when confirmed
];

function getCorsHeaders(requestOrigin) {
  const origin = ALLOWED_ORIGINS.includes(requestOrigin)
    ? requestOrigin
    : ALLOWED_ORIGINS[0]; // Fallback to first allowed origin

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

// ─── Main Worker Handler ──────────────────────────────────────────────────────
export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';
    const corsHeaders = getCorsHeaders(origin);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Only accept POST to /chat
    const url = new URL(request.url);
    if (request.method !== 'POST' || url.pathname !== '/chat') {
      return new Response(
        JSON.stringify({ error: 'Not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { message, conversationHistory = [] } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Basic input sanitisation — strip HTML tags, limit length
    const sanitisedMessage = message
      .replace(/<[^>]*>/g, '')
      .trim()
      .slice(0, 500); // Max 500 chars per message

    // ─── TODO Phase 2: Call Gemini API ─────────────────────────────────────
    // Replace the stub below with the real Gemini call.
    //
    // const geminiResponse = await callGeminiAPI(
    //   sanitisedMessage,
    //   conversationHistory,
    //   env.GEMINI_API_KEY
    // );
    // ───────────────────────────────────────────────────────────────────────

    // Phase 1 stub — returns a placeholder response
    const stubResponse = buildStubResponse(sanitisedMessage);

    return new Response(
      JSON.stringify({
        reply: stubResponse,
        source: 'stub',   // Will be 'gemini' in Phase 2
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  },
};

// ─── Phase 1 Stub Response ────────────────────────────────────────────────────
// Provides meaningful pre-written responses using the knowledge base.
// This will be replaced by the real Gemini call in Phase 2.
function buildStubResponse(message) {
  const lower = message.toLowerCase();

  if (lower.includes('harga') || lower.includes('price') || lower.includes('berapa')) {
    return (
      'Harga paket Nourma:\n\n' +
      '• Paket 10 Hari (Starter): Rp 3.000.000\n' +
      '• Paket 30 Hari (Terpopuler): Rp 8.700.000\n' +
      '• Paket 40 Hari (Premium): Rp 11.200.000\n' +
      '• Paket 60 Hari (Elite): Rp 16.200.000\n\n' +
      'Semua paket sudah termasuk 3 meals + 1 snack per hari dan gratis ongkir ' +
      'dalam 10 km dari Jakarta Selatan 🌿'
    );
  }

  if (lower.includes('halal')) {
    return (
      'Ya, semua menu Nourma 100% halal 🌙 Kami menyiapkan hidangan di dapur ' +
      'higienis dengan bahan-bahan dari sumber terpercaya.'
    );
  }

  if (lower.includes('kirim') || lower.includes('delivery') || lower.includes('area')) {
    return (
      'Nourma melayani pengiriman di area Jakarta Selatan, gratis ongkir dalam ' +
      'radius 10 km 📦\n\n' +
      'Untuk area di luar Jakarta Selatan, silakan konfirmasi via Instagram ' +
      '@nourmacatering.id ya, Ibu.'
    );
  }

  if (lower.includes('paket') || lower.includes('package')) {
    return (
      'Nourma punya 4 pilihan paket:\n\n' +
      '1. Paket 10 Hari — Rp 3.000.000\n' +
      '2. Paket 30 Hari — Rp 8.700.000 ⭐ Terpopuler\n' +
      '3. Paket 40 Hari — Rp 11.200.000 (termasuk personalisasi menu)\n' +
      '4. Paket 60 Hari — Rp 16.200.000 (menu premium + 2 follow-up konsultasi)\n\n' +
      'Ibu ingin tahu lebih detail tentang paket tertentu?'
    );
  }

  if (lower.includes('menu') || lower.includes('makanan') || lower.includes('makan')) {
    return (
      'Setiap hari, Ibu mendapatkan 3 hidangan bergizi: sarapan, makan siang, ' +
      'makan malam, plus 1 snack bernutrisi 🥗\n\n' +
      'Menu dirotasi setiap hari dengan inspirasi kuliner lokal dan internasional, ' +
      'dirancang dengan panduan ahli gizi.\n\n' +
      'Detail menu aktual akan dikonfirmasi saat pemesanan ya, Ibu.'
    );
  }

  if (lower.includes('pesan') || lower.includes('order') || lower.includes('cara')) {
    return (
      'Cara memesan Nourma sangat mudah, Ibu:\n\n' +
      '1️⃣ DM Instagram @nourmacatering.id\n' +
      '2️⃣ Pilih paket & diskusikan preferensi menu\n' +
      '3️⃣ Chef kami siapkan meal plan harian\n' +
      '4️⃣ Diantar fresh setiap hari ke rumah Ibu\n\n' +
      'Nourma coming soon di Jakarta — follow @nourmacatering.id untuk info terbaru! 🌸'
    );
  }

  if (lower.includes('konsultasi') || lower.includes('gizi') || lower.includes('nutrisi')) {
    return (
      'Paket Nourma yang mencakup konsultasi nutrisi:\n\n' +
      '• Paket 30 Hari: 1 sesi konsultasi nutrisi\n' +
      '• Paket 40 Hari: Konsultasi awal + 1 follow-up\n' +
      '• Paket 60 Hari: Konsultasi awal + 2 follow-up\n\n' +
      'Nourma tidak memberikan saran medis ya, Ibu. Untuk kondisi kesehatan ' +
      'khusus, selalu konsultasikan dengan dokter Ibu.'
    );
  }

  if (lower.includes('caesar') || lower.includes('normal') || lower.includes('melahirkan')) {
    return (
      'Nourma memahami bahwa kebutuhan nutrisi setelah persalinan normal dan ' +
      'caesar bisa berbeda 💛\n\n' +
      'Paket 40 dan 60 hari sudah mencakup personalisasi menu sesuai kondisi ' +
      'Ibu. Untuk diskusi lebih detail, silakan DM kami di @nourmacatering.id.'
    );
  }

  // Default response
  return (
    'Halo Ibu, terima kasih sudah menghubungi Nourma! 🌸\n\n' +
    'Saya asisten Nourma dan senang membantu pertanyaan Ibu tentang layanan ' +
    'catering postpartum kami.\n\n' +
    'Ibu bisa bertanya tentang:\n' +
    '• Paket & harga\n' +
    '• Menu & nutrisi\n' +
    '• Area pengiriman\n' +
    '• Cara pemesanan\n\n' +
    'Atau DM langsung ke @nourmacatering.id untuk info terkini 💚'
  );
}

// ─── TODO Phase 2: Gemini API Call ───────────────────────────────────────────
// async function callGeminiAPI(message, conversationHistory, apiKey) {
//   const knowledge = require('./knowledge-base.js');
//   const systemPrompt = buildSystemPrompt(knowledge);
//
//   const payload = {
//     systemInstruction: { parts: [{ text: systemPrompt }] },
//     contents: [
//       ...conversationHistory.map(turn => ({
//         role: turn.role,
//         parts: [{ text: turn.text }],
//       })),
//       { role: 'user', parts: [{ text: message }] },
//     ],
//     generationConfig: {
//       temperature: 0.7,
//       topK: 40,
//       topP: 0.95,
//       maxOutputTokens: 512,
//     },
//     safetySettings: [
//       { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
//       { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
//       { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
//     ],
//   };
//
//   const response = await fetch(
//     `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
//     {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload),
//     }
//   );
//
//   const data = await response.json();
//   return data.candidates?.[0]?.content?.parts?.[0]?.text
//     || knowledge.aiRules.placeholderResponse;
// }
