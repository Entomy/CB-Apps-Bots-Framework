/**
 * Calculates various stats
 */
namespace stats {
	"use strict";

	export function meanHalves(sendTo: string): void {
		notice.add("Upper Mean: " + tippers.meanUpper());
		notice.add("Lower Mean: " + tippers.meanLower());
		notice.post(sendTo);
	}

	export function medianTip(sendTo: string): void {
		notice.add("Median Tip: " + tippers.median());
		notice.post(sendTo);
	}

	export function showDuration(sendTo: string): void {
		let duration: [number, number, number] = timers.showDuration();
		notice.add("Show Duration: " + duration[0] + ":" + duration[1] + ":" + duration[2]);
		notice.post(sendTo);
	}

	export function tippersTotal(sendTo: string): void {
		notice.add("Tippers Total: " + tippers.count)
		notice.post(sendTo);
	}

	export function tokensPerHour(sendTo: string): void {
		let duration: [number, number, number] = timers.showDuration();
		let minutes: number = duration[0] * 60 + duration[1];
		let rate: number = (tippers.tipped() / minutes) * 60;
		notice.add("Tokens Per Hour: " + rate);
		notice.post(sendTo);
	}

	export function tokensPerTipper(sendTo: string): void {
		notice.add("Tokens Per Tipper: " + tippers.tipped() / tippers.count());
		notice.post(sendTo);
	}

	export function tokensTotal(sendTo: string): void {
		notice.add("Tokens Total: " + tippers.tipped());
		notice.post(sendTo);
	}

}