/**
 * Represents a tip
 */
declare class tip {
	/** Amount of tip */
	public readonly amount: number;
	/** Message in tip */
	public readonly message: string;
	/** User who received tip */
	public readonly to_user: string;
	/** User who sent tip */
	public readonly from_user: string;
	/** Is the user in the broadcasters fan club */
	public readonly from_user_in_fanclub: boolean;
	/** Does the user have at least 1 token? */
	public readonly from_user_has_tokens: boolean;
	/** Is the user a moderator? */
	public readonly from_user_is_mod: boolean;
	/** Is the user a "dark blue"? */
	public readonly from_user_tipped_recently: boolean;
	/** Is the user a "purple"? */
	public readonly from_user_tipped_alot_recently: boolean;
	/** Is the user a "dark purple"? */
	public readonly from_user_tipped_tons_recently: boolean;
	/** Gender of the tipper */
	public readonly from_user_gender: boolean;
}