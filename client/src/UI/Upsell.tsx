import * as React from "react";
import {BackerType} from "../Global/AuthDataStore";
import {Button, Typography} from "@material-ui/core";
import styles from "./Upsell.module.scss";
import withStyles from "@material-ui/core/styles/withStyles";

interface IUpsellProps
{
	levelRequired: BackerType;
}

interface DefaultProps
{
}

type Props = IUpsellProps & DefaultProps;
type State = IUpsellState;

interface IUpsellState
{
}

const PatreonButton = withStyles({
	root: {
		padding: "8px 18px",
		backgroundColor: "#f96854",
		"&:hover": {
			backgroundColor: "#ff8777"
		}
	},
})(Button);

export class Upsell extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);

		this.state = {};
	}

	public render()
	{
		return (
			<div className={styles.wrapper}>
				<div className={styles.inner}>
					<Typography variant={"h5"} className={styles.title}>
						This area is reserved for <strong>{this.props.levelRequired}s</strong>
					</Typography>
					<Typography>
						Baseball Theater is fully funded by patron donations. If you enjoy the site, please consider joining to help keep the site alive!
					</Typography>
					<a className={styles.patreonButtonLink} href={"https://www.patreon.com/jakelauer"}>
						<PatreonButton className={styles.patreonJoin}>
							Join as a Patron
						</PatreonButton>
					</a>
				</div>
			</div>
		);
	}
}