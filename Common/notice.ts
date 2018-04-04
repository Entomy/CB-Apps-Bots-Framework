/**
 * Manages notices, especially buffering notices
 */
namespace notice {
	"use strict";

	/**
	 * Color to use in notices, if none specified
	 */
	export let color: string = "#000000";

	/**
	 * Buffer of notices that haven't been posted
	 */
	let buffer: string[] = [];

	/**
	 * Add the notice to the buffer
	 * @param notice Notice to add
	 */
	export function add(notice: string): void {
		buffer[buffer.length] = notice;
	}

	/**
	 * Add the notices to the buffer
	 * @param notices Notices to add
	 */
	export function adds(...notices: string[]): void {
		for (let notice of notices) {
			add(notice);
		}
	}

	/**
	 * Apply the emblem to each notice in the buffer
	 * @param emblem Emblem to apply
	 */
	export function apply(emblem: string): void {
		for (let notice of buffer) {
			notice = emblem + notice;
		}
	}

	/**
	 * Clear the buffer
	 */
	export function clear(): void {
		buffer = [];
	}

	/**
	 * Print the help menu for notices
	 * @param message Requesting message
	 */
	export function help(message: message): void {
		if (permissions.isAtLeastModerator(message)) {
			add("/note,notice <Message> --Send a notice to chat");
			post(message.user);
		}
	}

	/**
	 * Post all notices in the buffer
	 * @param to User to send to
	 * @param textcolor Color of the text
	 * @param weight Weight of the font
	 * @param autoclear Clear the buffer automatically
	 */
	export function post(to: string = "", textcolor: string = color, weight: weight = "bold", autoclear: boolean = true): void {
		let message: string = buffer.join("\n");
		cb.sendNotice(message, to, "#FFFFFF", textcolor, weight);
		if (autoclear) clear();
	}

	/**
	 * Post all notices in the buffer
	 * @param to Group to send to
	 * @param textcolor Color of the text
	 * @param weight Weight of the font
	 */
	export function postGroup(to: group, textcolor: string = color, weight: weight = "bold", autoclear: boolean = true): void {
		let message: string = buffer.join("\n");
		cb.sendNotice(message, "", "#FFFFFF", textcolor, weight, to);
		if (autoclear) clear();
	}

	/**
	 * Send a notice
	 * @param message Message to send
	 * @param to User to send to
	 * @param textcolor Color of the text
	 * @param weight Weight of the font
	 */
	export function send(message: string, to: string = "", textcolor: string = color, weight: weight = "bold"): void {
		cb.sendNotice(message, to, "#FFFFFF", textcolor, weight);
	}

	/**
	 * Send a notice
	 * @param message Message to send
	 * @param to Group to send to
	 * @param textcolor Color of the text
	 * @param weight Weight of the font
	 */
	export function sendGroup(message: string, to: group, textcolor: string = color, weight: weight = "bold"): void {
		cb.sendNotice(message, "", "#FFFFFF", textcolor, weight, to);
	}

	/**
	 * Try to parse a valid notice command, returning true if a valid command is found
	 * @param message Requesting message
	 */
	export function tryParse(message: message): boolean {
		if (permissions.isAtLeastModerator(message)) {
			let m: string[] = message.m.split(" ");
			if (m.length === 0) return false;
			let command: string = m.shift().toLowerCase();
			switch (command) {
				case "/note":
				case "/notice":
					send(emblems.notice + m.join(" "));
					return true;
				default:
					return false;
			}
		}
		return false;
	}
}

