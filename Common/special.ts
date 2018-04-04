namespace tipmenu {
	"use strict";

	/**
	 * The specials menu section
	 */
	export const specials: menusection = new menusection("Specials");

	/**
	 * Specials command handler
	 */
	export namespace special {
		/**
		 * Print the help messages for the special manager
		 * @param message Requesting message
		 */
		export function help(message: message): void {
			if (permissions.isAtLeastTrusted(message)) {
				notice.add("/special,specials");
				notice.add(emblems.blank + "add <Cost> <Name> --Add the special to the menu");
				notice.add(emblems.blank + "clr,clear --Clear all specials");
				notice.add(emblems.blank + "del,delete <Name> --Delete the special from the menu");
				notice.post(message.user);
			}
		}

		/**
		 * Try to parse a specials command, returning true if a valid command is found
		 * @param message Requesting message
		 */
		export function tryParse(message: message): boolean {
			if (!permissions.isAtLeastTrusted(message)) return false;
			let m: string[] = message.m.split(" ");
			if (m.length === 0) return false;
			let command: string = m.shift().toLowerCase();
			switch (command) {
				case "/special":
				case "/specials":
					// Command is valid, break out
					break;
				default:
					return false;
			}
			if (m.length === 0) return false;
			let operation: string = m.shift().toLowerCase();
			let name: string; // This is assigned while parsing operations
			switch (operation) {
				case "add":
					let cost = m.shift();
					if (isNaN(Number(cost))) {
						// Cost wasn't at the beginning, try finding it at the end
						m.unshift(cost);
						cost = m.pop();
						if (isNaN(Number(cost))) return false; // No cost found, not a valid command
					}
					// We've found the cost, the rest is the name
					name = m.join(" ");
					specials.add(name, Number(cost));
					notice.send(emblems.tipmenu + "'" + name + "' added as a special for " + cost + emblems.token);
					return true;
				case "clr":
				case "clear":
					specials.clear();
					notice.send(emblems.tipmenu + "All specials have been removed");
					return true;
				case "del":
				case "delete":
					name = m.join(" ");
					specials.del(name);
					notice.send(emblems.tipmenu + "'" + name + "' has been removed from the specials")
					return true;
				case "help":
					help(message);
					return true;
				default:
					return false;
			}
		}
	}
}

