/**
 * xAI / Grok API client.
 *
 * Tries the modern Responses API first (POST /v1/responses with { input }),
 * then falls back to the OpenAI-compatible Chat Completions endpoint.
 * Both shapes are extracted automatically so callers always get plain text.
 */

const RESPONSES_URL    = 'https://api.x.ai/v1/responses';
const COMPLETIONS_URL  = 'https://api.x.ai/v1/chat/completions';

const getApiKey = (override) =>
  override || import.meta.env?.VITE_GROK_API_KEY || import.meta.env?.VITE_XAI_API_KEY || '';

const getModel = (override) =>
  override || import.meta.env?.VITE_GROK_MODEL || 'grok-4.20-reasoning';

export const isGrokAvailable = () => Boolean(getApiKey());

/* ── Pull plain text out of any response shape Grok might return ── */
const extractText = (json) => {
  if (!json) return '';
  if (typeof json === 'string') return json;

  // 1) OpenAI Responses API: { output: [ { content: [ { type: 'output_text', text } ] } ] }
  const r1 = json?.output?.[0]?.content?.[0]?.text;
  if (r1) return r1;

  // 2) Convenience field that some adapters return
  if (typeof json.output_text === 'string' && json.output_text.length) return json.output_text;

  // 3) Older chat-completions shape
  const r3 = json?.choices?.[0]?.message?.content;
  if (typeof r3 === 'string') return r3;

  // 4) Nested array content (chat completions vision/structured)
  if (Array.isArray(json?.choices?.[0]?.message?.content)) {
    return json.choices[0].message.content.map(c => c?.text || '').join('');
  }

  return '';
};

const safeJson = async (res) => {
  const text = await res.text();
  try { return JSON.parse(text); } catch { return { raw: text }; }
};

/* ── Try Responses API ── */
const callResponses = async (key, model, prompt, opts) => {
  const res = await fetch(RESPONSES_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      input: prompt,
      ...(opts?.temperature != null ? { temperature: opts.temperature } : {}),
    }),
    signal: opts?.signal,
  });
  const data = await safeJson(res);
  if (!res.ok) {
    const msg = data?.error?.message || data?.raw || res.statusText;
    const err = new Error(`Grok /v1/responses ${res.status}: ${String(msg).slice(0, 200)}`);
    err.status = res.status;
    throw err;
  }
  return extractText(data);
};

/* ── Try Chat Completions (OpenAI-compatible) ── */
const callChat = async (key, model, prompt, opts) => {
  const res = await fetch(COMPLETIONS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: opts?.temperature ?? 0.7,
      ...(opts?.responseFormat ? { response_format: opts.responseFormat } : {}),
    }),
    signal: opts?.signal,
  });
  const data = await safeJson(res);
  if (!res.ok) {
    const msg = data?.error?.message || data?.raw || res.statusText;
    const err = new Error(`Grok /v1/chat/completions ${res.status}: ${String(msg).slice(0, 200)}`);
    err.status = res.status;
    throw err;
  }
  return extractText(data);
};

/**
 * High-level call. Tries Responses → Chat Completions.
 * Throws if both fail or no API key is configured.
 *
 * @param {string} prompt
 * @param {{ apiKey?: string, model?: string, temperature?: number, json?: boolean, signal?: AbortSignal, timeoutMs?: number }} opts
 * @returns {Promise<string>} model text output
 */
export const askGrok = async (prompt, opts = {}) => {
  const key = getApiKey(opts.apiKey);
  if (!key) throw new Error('NO_GROK_KEY');
  const model = getModel(opts.model);

  // Auto-timeout (default 35s) — combined with any caller-provided AbortSignal
  const timeoutMs = opts.timeoutMs ?? 35_000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new DOMException('Grok request timed out', 'TimeoutError')), timeoutMs);
  if (opts.signal) {
    if (opts.signal.aborted) controller.abort(opts.signal.reason);
    else opts.signal.addEventListener('abort', () => controller.abort(opts.signal.reason));
  }

  const callOpts = {
    temperature: opts.temperature ?? 0.7,
    signal: controller.signal,
    ...(opts.json ? { responseFormat: { type: 'json_object' } } : {}),
  };

  try {
    let firstErr;
    try {
      const text = await callResponses(key, model, prompt, callOpts);
      if (text) return text;
    } catch (err) { firstErr = err; }

    // Some xAI models or accounts only have chat completions enabled — try that.
    try {
      const text = await callChat(key, model, prompt, callOpts);
      if (text) return text;
    } catch (err2) {
      const merged = new Error(
        `Grok failed on both endpoints. Responses: ${firstErr?.message || 'n/a'} | Chat: ${err2.message}`
      );
      merged.cause = err2;
      throw merged;
    }

    throw new Error('Grok returned an empty response');
  } finally {
    clearTimeout(timer);
  }
};

/* ── Robust JSON extraction from a model's text answer ── */
export const extractJson = (text) => {
  if (!text) throw new Error('Empty model response');
  let s = String(text).trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  // Find the JSON envelope (object or array)
  const candidates = [];
  const idxObj = s.indexOf('{');
  const idxArr = s.indexOf('[');
  const startCh = idxArr === -1 ? '{' : idxObj === -1 ? '[' : (idxArr < idxObj ? '[' : '{');
  const endCh   = startCh === '{' ? '}' : ']';
  const first = s.indexOf(startCh);
  const last  = s.lastIndexOf(endCh);
  if (first !== -1 && last !== -1 && last > first) s = s.slice(first, last + 1);

  return JSON.parse(s);
};
