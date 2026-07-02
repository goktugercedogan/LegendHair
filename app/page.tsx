import Image from "next/image";
import Link from "next/link";
import { BookingForm } from "@/components/BookingForm";
import { CookieConsent } from "@/components/CookieConsent";

const highlights = [
  ["23+", "Jahre Erfahrung"],
  ["2k+", "zufriedene Kundinnen"],
  ["1h", "klare Terminfenster"]
];

const services = [
  "Haarschnitt & Styling",
  "Coloration & Balayage",
  "Pflege & Keratin",
  "Hochsteck- und Brautfrisuren",
  "Augenbrauen & Wimpern",
  "Individuelle Beratung"
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden text-ink">
      <header className="sticky top-0 z-30 border-b border-gold/20 bg-ink/95 text-white backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          <a href="#start" className="flex items-center gap-3">
            <Image
              src="/legend-hair-logo.jpeg"
              alt="Legend Hair Logo"
              width={76}
              height={44}
              className="h-11 w-20 rounded object-cover"
              priority
            />
            <span className="font-display text-xl text-gold-soft">Legend Hair</span>
          </a>
          <div className="hidden items-center gap-6 text-sm font-medium md:flex">
            <a className="hover:text-gold-soft" href="#ueber-uns">
              Über uns
            </a>
            <a className="hover:text-gold-soft" href="#leistungen">
              Leistungen
            </a>
            <a className="hover:text-gold-soft" href="#termin">
              Termin
            </a>
            <a className="hover:text-gold-soft" href="#kontakt">
              Kontakt
            </a>
          </div>
          <a className="rounded bg-gold px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-ink" href="#termin">
            Buchen
          </a>
        </nav>
      </header>

      <section id="start" className="relative bg-ink text-white">
        <div className="absolute inset-0 opacity-30">
          <Image src="/legend-hair-logo.jpeg" alt="" fill className="object-cover" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/50" />
        <div className="relative mx-auto grid min-h-[calc(100vh-76px)] max-w-7xl items-center gap-12 px-4 py-16 md:grid-cols-[1.05fr_0.95fr] md:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold-soft">Friseur in Fürth</p>
            <h1 className="mt-5 font-display text-5xl leading-tight md:text-7xl">Legend Hair</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-200">
              Elegante Schnitte, moderne Farbtechniken und persönliche Beratung in einem Salon, der Stil und Ruhe
              verbindet.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a className="rounded bg-gold px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-ink" href="#termin">
                Termin anfragen
              </a>
              <a className="rounded border border-gold/60 px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-gold-soft" href="#leistungen">
                Leistungen
              </a>
            </div>
          </div>
          <div className="rounded border border-gold/30 bg-white/8 p-4 backdrop-blur">
            <Image
              src="/legend-hair-logo.jpeg"
              alt="Legend Hair Gold Logo"
              width={820}
              height={520}
              className="aspect-[4/3] w-full rounded object-cover"
            />
          </div>
        </div>
      </section>

      <section id="ueber-uns" className="mx-auto grid max-w-7xl gap-10 px-4 py-20 md:grid-cols-[0.8fr_1.2fr] md:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Über Legend Hair</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Handwerk, Stil und ein ruhiger Blick fürs Detail.</h2>
        </div>
        <div className="text-neutral-700">
          <p className="text-lg leading-8">
            Bei Legend Hair stehen präzise Arbeit, hochwertige Pflege und eine Beratung im Mittelpunkt, die zu Gesicht,
            Alltag und Persönlichkeit passt. Der neue Webauftritt führt Kundinnen schnell zum passenden Termin und gibt
            dem Salon eine klare, moderne digitale Visitenkarte.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {highlights.map(([value, label]) => (
              <div className="rounded border border-gold/30 bg-white p-5" key={label}>
                <p className="font-display text-3xl text-gold">{value}</p>
                <p className="mt-1 text-sm text-neutral-600">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="leistungen" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Leistungen</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Alles für Schnitt, Farbe und gepflegtes Haar.</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {services.map((service) => (
              <article className="rounded border border-neutral-200 bg-pearl p-6 transition hover:border-gold/50" key={service}>
                <div className="mb-5 h-1 w-14 bg-gold" />
                <h3 className="font-display text-2xl">{service}</h3>
                <p className="mt-3 text-sm leading-6 text-neutral-600">
                  Professionell, typgerecht und mit viel Aufmerksamkeit für ein Ergebnis, das sich natürlich anfühlt.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="termin" className="mx-auto grid max-w-7xl gap-10 px-4 py-20 md:grid-cols-[0.8fr_1.2fr] md:px-8">
        <div className="self-start md:sticky md:top-28">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Reservierung</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Einfach Termin auswählen.</h2>
          <p className="mt-5 leading-7 text-neutral-700">
            Termine dauern eine Stunde. Buchbar sind Dienstag bis Samstag zwischen 09:00 und 18:00 Uhr.
          </p>
        </div>
        <BookingForm />
      </section>

      <section className="bg-ink py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-3 md:px-8">
          {["Ruhige Atmosphäre", "Goldene Details", "Moderne Beratung"].map((item) => (
            <div className="border-l border-gold/50 pl-5" key={item}>
              <h3 className="font-display text-3xl text-gold-soft">{item}</h3>
              <p className="mt-3 text-sm leading-6 text-neutral-300">
                Ein Auftritt, der hochwertig wirkt, ohne laut zu werden.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="kontakt" className="mx-auto grid max-w-7xl gap-10 px-4 py-20 md:grid-cols-2 md:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Kontakt & Standort</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Platzhalter für die finalen Daten.</h2>
          <div className="mt-8 grid gap-3 text-neutral-700">
            <p>Telefon: [wird ergänzt]</p>
            <p>E-Mail: [wird ergänzt]</p>
            <p>Adresse: [wird ergänzt]</p>
            <p>Instagram: [wird ergänzt]</p>
          </div>
        </div>
        <div className="flex min-h-80 items-center justify-center rounded border border-gold/30 bg-white p-8 text-center">
          <div>
            <p className="font-display text-3xl text-ink">Karte nach Zustimmung</p>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              Google Maps oder ein anderer Kartendienst wird erst nach Einwilligung in externe Medien eingebettet.
            </p>
          </div>
        </div>
      </section>

      <footer className="bg-ink px-4 py-10 text-white md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Image src="/legend-hair-logo.jpeg" alt="Legend Hair Logo" width={72} height={42} className="h-10 w-16 rounded object-cover" />
            <span className="font-display text-xl text-gold-soft">Legend Hair</span>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-neutral-300">
            <Link href="/impressum">Impressum</Link>
            <Link href="/datenschutz">Datenschutzerklärung</Link>
            <Link href="/admin">Inhaber-Panel</Link>
          </div>
        </div>
      </footer>

      <CookieConsent />
    </main>
  );
}
