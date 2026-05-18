# Fitspire Web

Next.js frontend for the Fitspire diploma project.

## Getting Started

Create a local environment file from the example:

```powershell
Copy-Item .env.example .env.local
```

The frontend expects the ASP.NET Core backend to run on `http://localhost:5016`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5016
```

Start the frontend:

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Backend Integration

Run the backend from `fitspire-backend` with the `http` launch profile:

```powershell
dotnet run --launch-profile http
```

Backend local settings should keep:

```json
"Frontend": {
  "BaseUrl": "http://localhost:3000"
}
```

That value is used for account email links such as `/confirm-email` and `/reset-password`.
