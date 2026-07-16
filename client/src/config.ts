// Central API configuration
// In production, set VITE_API_URL in Vercel env vars to your Railway backend URL
// e.g. https://medgrid-production.up.railway.app/api
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
