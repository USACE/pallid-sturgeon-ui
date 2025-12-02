export async function getAccessFromRefresh() {
  const base = import.meta.env.VITE_IDP_URL;
  const realm = 'CWBI-DEV';
  const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT || import.meta.env.VITE_IDP_CLIENT_ID;
  const refresh = import.meta.env.VITE_OFFLINE_REFRESH_TOKEN;

  if (!base || !clientId || !refresh) return null;

  const url = `${base}/realms/${realm}/protocol/openid-connect/token`;
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: clientId,
    refresh_token: refresh,
  });

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.access_token ?? null;
}
