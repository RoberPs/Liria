# Liria – asistente penalista del BOE

**Liria** es un chatbot que responde consultas de derecho penal y procesal penal español citando únicamente fuentes oficiales de [boe.es](https://www.boe.es). Demo: https://liriaboe.netlify.app/ (el acceso requiere un código de demo).

## Cómo funciona

```
Navegador (React + Vite, Netlify)
        │  POST /webhook/n8n_chat  { chatInput, sessionId, code }
        ▼
Cloudflare Tunnel (solo /webhook/*, con límite de peticiones por IP)
        ▼
n8n (Docker, local)
  ├─ valida el código de demo (401 si no coincide)
  └─ agente Claude Sonnet con memoria de conversación y herramientas:
       · lectura de un artículo desde la API de legislación consolidada del BOE
       · base vectorial (Pinecone) con las novedades diarias del BOE
       · sumario del BOE del día
       · búsqueda web restringida a boe.es (último recurso)
```

Una segunda automatización de n8n lee cada día laborable el sumario del BOE, filtra las disposiciones penales, las resume y las guarda en Pinecone.

## Este repositorio

Contiene solo el **frontend**. Los flujos de n8n y la configuración del servidor no se publican aquí porque incluyen datos de la instalación.

- Chat con respuestas en Markdown, enlace a la fuente oficial, botón *Reintentar* y dictado por voz.
- La validación del código la hace el servidor: en el navegador no hay contraseñas ni claves.

## Desarrollo local

Requisitos: Node.js 18 o superior.

```bash
npm install
cp .env.example .env     # y rellena VITE_N8N_WEBHOOK_URL
npm run dev              # http://localhost:5173
npm run build            # genera dist/
```

| Variable | Descripción |
|---|---|
| `VITE_N8N_WEBHOOK_URL` | URL pública del webhook de n8n (no es secreta). Ejemplo: `https://<dominio>/webhook/n8n_chat` |

> Las variables `VITE_*` acaban en el bundle público: no pongas aquí secretos.

## Tecnologías

React 19 · Vite · n8n · Claude (Anthropic) · Pinecone · Cloudflare Tunnel · Netlify.

## Aviso

Liria es una herramienta de consulta y no sustituye el asesoramiento de un abogado.
