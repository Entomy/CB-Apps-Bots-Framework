/**
 * The CBJS API
 */
declare namespace cbjs {

	/**
	 * Returns true if array contains at least one instance of object
	 * @param array Array to check
	 * @param object Object to look for
	 */
	export function arrayContains(array: any[], object: any): boolean;

	/**
	 * Removes all instances of object from array and returns the new array
	 * @param array Array to remove instances from
	 * @param object Object to look for
	 */
	export function arrayRemove(array: any[], object: any): any[];
}