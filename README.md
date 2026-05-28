# ✈️ Destino: Intercambio Chile

Rastreador de ahorros gamificado con animaciones nativas y persistencia local.

## Inicio rápido (< 1 minuto)

```bash
npm install
npm run dev
```

Abre **http://localhost:5173** en tu navegador.

## Producción

```bash
npm run build
npm run preview
```

## Stack

- **React 18** + Hooks funcionales
- **Tailwind CSS 3** + animaciones personalizadas en `index.css`
- **Lucide React** para iconografía
- **Vite 5** como bundler
- **localStorage** para persistencia entre sesiones

## Mecánicas IHC

| Acción | Feedback visual |
|--------|----------------|
| Clic en ficha | Moneda vuela animada hacia la maleta |
| Absorción | Maleta hace rebote elástico (`bounce_in`) |
| Hito alcanzado | Toast de celebración + confetti CSS nativo |
| Barra de progreso | Shimmer animado con transición suave |
| Deshacer | Flash rojo en botón + reversión instantánea |
| Recarga de página | Estado restaurado desde `localStorage` |

## Despliegue en Vercel

```bash
npm i -g vercel
vercel --prod
```
