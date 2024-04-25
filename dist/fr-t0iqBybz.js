const e = {
  locale: "fr-ch",
  separator: "au",
  from: "Dès",
  start: "Du"
}, t = {
  title: "Nos recommendations"
}, a = {
  title: "Agenda complet",
  "search-section": {
    today: "Aujourd'hui",
    weekend: "Ce week-end",
    date: "Date",
    "by-name-placeholder": "Rechercher un évènement...",
    "load-more": "Charger plus de résultats",
    "load-complete": "C'est fini, souhaitez-vous effectuer une nouvelle recherche ?",
    again: "Affiner ma recherche"
  },
  "event-found": "{quantity} événement correspond à ces critères",
  "events-found": "{quantity} événements correspondent à ces critères",
  "by-tags": "Par catégorie",
  tags: {
    title: "Catégories",
    "display-all": "Voir Tout"
  },
  "tags-drawer": {
    singular: "Voir le {quantity} résultat",
    plural: "Voir les {quantity} résultats"
  }
}, r = {
  date: e,
  hightlights: t,
  agenda: a
};
export {
  a as agenda,
  e as date,
  r as default,
  t as hightlights
};
