import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import ListItemButton from '@mui/material/ListItemButton';
import { Users } from '../UsersApi';

type UsersListItemPropsType = {
	users: Users;
};

/**
 * The users list item.
 */
function UsersListItem(props: UsersListItemPropsType) {
	const { users } = props;

	return (
		<>
			<ListItemButton
				className="px-8 py-4"
				sx={{ bgcolor: 'background.paper' }}
				component={NavLinkAdapter}
				to={`/users/${ users.id}`}
			>
				<ListItemAvatar>
					<Avatar
						alt={ users.first_name }
																		
					/>
				</ListItemAvatar>
				<ListItemText
					classes={{ root: 'm-0', primary: 'font-medium leading-5 truncate' }}
					primary={ users.first_name }
					secondary={
						<Typography
							className="inline"
							component="span"
							variant="body2"
							color="text.secondary">
							{ users.first_name },{ users.last_name }										    
						</Typography>
					}
				/>				
			</ListItemButton>
			<Divider />
		</>
	);
}

export default UsersListItem;