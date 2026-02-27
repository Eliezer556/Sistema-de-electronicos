# Sistema de Gestión de Electrónicos

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](/frontend)
[![Django](https://img.shields.io/badge/Django-5-092E20?logo=django)](/backend)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](#)
[![pnpm](https://img.shields.io/badge/pnpm-9-F69220?logo=pnpm)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)

## 📋 Descripción

**Sistema de Gestión de Electrónicos** es una aplicación full-stack diseñada para administrar el inventario y las ventas de una tienda de productos electrónicos. El proyecto demuestra la implementación de una arquitectura moderna desacoplada, con un backend robusto en Django y una interfaz de usuario dinámica construida con React.

El objetivo es proporcionar una herramienta funcional que permita:
*   Controlar el stock de productos en tiempo real.
*   Gestionar el catálogo de productos con categorías y precios.
*   Registrar las ventas de forma sencilla y automática.
*   Consultar el inventario de manera rápida e intuitiva.

## ✨ Características Principales

*   **Inventario Completo**: Interfaz para crear, leer, actualizar y eliminar (CRUD) productos electrónicos. Cada producto incluye nombre, categoría, precio y cantidad en stock.
*   **Sistema de Ventas**: Permite registrar ventas, seleccionando productos y cantidades. El stock se actualiza automáticamente al confirmar la venta.
*   **Búsqueda y Filtrado**: Capacidad para buscar productos por nombre y filtrar el inventario por categoría o rango de precio.
*   **API RESTful**: Backend construido con Django REST Framework (DRF) que expone endpoints bien definidos para todas las operaciones.
*   **Interfaz React Moderna**: Frontend desarrollado con React 19, utilizando componentes funcionales, hooks y Context API para la gestión del estado de la sesión y los datos.
*   **Rendimiento con pnpm**: El frontend utiliza **pnpm** como gestor de paquetes, lo que garantiza instalaciones más rápidas y un uso eficiente del espacio en disco.

## 🚀 Tecnologías Utilizadas

### Frontend
*   **React 19**: Biblioteca principal para la interfaz de usuario.
*   **React Router DOM**: Para la navegación y el enrutamiento entre las diferentes vistas.
*   **Context API**: Manejo del estado global (autenticación, carrito de venta).
*   **Vite**: Herramienta de build y servidor de desarrollo ultrarrápido.
*   **pnpm 9**: Gestor de paquetes eficiente.
*   **CSS Modules** (o Tailwind CSS - *ajusta según lo que uses realmente*): Para el estilizado de componentes.

### Backend
*   **Django 5**: Framework de alto nivel para Python.
*   **Django REST Framework (DRF)**: Para construir la API RESTful.
*   **PostgreSQL / MySQL**: Bases de datos relacionales soportadas.
*   **Autenticación JWT**: Sistema de autenticación seguro mediante tokens (asumo que usas `djangorestframework-simplejwt` o similar).
*   **Environment Variables**: Configuración sensible manejada con variables de entorno.

## 📁 Estructura del Proyecto

El proyecto está organizado de forma clara, separando el frontend del backend:


## 🛠️ Instalación y Configuración

Sigue estos pasos para tener el proyecto funcionando en tu entorno local.

### Prerrequisitos

Asegúrate de tener instalado:
*   **Node.js** (versión 20 o superior)
*   **pnpm** (versión 9 o superior). Si no lo tienes: `npm install -g pnpm`
*   **Python** (versión 3.10 o superior)
*   **pip** (gestor de paquetes de Python)
*   **PostgreSQL** (o MySQL) instalado y corriendo.

### Pasos de Instalación

1.  **Clonar el repositorio**
    ```bash
    git clone https://github.com/Eliezer556/Sistema-de-electronicos.git
    cd Sistema-de-electronicos
    ```

2.  **Configurar el Backend (Django)**
    ```bash
    cd backend
    # Crear y activar el entorno virtual
    python -m venv venv
    source venv/bin/activate  # En Windows: venv\Scripts\activate
    # Instalar dependencias
    pip install -r requirements.txt
    ```
    *   **Configurar variables de entorno**: Copia el archivo de ejemplo y edítalo con tus datos.
        ```bash
        cp .env.example .env
        # Ahora edita el archivo .env con tu editor favorito:
        # - SECRET_KEY: Genera una clave única y segura.
        # - DEBUG: Pon True para desarrollo.
        # - DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT: Datos de tu base de datos.
        ```
    *   **Preparar la base de datos**:
        ```bash
        # Asegúrate de que tu base de datos PostgreSQL/MySQL esté creada y corriendo.
        python manage.py migrate
        # (Opcional) Crear un superusuario para el panel de admin:
        python manage.py createsuperuser
        ```
    *   **Iniciar el servidor backend**:
        ```bash
        python manage.py runserver
        ```
        La API estará disponible en `http://localhost:8000/api/` (verifica la URL en tu configuración).

3.  **Configurar el Frontend (React con pnpm)**
    ```bash
    # Abre una nueva terminal, en la raíz del proyecto
    cd frontend
    # Instalar dependencias con pnpm (rápido y eficiente)
    pnpm install
    ```
    *   **Configurar variables de entorno**: Copia y configura el archivo de entorno.
        ```bash
        cp .env.example .env
        # Edita .env y asegúrate de que VITE_API_URL apunte a tu backend:
        # VITE_API_URL=http://localhost:8000/api
        ```
    *   **Iniciar el servidor de desarrollo**:
        ```bash
        pnpm run dev
        # O simplemente: pnpm dev
        ```
        La aplicación frontend estará disponible en `http://localhost:5173` (el puerto puede variar, verifica la salida en la terminal).

4.  **¡Listo!** Abre `http://localhost:5173` en tu navegador. La aplicación debería conectarse al backend y funcionar correctamente.

### Comandos Útiles

**Backend (Django)**
```bash
python manage.py makemigrations   # Crear migraciones después de cambiar modelos
python manage.py migrate          # Aplicar migraciones
python manage.py createsuperuser  # Crear admin