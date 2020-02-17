import fs from "fs";
import path from "path";
import {IHighlightSearchItem} from "../../baseball-theater-engine/contract";

class SearchInternal
{
	public static Instance = new SearchInternal();
	private allHighlights: IHighlightSearchItem[] = [];

	public initialize()
	{
		this.loadIntoMemory();
	}

	private loadIntoMemory()
	{
		const files = fs.readdirSync("C:/highlightdata");
		files.reverse().forEach(file =>
		{
			try
			{
				const filePath = path.join("C:/highlightdata", file);
				const fileJson = fs.readFileSync(filePath);
				const fileHighlights = JSON.parse(fileJson.toString()) as IHighlightSearchItem[];
				this.allHighlights.push(...fileHighlights);
			}
			catch (e)
			{
				console.error(e);
			}
		});
	}

	public doSearch(query: { text: string, gameIds?: number[] }, page = 0)
	{
		const upperWords = query.text.toUpperCase().replace(/\W/g, '').split(" ");

		const matches = this.allHighlights.filter(h =>
		{
			const checkAgainst = `${h.highlight?.headline ?? ""} ${h.highlight?.blurb ?? ""} ${h.highlight?.kicker ?? ""} ${h.highlight?.description ?? ""}`
				.replace(/\W/g, '')
				.toUpperCase();

			let matched = upperWords.every(word => checkAgainst.includes(word));

			if (query.gameIds)
			{
				matched = matched && query.gameIds.includes(h.game_pk);
			}

			return matched;
		});

		return matches.slice(page * 20, (page + 1) * 20);
	}
}

export const Search = SearchInternal.Instance;