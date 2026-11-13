// src/lib/i18n/fr.json
var e = "© Tous droits réservés", t = {
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
}, n = {
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
}, i = {
	today: "Aujourd'hui",
	weekend: "Week-end",
	clear: "Effacer"
}, a = {
	copyright: e,
	date: t,
	highlights: n,
	agenda: r,
	datepicker: i
};
export { r as agenda, e as copyright, t as date, i as datepicker, a as default, n as highlights };
