import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import ListItemButton from '@mui/material/ListItemButton';
import { Player } from '../PlayerApi';

type PlayerListItemPropsType = {
	player: Player;
};

/**
 * The player list item.
 */
function PlayerListItem(props: PlayerListItemPropsType) {
	const { player } = props;

	return (
		<>
			<ListItemButton
				className="px-8 py-4"
				sx={{ bgcolor: 'background.paper' }}
				component={NavLinkAdapter}
				to={`/player/${ player.id}`}
			>
				<ListItemAvatar>
					<Avatar
						alt={ player.first_name }
																		
					/>
				</ListItemAvatar>
				<ListItemText
					classes={{ root: 'm-0', primary: 'font-medium leading-5 truncate' }}
					primary={ player.first_name }
					secondary={
						<Typography
							className="inline"
							component="span"
							variant="body2"
							color="text.secondary">
							{ player.first_name },{ player.last_name },{ player.jersey_number }										    
						</Typography>
					}
				/>				
			</ListItemButton>
			<Divider />
		</>
	);
}

export default PlayerListItem;