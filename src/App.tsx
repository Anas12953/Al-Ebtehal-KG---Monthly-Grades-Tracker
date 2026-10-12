import React, { useState, useEffect } from 'react';
import { UserSession, Language, Theme, StudentRecord } from './types';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';

export default function App() {
  const [session, setSession] = useState<UserSession | null>(() => {
    try {
      const stored = localStorage.getItem('ebtehal_session');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse stored session');
    }
    return null;
  });

  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('ebtehal_lang') as Language) || 'ar';
  });

  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('ebtehal_theme') as Theme) || 'light';
  });

  // Sync HTML directionality and language attributes
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('ebtehal_lang', lang);
  }, [lang]);

  // Sync HTML dark mode class and attribute
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }
    try {
      localStorage.setItem('ebtehal_theme', theme);
    } catch (e) {
      console.warn('Failed to save theme in localStorage');
    }
  }, [theme]);

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLoginSuccess = (newSession: UserSession) => {
    setSession(newSession);
    try {
      localStorage.setItem('ebtehal_session', JSON.stringify(newSession));
    } catch (e) {
      console.warn('Failed to save session to localStorage');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    if (session?.token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        });
      } catch (e) {
        console.warn('Logout request failed');
      }
    }
    setSession(null);
    localStorage.removeItem('ebtehal_session');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      {!session ? (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          lang={lang}
          onToggleLang={handleToggleLang}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />
      ) : (
        <DashboardPage
          student={session.student as StudentRecord}
          token={session.token}
          onLogout={handleLogout}
          lang={lang}
          onToggleLang={handleToggleLang}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />
      )}
    </div>
  );
}
