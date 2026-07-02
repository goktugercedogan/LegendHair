import Link from "next/link";

export default function ImpressumPage() {
  return (
    <main className="min-h-screen bg-pearl px-4 py-16 text-ink">
      <div className="mx-auto max-w-3xl rounded border border-gold/30 bg-white p-8">
        <Link className="text-sm font-bold text-gold" href="/">
          Zurück zur Startseite
        </Link>
        <h1 className="mt-6 font-display text-4xl">Impressum</h1>
        <div className="mt-8 grid gap-4 leading-7 text-neutral-700">
          <p>Angaben gemäß § 5 TMG</p>
          <p>[Name des Unternehmens / Inhaberin]</p>
          <p>[Straße und Hausnummer]</p>
          <p>[PLZ Ort]</p>
          <p>Telefon: [wird ergänzt]</p>
          <p>E-Mail: [wird ergänzt]</p>
          <p>Umsatzsteuer-ID: [falls vorhanden]</p>
        </div>
      </div>
    </main>
  );
}
