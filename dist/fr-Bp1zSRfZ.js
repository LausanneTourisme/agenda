const e = "© Tous droits réservés", t = {
  locale: "fr-ch",
  separator: "au",
  from: "dès",
  start: "Du",
  today: "Aujourd'hui",
  more: "(voir les différents horaires)",
  other: "Horaires variables",
  every_days: "Ouvert tous les jours",
  open_in: {
    hours: "Ouvre dans {hours} heure(s)",
    minutes: "Ouvre dans {minutes} minute(s)"
  },
  open_at: "Ouvre à {time}",
  open: "Ouvert",
  close: "Fermé"
}, s = {
  title: "Les grands événements",
  nothing: "Aucun événement n'a été trouvé pour les dates sélectionnées. Veuillez choisir d'autres dates."
}, r = {
  title: "Les événements à Lausanne",
  search_section: {
    today: "Aujourd'hui",
    this_weekend: "Ce week-end",
    weekend: "Week-end",
    dates: "Dates",
    by_name_placeholder: "Rechercher un événement...",
    load_more: "Afficher plus d'événements",
    load_complete: "C'est tout !",
    again: "Affiner ma recherche ?",
    clear: "Effacer"
  },
  event_found: "{quantity} événement trouvé",
  events_found: "{quantity} événements trouvés",
  by_tags: "Catégories",
  tags: {
    title: "Catégories",
    display_all: "Tous"
  },
  tags_drawer: {
    singular: "Voir le {quantity} résultat",
    plural: "Voir les {quantity} résultats"
  },
  getting_data: "Récupération des événements en cours..."
}, a = {
  today: "Aujourd'hui",
  weekend: "Week-end",
  clear: "Effacer"
}, n = {
  copyright: e,
  date: t,
  highlights: s,
  agenda: r,
  datepicker: a
};
export {
  r as agenda,
  e as copyright,
  t as date,
  a as datepicker,
  n as default,
  s as highlights
};
