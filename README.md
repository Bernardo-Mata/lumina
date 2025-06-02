# Documentación del Proyecto: Lumina

2025

---

## 1. Definiciones y especificación de requerimientos

### a) Definición general del proyecto de software

**Idea general:**  
Lumina es un sistema integral para la gestión de riesgos en la cadena de suministro (Supply Chain Risk Management). Permite analizar archivos de datos de proveedores, identificar alertas y eventos de disrupción, calcular puntajes de riesgo, y generar reportes ejecutivos y de cumplimiento. Utiliza modelos de lenguaje (LLMs) para extraer, resumir y clasificar riesgos, alertas y métricas clave, y soporta integración de chatbot para consultas naturales sobre los reportes.

**Objetivos:**  
- Brindar visibilidad ejecutiva sobre el estado de la cadena de suministro.
- Detectar y priorizar alertas según su criticidad.
- Calcular puntajes de riesgo y cumplimiento por proveedor o segmento.
- Generar dashboards y reportes automáticos.
- Identificar y reportar eventos de disrupción en la cadena.
- Facilitar la toma de decisiones basada en datos.

**Usuarios:**  
Dirigido a responsables de logística, operaciones y gestión de riesgos. El usuario esperado es intermedio (familiaridad con operaciones, manejo de documentos, interpretación de reportes).

---

### b) Especificación de requerimientos del proyecto

**Requisitos generales:**  
- Analizar archivos de datos (CSV) de la cadena de suministro.
- Clasificar y priorizar alertas de riesgo.
- Generar dashboards ejecutivos, reportes de cumplimiento y disrupción.
- Visualizar puntajes de riesgo por proveedor.
- Automatizar el análisis mediante LLMs.
- Guardar insights y reportes generados en backend.
- Consultar insights mediante chatbot.

**Requisitos funcionales:**  
- Subida de archivos de datos (CSV) para análisis.
- Extracción de información relevante mediante endpoints backend.
- Generación automática de insights, alertas, compliance, disrupciones y puntajes de riesgo.
- Presentación visual (dashboard, tablas, listas, gráficos) de los resultados.
- Persistencia temporal/local de los análisis.
- Exportación y guardado de reportes.
- Integración de módulo chatbot para consultas de reportes.
- Autenticación de usuario y autorización para operaciones protegidas.

**Información de autoría y Legacy:**  
- Proyecto original desarrollado en 2024-2025.
- Arquitectura modular y extensible.  
- No depende de sistemas previos.

**Alcances y limitaciones:**  
- El sistema analiza datos cargados por el usuario en formato CSV.
- No realiza integración directa con ERPs o bases externas.
- El análisis depende de la calidad y completitud de los datos suministrados.

---

### c) Procedimientos de instalación, descarga de librerías y prueba

**Herramientas y librerías utilizadas:**  

