import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchMe, getToken, setToken } from '../api/client';
import { AuthContext } from './useAuth';

const USER_KEY = 'koyash_user';

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStoredUser(user) {
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  } catch {
    /* ignore */
  }
}

// Guest-first: the whole questionnaire works without an account. This provider
// only tracks the *optional* signed-in user, mirroring the backend's ADR-004
// model. Token + user are cached in localStorage so a reload stays signed in.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  // If there's no token we're already "ready" (a guest); otherwise we stay
  // not-ready until the stored token is validated below.
  const [ready, setReady] = useState(() => !getToken());

  // On first mount, if we hold a token, confirm it's still valid and refresh
  // the cached user. An expired/invalid token signs the user back out quietly.
  useEffect(() => {
    if (!getToken()) return;
    let cancelled = false;
    fetchMe()
      .then((me) => {
        if (cancelled) return;
        setUser(me);
        writeStoredUser(me);
      })
      .catch(() => {
        if (cancelled) return;
        setToken(null);
        writeStoredUser(null);
        setUser(null);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Called by login/register screens with the backend's TokenResponse.
  const signIn = useCallback(({ access_token, user: nextUser }) => {
    setToken(access_token);
    writeStoredUser(nextUser);
    setUser(nextUser);
  }, []);

  const signOut = useCallback(() => {
    setToken(null);
    writeStoredUser(null);
    setUser(null);
  }, []);

  // Patch the cached user after a profile edit without a full re-fetch.
  const updateUser = useCallback((patch) => {
    setUser((prev) => {
      const next = { ...(prev || {}), ...patch };
      writeStoredUser(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, ready, signIn, signOut, updateUser }),
    [user, ready, signIn, signOut, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
