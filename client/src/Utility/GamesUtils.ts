import moment from "moment";

export class GamesUtils
{
	public static StartingDate = () =>
	{
		const today = moment();
		const lastSeasonEnd = moment("Oct 30, 2019");
		const nextOpeningDate = moment("Mar 26, 2020");

		return today.isBefore(nextOpeningDate) ? lastSeasonEnd : nextOpeningDate;
	}
}