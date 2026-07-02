"use client";

import { useEffect, useState } from "react";

type Consent = {
  analytics: boolean;
  external: boolean;
};

const storageKey = "legend-hair-cookie-consent";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [consent, setConsent] = useState<Consent>({ analytics: false, external: false });

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (!saved) {
      setIsVisible(true);
      return;
    }

    setConsent(JSON.parse(saved) as Consent);
  }, []);

  function save(nextConsent: Consent) {
    localStorage.setItem(storageKey, JSON.stringify(nextConsent));
    setConsent(nextConsent);
    setIsVisible(false);
  }

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("legend-consent", { detail: consent }));
  }, [consent]);

  if (!isVisible) {
    return (
      <button
        className="fixed bottom-4 left-4 z-40 rounded border border-gold/40 bg-white px-3 py-2 text-xs font-semibold text-ink shadow-lg"
        onClick={() => setIsVisible(true)}
      >
        Cookie-Einstellungen
      </button>
    );
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl rounded border border-gold/30 bg-white p-4 shadow-2xl md:p-5">
      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Datenschutz</p>
          <h2 className="mt-1 font-display text-2xl text-ink">Cookie-Einstellungen</h2>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            Notwendige Cookies sichern die Funktion der Website. Analyse und externe Medien werden erst nach Ihrer
            Zustimmung geladen.
          </p>
          <div className="mt-4 grid gap-3 text-sm">
            <label className="flex items-center justify-between gap-4 rounded border border-neutral-200 bg-pearl px-3 py-2">
              <span>Analytics</span>
              <input
                checked={consent.analytics}
                onChange={(event) => setConsent((current) => ({ ...current, analytics: event.target.checked }))}
                type="checkbox"
              />
            </label>
            <label className="flex items-center justify-between gap-4 rounded border border-neutral-200 bg-pearl px-3 py-2">
              <span>Externe Medien, z. B. Karte oder Instagram</span>
              <input
                checked={consent.external}
                onChange={(event) => setConsent((current) => ({ ...current, external: event.target.checked }))}
                type="checkbox"
              />
            </label>
          </div>
        </div>
        <div className="grid min-w-44 gap-2">
          <button className="rounded bg-gold px-4 py-3 text-sm font-bold text-ink" onClick={() => save({ analytics: true, external: true })}>
            Alle akzeptieren
          </button>
          <button className="rounded border border-ink px-4 py-3 text-sm font-bold text-ink" onClick={() => save(consent)}>
            Auswahl speichern
          </button>
          <button className="rounded px-4 py-3 text-sm font-semibold text-neutral-600" onClick={() => save({ analytics: false, external: false })}>
            Nur notwendige
          </button>
        </div>
      </div>
    </div>
  );
}
