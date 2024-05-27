const e = "© Tous droits réservés", t = {
  locale: "fr-ch",
  separator: "au",
  from: "Dès",
  start: "Du"
}, r = {
  title: "Nos recommendations",
  nothing: "Aucun événement prévu pour les dates sélectionnées. Veuillez choisir d'autres dates."
}, a = {
  title: "Agenda complet",
  search_section: {
    today: "Aujourd'hui",
    weekend: "Ce week-end",
    date: "Date",
    by_name_placeholder: "Rechercher un évènement...",
    load_more: "Charger plus de résultats",
    load_complete: "C'est fini, souhaitez-vous effectuer une nouvelle recherche ?",
    again: "Affiner ma recherche"
  },
  event_found: "{quantity} événement correspond à ces critères",
  events_found: "{quantity} événements correspondent à ces critères",
  by_tags: "Par catégorie",
  tags: {
    title: "Catégories",
    display_all: "Voir Tout"
  },
  tags_drawer: {
    singular: "Voir le {quantity} résultat",
    plural: "Voir les {quantity} résultats"
  },
  getting_data: "En cours de récupération d'événements, veuillez patienter..."
}, n = {
  today: "Aujourd'hui",
  tomorrow: "Demain",
  this_week: "Cette semaine",
  this_weekend: "Ce week-end"
}, s = {
  copyright: e,
  date: t,
  highlights: r,
  agenda: a,
  datepicker: n
};
export {
  a as agenda,
  e as copyright,
  t as date,
  n as datepicker,
  s as default,
  r as highlights
};
