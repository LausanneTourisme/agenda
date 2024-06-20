const e = "© Alle Rechte vorbehalten", n = {
  locale: "de",
  separator: "bis",
  from: "Ab",
  start: "Vom",
  today: "Heute",
  more: "(siehe die verschiedenen Zeitpläne)",
  other: "Variable Zeitpläne",
  every_days: "Täglich geöffnet",
  open_in: {
    hours: "Öffnet in {hours} Stunde(n)",
    minutes: "Öffnet in {minutes} Minute(n)"
  },
  open_at: "Öffnet um {time}",
  open: "Offen",
  close: "Geschlossen"
}, t = {
  title: "Highlights",
  nothing: "Keine Veranstaltungen für die ausgewählten Daten gefunden. Bitte wählen Sie andere Daten."
}, a = {
  title: "Veranstaltungen in Lausanne",
  search_section: {
    today: "Heute",
    this_weekend: "Dieses Wochenende",
    weekend: "Wochenende",
    dates: "Daten",
    by_name_placeholder: "Veranstaltung suchen",
    load_more: "Weitere Veranstaltungen anzeigen",
    load_complete: "Das wärs!",
    again: "Neue Suche durchführen?",
    clear: "Löschen"
  },
  event_found: "{quantity} Ergebnis anzeigen",
  events_found: "{quantity} Ergebnisse anzeigen",
  by_tags: "Kategorien",
  tags: {
    title: "Kategorien",
    display_all: "Alle"
  },
  tags_drawer: {
    singular: "Zeige {quantity} Ergebnis",
    plural: "Zeige {quantity} Ergebnisse"
  },
  getting_data: "Die Veranstaltungen werden abgerufen, bitte warten ..."
}, i = {
  today: "Heute",
  weekend: "Wochenende",
  clear: "Löschen"
}, s = {
  copyright: e,
  date: n,
  highlights: t,
  agenda: a,
  datepicker: i
};
export {
  a as agenda,
  e as copyright,
  n as date,
  i as datepicker,
  s as default,
  t as highlights
};
