# Kamerun Transport - Moderne Buchungs-App

Eine moderne Transport-Buchungs-App mit Apple-inspiriertem UX Design, entwickelt mit React, TypeScript und TailwindCSS.

## Features

- **Authentifizierung**: Login, Registrierung mit JWT-Token-Management
- **Suche**: Intelligente Suche nach Fahrten mit Filtern und Sortierung
- **Buchung**: Einfacher Buchungsprozess mit Platzauswahl
- **Buchungsverwaltung**: Übersicht aller Buchungen mit Status-Tracking
- **Profil**: Persönliche Kontoverwaltung
- **Responsive Design**: Mobile-First Ansatz, optimiert für alle Bildschirmgrößen

## Technologie-Stack

- React 18
- TypeScript
- React Router v6
- Axios für API-Kommunikation
- TailwindCSS für Styling
- Lucide React für Icons
- Vite als Build-Tool

## Voraussetzungen

- Node.js (Version 16 oder höher)
- npm oder yarn
- SpringBoot API läuft auf http://localhost:8081

## Installation

1. Dependencies installieren:
```bash
npm install
```

## Entwicklung

1. Stellen Sie sicher, dass Ihre SpringBoot API auf http://localhost:8081 läuft

2. Starten Sie den Development-Server:
```bash
npm run dev
```

3. Öffnen Sie http://localhost:5173 in Ihrem Browser

## Build

Für einen Production-Build:
```bash
npm run build
```

Die Build-Dateien werden im `dist/` Ordner erstellt.

## Projektstruktur

```
src/
├── components/          # Wiederverwendbare UI-Komponenten
│   ├── ui/             # Basis-UI-Komponenten (Button, Input, Card, etc.)
│   ├── Layout.tsx      # Haupt-Layout mit Navigation
│   └── ProtectedRoute.tsx
├── contexts/           # React Contexts
│   └── AuthContext.tsx
├── pages/              # Seiten-Komponenten
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Home.tsx
│   ├── SearchResults.tsx
│   ├── Booking.tsx
│   ├── Bookings.tsx
│   └── Profile.tsx
├── services/           # API-Services
│   └── api.service.ts
├── types/              # TypeScript-Typen
│   └── api.types.ts
├── App.tsx
├── main.tsx
└── index.css
```

## API-Konfiguration

Die API-URL ist in `src/services/api.service.ts` konfiguriert:
```typescript
const API_BASE_URL = 'http://localhost:8081/api';
```

Falls Ihre API auf einem anderen Port läuft, ändern Sie diese URL entsprechend.

## Verwendung

### Registrierung
1. Öffnen Sie die App
2. Klicken Sie auf "Jetzt registrieren"
3. Füllen Sie das Formular aus
4. Sie werden automatisch eingeloggt

### Suche nach Fahrten
1. Geben Sie Abfahrts- und Zielort ein
2. Wählen Sie ein Datum
3. Geben Sie die Anzahl der benötigten Plätze an
4. Klicken Sie auf "Fahrten suchen"

### Buchung
1. Wählen Sie eine Fahrt aus den Suchergebnissen
2. Wählen Sie die Anzahl der Plätze
3. Überprüfen Sie die Details
4. Bestätigen Sie die Buchung

### Buchungen verwalten
1. Navigieren Sie zu "Buchungen"
2. Sehen Sie alle Ihre Buchungen
3. Filtern Sie nach Status
4. Bestätigen oder stornieren Sie Buchungen

## Design-Prinzipien

- **Apple-inspiriert**: Minimalistisch, elegant, clean
- **Mobile-First**: Optimiert für mobile Geräte, dann Desktop
- **Sanfte Animationen**: Subtile Übergänge und Hover-Effekte
- **Klare Hierarchie**: Typografie und Spacing für bessere Lesbarkeit
- **Intuitive Navigation**: Einfache und verständliche Benutzerführung

## Browser-Unterstützung

- Chrome (neueste 2 Versionen)
- Firefox (neueste 2 Versionen)
- Safari (neueste 2 Versionen)
- Edge (neueste 2 Versionen)

## Lizenz

Privates Projekt
