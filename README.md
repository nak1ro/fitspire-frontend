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

## Media uploads

Profile pictures and post images are uploaded directly from the browser to a private Azure Blob container. In local development, start your existing Azurite Blob service before the backend; the backend uses `UseDevelopmentStorage=true` by default and creates the `fitspire-media` container itself.

Configure the Blob service CORS rule to allow `http://localhost:3000`, the `PUT`, `GET`, `HEAD`, and `OPTIONS` methods, and the `Content-Type` and `x-ms-blob-type` request headers. Deployed environments must use the deployed frontend origin, HTTPS only, and an Azure Managed Identity with Blob Data Contributor permissions.
