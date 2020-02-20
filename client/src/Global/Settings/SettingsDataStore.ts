import {DataStore} from "../Intercom/DataStore";
import {ITeams} from "../../../../baseball-theater-engine/contract";
import {GameTabs} from "../Routes/Routes";

export interface ISettingsDataStorePayload
{
	favoriteTeams: (keyof ITeams)[];
	defaultGameTab: GameTabs;
	hideScores: boolean;
	highlightDescriptions: boolean;
}

class _SettingsDataStore extends DataStore<ISettingsDataStorePayload>
{
	private static LocalStorageKey = "settings";

	public static Instance = new _SettingsDataStore(_SettingsDataStore.getInitialState());

	private static getInitialState(): ISettingsDataStorePayload
	{
		const stored = this.restore();

		return {
			defaultGameTab: "Highlights",
			favoriteTeams: [],
			hideScores: false,
			highlightDescriptions: true,
			...stored
		};
	}

	protected update(data: Partial<ISettingsDataStorePayload>)
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

	public setShowDescriptions(show: boolean)
	{
		this.update({
			highlightDescriptions: show
		});
	}

	private store()
	{
		localStorage.setItem(_SettingsDataStore.LocalStorageKey, JSON.stringify(this.state));
	}

	private static restore()
	{
		const storedSettingsString = localStorage.getItem(_SettingsDataStore.LocalStorageKey);
		if (!storedSettingsString)
		{
			return {};
		}

		return JSON.parse(storedSettingsString) as ISettingsDataStorePayload;
	}
}

export const SettingsDataStore = _SettingsDataStore.Instance;