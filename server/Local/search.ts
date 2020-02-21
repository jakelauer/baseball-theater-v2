import fs from "fs";
import path from "path";
import {IHighlightSearchItem} from "../../baseball-theater-engine/contract";

class SearchInternal
{
	public static Instance = new SearchInternal();
	private allHighlights: IHighlightSearchItem[] = [];
	private loadedFilesSizes: { [key: string]: number } = {};

	public initialize()
	{
		this.loadIntoMemory();
	}

	private loadTimer = () =>
	{
		setTimeout(() => this.loadIntoMemory(), 1000 * 60 * 10);
	};

	private loadIntoMemory()
	{
		console.log("Loading highights at " + Date.now());

		const files = fs.readdirSync("C:/highlightdata");
		files.reverse().forEach(file =>
		{
			try
			{
				const filePath = path.join("C:/highlightdata", file);
				const stats = fs.statSync(filePath);
				const fileSizeInBytes = stats["size"];
				const knownFileSizeBytes = this.loadedFilesSizes[filePath] ?? -1;
				if (knownFileSizeBytes !== fileSizeInBytes)
				{
					const fileJson = fs.readFileSync(filePath);
					const fileHighlights = JSON.parse(fileJson.toString()) as IHighlightSearchItem[];
					const newHighlights = fileHighlights.filter(h => this.allHighlights.indexOf(h) === -1);
					this.allHighlights.push(...newHighlights);

					this.loadedFilesSizes[filePath] = fileSizeInBytes;
				}
			}
			catch (e)
			{
				console.error(e);
			}
		});

		this.loadTimer();
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