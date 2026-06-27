import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext(null);

const USERS_KEY = "ghazi_users";
const SESSION_KEY = "ghazi_session";

async function hashPassword(password) {
  const data = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function readSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

function saveSession(session) {
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = readSession();
    if (session?.id) {
      if (session.isGuest) {
        setUser(session);
      } else {
        const found = readUsers().find((u) => u.id === session.id);
        if (found) {
          setUser({
            id: found.id,
            name: found.name,
            email: found.email,
            phone: found.phone,
            isGuest: false,
          });
        } else {
          saveSession(null);
        }
      }
    }
    setReady(true);
  }, []);

  const signup = useCallback(async ({ name, email, phone, password }) => {
    const trimmedEmail = email.trim().toLowerCase();
    const users = readUsers();

    if (users.some((u) => u.email === trimmedEmail)) {
      throw new Error("This email is already registered. Please log in.");
    }

    const passwordHash = await hashPassword(password);
    const newUser = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: trimmedEmail,
      phone: phone.trim(),
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    saveUsers([...users, newUser]);

    const session = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      isGuest: false,
    };
    saveSession(session);
    setUser(session);
    return session;
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const trimmedEmail = email.trim().toLowerCase();
    const users = readUsers();
    const found = users.find((u) => u.email === trimmedEmail);

    if (!found) {
      throw new Error("No account found with this email. Please sign up.");
    }

    const passwordHash = await hashPassword(password);
    if (found.passwordHash !== passwordHash) {
      throw new Error("Incorrect password. Please try again.");
    }

    const session = {
      id: found.id,
      name: found.name,
      email: found.email,
      phone: found.phone,
      isGuest: false,
    };
    saveSession(session);
    setUser(session);
    return session;
  }, []);

  const loginAsGuest = useCallback(() => {
    const session = {
      id: `guest-${crypto.randomUUID()}`,
      name: "Guest",
      email: "",
      phone: "",
      isGuest: true,
    };
    saveSession(session);
    setUser(session);
    return session;
  }, []);

  const logout = useCallback(() => {
    saveSession(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      ready,
      signup,
      login,
      loginAsGuest,
      logout,
      isLoggedIn: Boolean(user),
      isGuest: Boolean(user?.isGuest),
    }),
    [user, ready, signup, login, loginAsGuest, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
