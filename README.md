# Liria - Jurista Especializada en BOE

**Liria** es un asistente virtual inteligente diseñado para ayudar a profesionales y ciudadanos a navegar y comprender las disposiciones del Boletín Oficial del Estado (BOE).

![Liria Chat Interface](/placeholder_image_if_we_had_one.png)

## 🚀 Características Principales

- **🤖 Inteligencia Artificial**: Conversación natural para consultas legales complejas.
- **🔒 Acceso Seguro**: Sistema de login protegido para usuarios autorizados.
- **⚡ Integración en Tiempo Real**: Conexión con flujos de automatización en **n8n** para procesar información actualizada del BOE.
- **🎙️ Interacción por Voz**: Dictado de preguntas mediante la API de reconocimiento de voz del navegador.
- **📱 Diseño Responsivo**: Interfaz moderna y adaptada a dispositivos móviles y escritorio.

## 🛠️ Tecnologías

Este proyecto está construido con un stack moderno y eficiente:

- **React 19**: Biblioteca principal para la interfaz de usuario.
- **Vite**: Entorno de desarrollo ultrarrápido.
- **n8n**: Backend de automatización para la lógica de negocio y consultas al BOE.

## 📦 Instalación y Uso

### Prerrequisitos

- Node.js (v18 o superior)
- npm

### Pasos

1.  **Clonar el repositorio** (si aplica) o descargar el código.
2.  **Instalar dependencias**:
    ```bash
    npm install
    ```
3.  **Configurar entorno**:
    Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
    ```env
    VITE_APP_PASSWORD=tu_contraseña_secreta
    VITE_N8N_USERNAME=usuario_n8n
    VITE_N8N_PASSWORD=password_n8n
    ```
4.  **Iniciar servidor de desarrollo**:
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:5173`.

## 📄 Licencia

Este proyecto es privado y de uso restringido. Todos los derechos reservados.
