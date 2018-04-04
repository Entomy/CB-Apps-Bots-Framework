/**
 * Implements whispers
 */
namespace whisper {
	"use strict";

	/**
	 * Print the help messages for whispers
	 * @param message Requesting message
	 */
	export function help(message: message): void {
		if (permissions.hasAtLeastTokens(message)) {
			notice.add("/w,whisper");
			notice.add(emblems.blank + "model <Message> --Send a message to the model");
			notice.add(emblems.blank + "mod,mods,moderator,moderators <Message> --Send a message to all moderators");
			notice.add(emblems.blank + "<User> <Message> --Send a message to the user");
			notice.post(message.user);
			notice.clear();
		}
	}

	/**
	 * Do model whisper specific stuff
	 * @param message Requesting message
	 * @param m Remaining message
	 */
	function model(message: message, m: string): void {
		// While not the case elsewhere, this command uses the permissions level to color the whisper, not just permit it.
		if (permissions.isTrusted(message))
			notice.send(emblems.whisper + message.user + ": " + m, cb.room_slug, "#802080", "bolder");
		else if (permissions.isModerator(message))
			notice.send(emblems.whisper + message.user + ": " + m, cb.room_slug, "#802020", "bolder");
		else if (permissions.isInFanclub(message))
			notice.send(emblems.whisper + message.user + ": " + m, cb.room_slug, "#208020");
		else if (permissions.hasTokens(message))
			notice.send(emblems.whisper + message.user + ": " + m, cb.room_slug, "#808080");
	}

	/**
	 * Do mod whisper specific stuff
	 * @param message Requesting message
	 * @param m Remaining message
	 */
	function mods(message: message, m: string): void {
		notice.add(emblems.whispermod + message.user + ": " + m);
		notice.post(cb.room_slug, "#802020", "bolder", false);
		notice.postGroup("red", "#802020", "bolder", false);
		notice.clear();
	}

	/**
	 * Try to parse a whisper command, returning true if a valid command is found
	 * @param message Requesting message
	 */
	export function tryParse(message: message): boolean {
		let m: string[] = message.m.split(" ");
		if (m.length === 0) return false;
		let command: string = m.shift().toLowerCase();
		switch (command) {
			case "/model":
				model(message, m.join(" "));
				notice.send(emblems.whisper + "Sent to: " + cb.room_slug, message.user);
				return true;
			case "/mod":
			case "/mods":
			case "/moderator":
			case "/moderators":
				mods(message, m.join(" "));
				notice.send(emblems.whispermod + "Sent to all moderators", message.user);
				return true;
			case "/w":
			case "/whisper":
				// Command is valid but needs further parsing, break out
				break;
			default:
				return false;
		}
		if (m.length === 0) return false;
		let target: string = m.shift().toLowerCase();
		switch (target) {
			case "help":
				//Not actually a target, but an option, so print help and return
				help(message);
				return true;
			case "model":
				model(message, m.join(" "));
				notice.send(emblems.whisper + "Sent to: " + cb.room_slug, message.user);
				return true;
			case "mod":
			case "mods":
			case "moderator":
			case "moderators":
				mods(message, m.join(" "));
				notice.send(emblems.whispermod + "Sent to all moderators", message.user);
				return true;
			default:
				if (target.toLowerCase() === cb.room_slug) { model(message, m.join(" ")); }
				else if (message.user === cb.room_slug) { notice.send(emblems.whisper + message.user + ": " + m.join(" "), target, "#804020"); }
				else { notice.send(emblems.whisper + message.user + ": " + m.join(" "), target, "#808080", "normal"); }
				notice.send(emblems.whisper + "Sent to: " + target, message.user);
				return true;
		}
	}
}

