/**
 * Manages the "hatchery"
 * This is a sort of progressional system for emblems, the more you tip, the further you progress.
 * It's so called because it was created to "hatch" baby lizards from eggs.
 */
namespace hatchery {
	"use strict";

	export let level1: string = "";
	export let level2: string = "";
	export let level3: string = "";
	export let level4: string = "";
	export let level5: string = "";
	export let level6: string = "";
	export let level7: string = "";
	export let level8: string = "";
	export let level9: string = "";
	export let level10: string = "";

	export let progression: number;

	/**
	 * Apply a hatchery emblem if applicable
	 * @param message Requesting message
	 */
	export function apply(message: message): string {
		let tipper: tipper = tippers.lookup(message.user);
		if (tipper == null) return message.m;
		if (tipper.tipped >= progression * 10) return level10 + message.m;
		else if (tipper.tipped >= progression * 9) return level9 + message.m;
		else if (tipper.tipped >= progression * 8) return level8 + message.m;
		else if (tipper.tipped >= progression * 7) return level7 + message.m;
		else if (tipper.tipped >= progression * 6) return level6 + message.m;
		else if (tipper.tipped >= progression * 5) return level5 + message.m;
		else if (tipper.tipped >= progression * 4) return level4 + message.m;
		else if (tipper.tipped >= progression * 3) return level3 + message.m;
		else if (tipper.tipped >= progression * 2) return level2 + message.m;
		else if (tipper.tipped >= progression) return level1 + message.m;
		else return message.m;
	}

}