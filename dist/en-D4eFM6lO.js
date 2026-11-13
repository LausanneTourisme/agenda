// src/lib/i18n/en.json
var e = "© All rights reserved", t = {
	locale: "en-gb",
	separator: "to",
	from: "From",
	start: "From",
	today: "Today",
	more: "(see the different schedules)",
	other: "Variable schedules",
	every_days: "Open daily",
	open_in: {
		hours: "Opens in {hours} hour(s)",
		minutes: "Opens in {minutes} minute(s)"
	},
	open_at: "Opens at {time}",
	open: "Opened",
	close: "Closed"
}, n = {
	title: "Big events",
	nothing: "No events found for the selected dates. Please choose other dates."
}, r = {
	title: "Events in Lausanne",
	search_section: {
		today: "Today",
		this_weekend: "This weekend",
		weekend: "Weekend",
		dates: "Dates",
		by_name_placeholder: "Search events",
		load_more: "Show more events",
		load_complete: "That's it!",
		again: "Make a new search?",
		clear: "Clear"
	},
	event_found: "{quantity} event found",
	events_found: "{quantity} events found",
	by_tags: "Categories",
	tags: {
		title: "Categories",
		display_all: "All"
	},
	tags_drawer: {
		singular: "Show {quantity} result",
		plural: "Show {quantity} results"
	},
	getting_data: "Retrieving events, please wait..."
}, i = {
	today: "Today",
	weekend: "Weekend",
	clear: "Clear"
}, a = {
	copyright: e,
	date: t,
	highlights: n,
	agenda: r,
	datepicker: i
};
export { r as agenda, e as copyright, t as date, i as datepicker, a as default, n as highlights };
