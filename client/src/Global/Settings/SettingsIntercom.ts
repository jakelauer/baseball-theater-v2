import {Intercom} from "../Intercom/intercom";
import {ITeams} from "../../../../baseball-theater-engine/contract";
import {GameTabs} from "../Routes/Routes";

export interface ISettingsIntercomPayload
{
	favoriteTeams: (keyof ITeams)[];
	defaultGameTab: GameTabs;
	hideScores: boolean;
}

class SettingsIntercom extends Intercom<ISettingsIntercomPayload>
{
	private static LocalStorageKey = "settings";

	public static Instance = new SettingsIntercom(SettingsIntercom.getInitialState());

	private static getInitialState(): ISettingsIntercomPayload
	{
		const stored = this.restore();

		return stored || {
			defaultGameTab: "Highlights",
			favoriteTeams: [],
			hideScores: false
		};
	}

	protected update(data: Partial<ISettingsIntercomPayload>)
	{
		super.update(data);

		this.store();
	}

	public setFavoriteTeams(teams: (keyof ITeams)[])
	{
		this.update({
			favoriteTeams: teams
		});
	}

	public setHideScores(hideScores: boolean)
	{
		this.update({
			hideScores
		})
	}

	private store()
	{
		localStorage.setItem(SettingsIntercom.LocalStorageKey, JSON.stringify(this.state));
	}

	private static restore()
	{
		const storedSettingsString = localStorage.getItem(SettingsIntercom.LocalStorageKey);
		if (!storedSettingsString)
		{
			return;
		}

		return JSON.parse(storedSettingsString) as ISettingsIntercomPayload;
	}
}

export default SettingsIntercom.Instance;