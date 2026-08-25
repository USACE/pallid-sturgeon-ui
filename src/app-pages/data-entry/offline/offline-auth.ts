import { db } from './db';

const OFFLINE_AUTH_KEY = 'offlineFieldAuthSession';
const OFFLINE_AUTH_DAYS = 7;

export interface OfflineAuthSession {
  accessToken?: string;
  refreshToken?: string;
  authData: any;
  roles: any[];
  createdAt: string;
  expiresAt: string;
}

export const saveOfflineAuthSession = async ({
  accessToken,
  refreshToken,
  authData,
  roles,
}: {
  accessToken?: string;
  refreshToken?: string;
  authData: any;
  roles?: any[];
}) => {
  const createdAt = new Date();

  const expiresAt = new Date(createdAt.getTime() + OFFLINE_AUTH_DAYS * 24 * 60 * 60 * 1000);

  const session: OfflineAuthSession = {
    accessToken,
    refreshToken,
    authData,
    roles: roles ?? [],
    createdAt: createdAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  await db.meta.put({
    key: OFFLINE_AUTH_KEY,
    value: JSON.stringify(session),
  });
  return session;
};

export const getOfflineAuthSession = async (): Promise<OfflineAuthSession | null> => {
  const record = await db.meta.get(OFFLINE_AUTH_KEY);
  if (!record?.value) {
    return null;
  }

  try {
    return JSON.parse(record.value);
  } catch {
    return null;
  }
};

export const isOfflineAuthSessionValid = (session: OfflineAuthSession | null | undefined) => {
  if (!session?.expiresAt) {
    return false;
  }

  return Date.now() < new Date(session.expiresAt).getTime();
};

export const clearOfflineAuthSession = async () => {
  await db.meta.delete(OFFLINE_AUTH_KEY);
};
