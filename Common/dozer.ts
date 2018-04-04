/**
 * Provides "the dozer"; chat cleanup
 */
namespace dozer {
	"use strict";

	/**
	 * Prints the help for dozer
	 * @param message Requesting message
	 */
	export function help(message: message): void {
		if (permissions.isAtLeastModerator(message)) {
			notice.add("/doze,dozer --Clear the chat");
			notice.post(message.user);
			message['X-Spam'] = true;
		}
	}

	/**
	 * Try to parse a dozer command, returning true if a valid command is found
	 * @param message Requesting message
	 */
	export function tryParse(message: message): boolean {
		if (permissions.isAtLeastModerator(message)) {
			let m: string[] = message.m.split(" ");
			if (m.length === 0) return false;
			let command: string = m.shift().toLowerCase();
			switch (command) {
				case "/doze":
				case "/dozer":
					doze();
					return true;
				default:
					return false;
			}
		}
		return false;
	}

	/**
	 * Run the dozer
	 */
	function doze(): void {
		notice.adds(
			"\n", "\n", "\n", "\n", "\n", "\n", "\n", "\n", "\n", "\n",
			"\n", "\n", "\n", "\n", "\n", "\n", "\n", "\n", "\n", "\n",
			"\n", "\n", "\n", "\n", "\n", "\n", "\n", "\n", "\n", "\n",
			"\n", "\n", "\n", "\n", "\n", "\n", "\n", "\n", "\n", "\n");
		notice.post("", "#FFFFFF");
	}
}