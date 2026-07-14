// German legal starter templates for the public pages. These are non-binding
// drafts. The operator must fill in the real Impressum data and have the texts
// checked before relying on them. Used by seed.mts and populate-legal.mjs.

const impressum = `## Angaben gemäß § 5 TMG

[Vor- und Nachname]
[Straße und Hausnummer]
[PLZ und Ort]
Deutschland

## Kontakt

E-Mail: [deine E-Mail-Adresse]
Telefon: [optional]

## Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV

[Vor- und Nachname], Anschrift wie oben

## Haftung für Inhalte

Die Inhalte dieser Seite habe ich mit Sorgfalt erstellt. Für die Richtigkeit und Vollständigkeit kann ich aber keine Gewähr übernehmen. Für eigene Inhalte auf diesen Seiten bin ich nach den allgemeinen Gesetzen verantwortlich. Ich bin nicht verpflichtet, fremde Informationen zu überwachen oder nach Umständen zu suchen, die auf eine rechtswidrige Tätigkeit hinweisen.

## Haftung für Links

Diese Seite verweist auf externe Websites Dritter, zum Beispiel auf Spotify, YouTube, SoundCloud oder Bandcamp. Auf deren Inhalte habe ich keinen Einfluss. Für die Inhalte der verlinkten Seiten ist immer der jeweilige Anbieter verantwortlich.

## Urheberrecht

Die von mir erstellten Inhalte und Werke auf dieser Seite unterliegen dem deutschen Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet.

## Hinweis

Diese Vorlage ist unverbindlich und ersetzt keine Rechtsberatung. Bitte trage deine echten Daten ein und lass die Angaben im Zweifel prüfen.
`;

const datenschutz = `## Verantwortlicher

Verantwortlich für die Datenverarbeitung auf dieser Website:

[Vor- und Nachname]
[Anschrift]
E-Mail: [deine E-Mail-Adresse]

## Überblick

Diese Website ist eine persönliche Linksammlung. Sie wird selbst gehostet und kommt ohne Analyse-Cookies und ohne Werbe-Tracking aus. Personenbezogene Daten verarbeite ich nur, soweit das für den Betrieb der Seite technisch nötig ist.

## Server-Logfiles

Beim Aufruf der Seite erfasst der Server automatisch Informationen, die dein Browser übermittelt. Das sind in der Regel:

- IP-Adresse
- Datum und Uhrzeit des Zugriffs
- die aufgerufene Adresse
- Browser und Betriebssystem
- die zuvor besuchte Seite (Referrer)

Diese Daten brauche ich für einen sicheren und stabilen Betrieb der Website. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse). Die Logs lösche ich nach kurzer Zeit, außer ich brauche sie zur Aufklärung einer Störung oder eines Angriffs.

## Hosting

Die Website läuft auf einem selbst betriebenen Server. Es werden keine Daten an einen externen Hosting-Dienstleister weitergegeben, die über den normalen Betrieb hinausgehen.

## Eingebettete Inhalte von Drittanbietern

Auf der Seite sind Inhalte von Streaming-Diensten eingebettet, zum Beispiel von Spotify, YouTube, SoundCloud, Apple Music und Bandcamp. Diese Inhalte laden erst, wenn sie beim Scrollen in den sichtbaren Bereich kommen oder wenn du sie anklickst. Sobald ein solcher Inhalt lädt, baut dein Browser eine Verbindung zu den Servern des Anbieters auf und übermittelt dabei mindestens deine IP-Adresse. Auf diese Verarbeitung habe ich keinen Einfluss. Es gelten die Datenschutzbestimmungen des jeweiligen Anbieters:

- Spotify: https://www.spotify.com/de/legal/privacy-policy/
- YouTube (Google): https://policies.google.com/privacy
- SoundCloud: https://soundcloud.com/pages/privacy
- Apple Music: https://www.apple.com/legal/privacy/
- Bandcamp: https://bandcamp.com/privacy

## Externe Links

Wenn du auf einen Link klickst, verlässt du diese Seite. Für die Datenverarbeitung auf der Zielseite ist der jeweilige Anbieter verantwortlich.

## Deine Rechte

Du hast das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung. Du kannst außerdem der Verarbeitung widersprechen und die Übertragung deiner Daten verlangen. Wende dich dafür an die oben genannte Adresse. Du kannst dich auch bei einer Datenschutz-Aufsichtsbehörde beschweren.

## SSL- und TLS-Verschlüsselung

Die Seite überträgt Daten verschlüsselt. Eine verschlüsselte Verbindung erkennst du am "https" in der Adresszeile deines Browsers.

## Hinweis

Diese Datenschutzerklärung ist eine unverbindliche Vorlage und ersetzt keine Rechtsberatung. Bitte passe sie an deine tatsächliche Datenverarbeitung an und lass sie im Zweifel prüfen.
`;

const agb = `## 1. Geltungsbereich

Diese Bedingungen gelten für die Nutzung dieser Website und der darüber erreichbaren Inhalte.

## 2. Leistung

Die Seite ist eine persönliche Linksammlung. Sie verweist auf Profile, Musik und andere Inhalte des Betreibers auf externen Plattformen. Einen Anspruch auf ständige Verfügbarkeit der Seite gibt es nicht.

## 3. Inhalte und Rechte

Eigene Texte, Bilder, Logos und Musik auf oder hinter dieser Seite sind urheberrechtlich geschützt. Eine Nutzung außerhalb der gesetzlich erlaubten Fälle ist nur mit vorheriger Zustimmung des Betreibers erlaubt.

## 4. Externe Links und eingebettete Inhalte

Die Seite bindet Inhalte von Drittanbietern ein und verlinkt auf externe Seiten. Für diese Inhalte ist der jeweilige Anbieter verantwortlich. Der Betreiber haftet dafür nicht.

## 5. Haftung

Der Betreiber haftet nicht für Schäden aus der Nutzung oder Nichtverfügbarkeit der Seite, soweit kein Vorsatz oder grobe Fahrlässigkeit vorliegt.

## 6. Änderungen

Der Betreiber kann diese Bedingungen und die Inhalte der Seite jederzeit anpassen.

## 7. Schlussbestimmungen

Es gilt deutsches Recht. Sollte eine Bestimmung unwirksam sein, bleiben die übrigen Bestimmungen davon unberührt.

## Hinweis

Diese AGB sind eine unverbindliche Vorlage und ersetzen keine Rechtsberatung. Bitte prüfe sie vor der Verwendung.
`;

export const LEGAL_PAGES = [
  { slug: "impressum", title: "Impressum", content: impressum },
  { slug: "datenschutz", title: "Datenschutzerklärung", content: datenschutz },
  { slug: "agb", title: "AGB", content: agb },
];

export const DEFAULT_TICKER_ITEMS = [
  "Neue Musik ist draußen",
  "Live in diesem Frühjahr",
  "Booking offen",
];
