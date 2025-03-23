import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import ListItemButton from '@mui/material/ListItemButton';
import { Maintenance } from '../MaintenanceApi';

type MaintenanceListItemPropsType = {
	maintenance: Maintenance;
};

/**
 * The maintenance list item.
 */
function MaintenanceListItem(props: MaintenanceListItemPropsType) {
	const { maintenance } = props;

	return (
		<>
			<ListItemButton
				className="px-8 py-4"
				sx={{ bgcolor: 'background.paper' }}
				component={NavLinkAdapter}
				to={`/maintenance/${ maintenance.id}`}
			>
				<ListItemAvatar>
					<Avatar
						alt={ maintenance.first_name}
						src={ maintenance.avatar}
					/>
				</ListItemAvatar>
				<ListItemText
					classes={{ root: 'm-0', primary: 'font-medium leading-5 truncate' }}
					primary={ maintenance.first_name}
					secondary={
						<Typography
							className="inline"
							component="span"
							variant="body2"
							color="text.secondary"
						>
							{ maintenance.membership_id}
						</Typography>
					}
				/>
			</ListItemButton>
			<Divider />
		</>
	);
}

export default MaintenanceListItem;