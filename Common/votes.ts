/** Represents a cast vote */
type vote = [string, string];

/**
 * Manages votes and ballots
 */
namespace votes {
	"use strict";

	/**
	 * The cast votes
	 */
	let casts: vote[] = [];

	/**
	 * The current ballot
	 */
	let ballot: string[] = [];

	/**
	 * Cast or change a vote, validating it in the process
	 * @param username Username of the voter
	 * @param choice Choice voting for
	 */
	export function cast(username: string, choice: string): void {
		for (let ch of ballot) {
			if (ch.toLowerCase() === choice.toLowerCase()) {
				casts[casts.length] = [username, choice];
				notice.send(emblems.ballot + "Vote cast", username);
				return;
			}
		}
		notice.send(emblems.ballot + "Your vote for '" + choice + "' was not recognized among the valid options", username);
	}

	/**
	 * Clear the cast votes and ballot
	 */
	export function clear(): void {
		casts = [];
		ballot = [];
	}

	/**
	 * Print the help messages for voting
	 * @param message Requesting message
	 */
	export function help(message: message): void {
		if (permissions.hasAtLeastTokens(message)) {
			notice.add("/vote,votes,voting <Choice> --Cast a vote for the choice");
		}
		if (permissions.isAtLeastModerator(message)) {
			notice.add(emblems.blank + "start,ballot (<Choice>,)+ --Start voting among the specified choices");
			notice.add(emblems.blank + "stop,end,tally --Stop voting, tally results, and declare the winner");
		}
		notice.post(message.user);
	}

	/**
	 * Lookup a vote cast by the user, null if not found
	 * @param username Username to look for
	 */
	export function lookup(username: string): vote {
		for (let cast of casts) {
			if (cast[0] === username) return cast;
		}
		return null;
	}

	/**
	 * Start a ballot with the specified choices
	 * @param choices Ballot choices
	 */
	export function start(choices: string[]): void {
		clear();
		for (let choice of choices) {
			ballot[ballot.length] = choice.trim();
		}
		notice.add(emblems.ballot + "A ballot has started between the following:");
		for (let choice of choices) {
			notice.add(emblems.ballot + choice);
		}
		notice.post();
		notice.clear();
	}

	/**
	 * Stop voting, count the votes, and report the winner
	 */
	export function stop(): void {
		if (casts == null || casts === []) {
			notice.send(emblems.ballot + "No votes have been cast");
			return;
		}
		for (let cast of casts) {
			tallier.add(cast[1]);
		}
		let highest: tally = tallier.highest();
		notice.send(emblems.ballot + "Winner is: '" + highest[0] + "' with " + highest[1] + " votes");
		clear();
		tallier.clear();
	}

	/**
	 * Try to parse a vote command, returning true if a valid command is found
	 * @param message Requesting message
	 */
	export function tryParse(message: message): boolean {
		let m: string[] = message.m.split(" ");
		if (m.length === 0) return false;
		let command: string = m.shift().toLowerCase();
		switch (command) {
			case "/vote":
			case "/votes":
			case "/voting":
				// Command is valid, break out
				break;
			default:
				return false;
		}
		if (m.length === 0) return false;
		let operation: string = m.shift().toLowerCase();
		switch (operation) {
			case "help":
				help(message);
				return true;
			case "start":
			case "ballot":
				if (!permissions.isAtLeastModerator(message)) return false;
				let choices: string[] = m.join(" ").split(",");
				for (let choice of choices) {
					choice = choice.trim();
				}
				start(choices);
				return true;
			case "stop":
			case "end":
			case "tally":
				if (!permissions.isAtLeastModerator(message)) return false;
				stop();
				return true;
			default:
				if (!permissions.hasAtLeastTokens(message)) return false;
				m.unshift(operation);
				cast(message.user, m.join(" "));
				return true;
		}
	}
}

