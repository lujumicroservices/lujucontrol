import { useGetPlayerItemQuery } from './PlayerApi';

type PlayerTitleProps = {
	playerId?: string;
};

function PlayerTitle(props: PlayerTitleProps) {
	const { playerId } = props;
	const { data: player } = useGetPlayerItemQuery(playerId, {
		skip: !playerId
	});

	return player?.first_name || 'Player';
}

export default PlayerTitle;