**Backend:**
- Python 3.8+
- [FastAPI](https://fastapi.tiangolo.com/) - Framework backend
- [uvicorn](https://www.uvicorn.org/) - ASGI server para FastAPI
- [python-multipart](https://andrew-d.github.io/python-multipart/) - Soporte para uploads de archivos
- [SQLAlchemy](https://www.sqlalchemy.org/) - ORM para gestión de base de datos (si se utiliza)
- [PyJWT](https://pyjwt.readthedocs.io/) - Manejo de autenticación JWT
- [pydantic](https://docs.pydantic.dev/) - Validación de datos
- Otros: json, re, requests, librerías del modelo LLM (API o local)

**Frontend:**
- [Node.js](https://nodejs.org/) 16+
- [React.js](https://react.dev/) - Biblioteca principal frontend
- [Vite](https://vitejs.dev/) - Bundler para desarrollo rápido
- [Chart.js](https://www.chartjs.org/) - Gráficos y visualizaciones
- [react-chartjs-2](https://react-chartjs-2.js.org/) - Wrapper para Chart.js
- [styled-components](https://styled-components.com/) - CSS-in-JS para estilización
- [lucide-react](https://lucide.dev/) - Iconografía
- [tailwindcss](https://tailwindcss.com/) (si se utiliza para utilidades CSS)
- Otros: ESLint, dotenv, etc.

**Procedimiento para descargar e instalar dependencias**

#### 1. Clonar el repositorio

```sh
git clone https://github.com/Bernardo-Mata/lumina.git
cd lumina
```

#### 2. Instalación de dependencias del backend

```sh
cd API
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Si no existe `requirements.txt`, instalar manualmente:

```sh
pip install fastapi uvicorn python-multipart pydantic pyjwt sqlalchemy
```
> Instale también cualquier otra librería especificada en la documentación o código fuente.

#### 3. Instalación de dependencias del frontend

```sh
cd ../front
npm install
```
Esto descargará automáticamente todas las dependencias listadas en `package.json`:
- react
- react-dom
- react-chartjs-2
- chart.js
- styled-components
- lucide-react
- tailwindcss (si está incluido)
- etc.

*Para agregar dependencias adicionales manualmente (ejemplo Chart.js):*
```sh
npm install chart.js react-chartjs-2
npm install styled-components
npm install lucide-react
npm install tailwindcss
```

#### 4. Ejecución de la aplicación

**Backend:**
```sh
(si estas en la carpeta de lumina, dirigete al comando uvicorn)
cd lumina
uvicorn API.main:app --reload
```

**Frontend:**
```sh
cd front
npm run dev
```

#### 5. Acceso y prueba

- Acceda a la interfaz vía navegador en `http://localhost:5173` (o puerto informado).
- Pruebe el flujo:
  - Subida de archivo CSV.
  - Generación de insights.
  - Visualización en dashboard, alerts, compliance, disruption.
  - Consulta de insights vía chatbot.
  - Guardado de insights (requiere autenticación).

---

## 2. Arquitectura del sistema

### Descripción jerárquica

- **Monolito modular con separación clara entre frontend y backend.**
  - **Backend (API/):** Endpoints REST para ingestión, autenticación, procesamiento y análisis de datos.
  - **Frontend (front/):** SPA React para interacción, visualización y reportes.

### Diagrama de módulos

```
Usuario
   |
[Frontend React]
   |
[API REST (FastAPI)] -- [Modelo LLM]
   |
[Archivos CSV]
```

### Descripción individual de los módulos

- **API/backendRequest.py**
  - **Propósito:** Proveer endpoints REST para cargar archivos, analizar datos, extraer insights con LLM, autenticación y guardar resultados.
  - **Responsabilidad:** Procesar archivos, invocar al modelo LLM, formatear respuestas, validar autenticación.
  - **Dependencias:** FastAPI, json, re, modelo de lenguaje, JWT, SQLAlchemy.
  - **Implementación:** API/backendRequest.py

- **front/src/components/**
  - **Dashboard.jsx:** Visualización de KPIs y métricas clave, gráficos de distribución por región, estado y riesgo.
  - **Alerts.jsx:** Presentación de alertas clasificadas por prioridad.
  - **Suppliers.jsx:** Tabla con proveedores, puntaje de riesgo y estado.
  - **Summary.jsx:** Control general del flujo de análisis y visualización, integración de subida de archivos y generación de insights.
  - **Compilance.jsx:** Resumen de cumplimiento y hallazgos normativos.
  - **Disruption.jsx:** Visualización de eventos de disrupción en la cadena.
  - **chatbot.jsx:** Chatbot para consultar insights y reportes mediante lenguaje natural.
  - **login.jsx/Register.jsx:** Autenticación y registro de usuarios.

- **Persistencia temporal:** Uso de localStorage para almacenar últimos análisis.

### Dependencias externas

- **Backend:** FastAPI, pydantic, SQLAlchemy, PyJWT, python-multipart, etc.
- **Frontend:** React, Chart.js, react-chartjs-2, styled-components, lucide-react, tailwindcss, etc.
- **Decisiones técnicas:** FastAPI por rapidez e integración Python; React para SPA ágil; autenticación JWT para seguridad y control de acceso.

---

## 3. Diseño del modelo de datos

**Entidades principales:**
- **Proveedor:** nombre, ubicación, estado, puntaje de riesgo.
- **Alerta:** descripción, prioridad (alta, media, baja), proveedor asociado.
- **Cumplimiento:** lista de hallazgos o ítems cumplidos/incumplidos.
- **Disrupción:** eventos de disrupción detectados.
- **Dashboard:** KPIs agregados (total proveedores, % entregas a tiempo, etc).

**Modelo de datos (lenguaje agnóstico):**

- Proveedor
  - nombre: string
  - ubicación: string
  - risk_score: float
  - status: string

- Alerta
  - descripcion: string
  - prioridad: enum (alta, media, baja)
  - proveedor: string

- Cumplimiento
  - items: lista de strings

- Disrupción
  - descripcion: string
  - fecha: date
  - severidad: string

- Dashboard
  - total_suppliers: int
  - average_risk_score: float
  - compliance_issues_count: int
  - on_time_delivery_percentage: float
  - recent_alerts: lista de Alerta
  - critical_materials_shortage: lista
  - supplier_region_distribution: objeto {region: cantidad}
  - supplier_status_distribution: objeto {status: cantidad}
  - risk_score_distribution: objeto {nivel: cantidad}

**Flujo de datos:**
- **Entrada:** Archivo CSV con datos.
- **Interno:** Procesamiento y análisis por backend y LLM.
- **Salida:** JSON con insights, visualizaciones y reportes.

---

## 4. Descripción de procesos y servicios ofrecidos

### Servicios implementados

- **/api/upload-document:** Sube y almacena archivo CSV.
- **/api/dashboard:** Genera summary ejecutivo con KPIs usando LLM.
- **/api/alerts:** Clasifica y resume alertas por prioridad.
- **/api/suppliers:** Extrae tabla de proveedores, estado y puntaje.
- **/api/compliance:** Resumen de cumplimiento normativo.
- **/api/disruption:** Resumen de eventos de disrupción en la cadena.
- **/api/risk-scores:** Listado de puntajes de riesgo por proveedor.
- **/api/reports:** Genera reportes analíticos adicionales.
- **/guardar-insight:** Guarda insights generados (requiere autenticación).
- **/guardar-insight-tabular:** Guarda insights tabulares (requiere autenticación).
- **/api/insights-llm-sim:** Endpoint para insights combinados para chatbot.

### Descripción de procesos

**Generación de dashboard y almacenamiento**
1. Usuario sube archivo CSV.
2. Backend lo procesa y extrae texto relevante.
3. Invoca LLM para generar resumen ejecutivo.
4. LLM retorna JSON con KPIs.
5. Frontend muestra dashboard con resultados.
6. Insights generados pueden ser guardados en backend (protegido por token).

**Argumentos de entrada/salida:**
- **Entrada:** nombre de archivo (string), token (en endpoints protegidos).
- **Salida:** JSON estructurado con métricas, insights y reportes.

---

## 5. Documentación técnica - Especificación API

### Ejemplo de endpoint

```python
@app.get("/api/dashboard")
def dashboard_insights(filename: str = Query(..., description="Nombre del archivo previamente subido")):
    """
    Endpoint que genera insights usando el LLM y retorna el JSON estructurado,
    usando el documento cargado identificado por filename.
    """
```
**Argumentos:**
- filename (string): nombre del archivo previamente subido.

**Respuesta:**
- JSON con campos: total_suppliers, average_risk_score, compliance_issues_count, on_time_delivery_percentage, recent_alerts, critical_materials_shortage, supplier_region_distribution, supplier_status_distribution, risk_score_distribution.

### Ejemplo de endpoint protegido

```python
@app.post("/guardar-insight")
def guardar_insight(data: dict, token: str = Depends(auth_dep)):
    """
    Guarda insights generados por el usuario autenticado.
    Requiere JWT.
    """
```

**Invocación del sistema:**
- Subir archivo desde el frontend.
- Ejecutar análisis desde el panel principal.
- Visualizar resultados en Dashboard, Alerts, Suppliers, Compliance, Disruption.
- Consultar insights vía Chatbot.

**Parámetros opcionales:**  
- Nombre de archivo.
- Token de autenticación para guardar y consultar insights.

---

## 6. Conclusiones

Durante el desarrollo se presentaron desafíos como:
- Integración robusta con LLMs y manejo de respuestas no estructuradas.
- Procesamiento flexible de archivos con estructuras variables.
- Diseño de un frontend intuitivo y visualmente claro.
- Implementación de autenticación JWT y endpoints protegidos.
- Almacenamiento y consulta de insights históricos.

**Políticas adoptadas:**
- Modularidad en backend y frontend.
- Validación y parsing robusto.
- Uso de autenticación para operaciones críticas.

**Restricciones:**
- No se provee almacenamiento persistente de archivos originales.
- El análisis depende de la calidad de los datos ingresados.

**Experiencia obtenida:**
- Profundización en integración de sistemas de análisis de datos con modelos de lenguaje.
- Práctica en diseño de dashboards ejecutivos y visualizaciones.
- Experiencia en seguridad y autenticación web.

---

> Para la generación de documentación técnica automatizada, Doxygen puede ser utilizado en los módulos de Python, facilitando la generación de manuales para programadores y mantenedores.
