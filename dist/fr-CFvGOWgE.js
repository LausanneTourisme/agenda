const e = "© Tous droits réservés", t = {
  locale: "fr-ch",
  separator: "au",
  from: "Dès",
  start: "Du"
}, a = {
  title: "Les grands événements",
  nothing: "Aucun événement n'a été trouvé pour les dates sélectionnées. Veuillez choisir d'autres dates."
}, n = {
  title: "Les événements à Lausanne",
  search_section: {
    today: "Aujourd'hui",
    this_weekend: "Ce week-end",
    weekend: "Week-end",
    dates: "Dates",
    by_name_placeholder: "Rechercher un évènement...",
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
}, s = {
  today: "Aujourd'hui",
  weekend: "Week-end",
  clear: "Effacer"
}, r = {
  copyright: e,
  date: t,
  highlights: a,
  agenda: n,
  datepicker: s
};
export {
  n as agenda,
  e as copyright,
  t as date,
  s as datepicker,
  r as default,
  a as highlights
};
