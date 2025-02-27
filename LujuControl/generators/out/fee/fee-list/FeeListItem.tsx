import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import ListItemButton from '@mui/material/ListItemButton';
import { Fee } from '../FeeApi';

type FeeListItemPropsType = {
	fee: Fee;
};

/**
 * The fee list item.
 */
function FeeListItem(props: FeeListItemPropsType) {
	const { fee } = props;

	return (
		<>
			<ListItemButton
				className="px-8 py-4"
				sx={{ bgcolor: 'background.paper' }}
				component={NavLinkAdapter}
				to={`/fee/${ fee.id}`}
			>
				<ListItemAvatar>
					<Avatar
						alt={ fee.first_name}
						src={ fee.avatar}
					/>
				</ListItemAvatar>
				<ListItemText
					classes={{ root: 'm-0', primary: 'font-medium leading-5 truncate' }}
					primary={ fee.first_name}
					secondary={
						<Typography
							className="inline"
							component="span"
							variant="body2"
							color="text.secondary"
						>
							{ fee.membership_id}
						</Typography>
					}
				/>
			</ListItemButton>
			<Divider />
		</>
	);
}

export default FeeListItem;