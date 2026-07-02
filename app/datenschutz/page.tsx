import Link from "next/link";

export default function DatenschutzPage() {
  return (
    <main className="min-h-screen bg-pearl px-4 py-16 text-ink">
      <div className="mx-auto max-w-3xl rounded border border-gold/30 bg-white p-8">
        <Link className="text-sm font-bold text-gold" href="/">
          Zurück zur Startseite
        </Link>
        <h1 className="mt-6 font-display text-4xl">Datenschutzerklärung</h1>
        <div className="mt-8 grid gap-5 leading-7 text-neutral-700">
          <p>
            Diese Demo enthält Platzhaltertexte. Vor Veröffentlichung müssen Verantwortliche, Kontaktinformationen,
            Hosting, Supabase, Cookies, externe Medien und Betroffenenrechte final juristisch geprüft und ergänzt
            werden.
          </p>
          <h2 className="font-display text-2xl text-ink">Reservierungsdaten</h2>
          <p>
            Für Terminanfragen werden Name, Telefonnummer, optional E-Mail, Dienstleistung, Datum, Uhrzeit und optionale
            Nachricht verarbeitet.
          </p>
          <h2 className="font-display text-2xl text-ink">Cookies und externe Medien</h2>
          <p>
            Notwendige Cookies dienen dem Betrieb der Website. Analyse und externe Medien werden nur nach Einwilligung
            geladen.
          </p>
        </div>
      </div>
    </main>
  );
}
