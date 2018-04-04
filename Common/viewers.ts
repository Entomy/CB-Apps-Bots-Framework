/**
 * Tracks viewers for stats purposes
 * Don't take the gender stats too seriously: people lie. This is just a curiousity.
 */
namespace viewers {
	"use strict";

	export let current: number = 0;
	export let withTokens: number = 0;
	export let inFanclub: number = 0;
	export let claimMale: number = 0;
	export let claimFemale: number = 0;
	export let claimTrans: number = 0;
	export let claimCouple: number = 0;

	export function enter(user: user): void {
		current += 1;
		if (user.has_tokens) withTokens += 1;
		if (user.in_fanclub) inFanclub += 1;
		if (user.gender == "m") claimMale += 1;
		if (user.gender == "f") claimFemale += 1;
		if (user.gender == "s") claimTrans += 1;
		if (user.gender == "c") claimTrans += 1;
	}

	export function leave(user: user): void {
		current -= 1;
		if (user.has_tokens) withTokens -= 1;
		if (user.in_fanclub) inFanclub -= 1;
		if (user.gender == "m") claimMale -= 1;
		if (user.gender == "f") claimFemale -= 1;
		if (user.gender == "s") claimTrans -= 1;
		if (user.gender == "c") claimTrans -= 1;
	}
}