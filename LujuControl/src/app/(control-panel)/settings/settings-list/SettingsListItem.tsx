import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import ListItemButton from '@mui/material/ListItemButton';
import { Settings } from '../SettingsApi';

type SettingsListItemPropsType = {
	settings: Settings;
};

/**
 * The settings list item.
 */
function SettingsListItem(props: SettingsListItemPropsType) {
	const { settings } = props;

	return (
		<>
			<ListItemButton
				className="px-8 py-4"
				sx={{ bgcolor: 'background.paper' }}
				component={NavLinkAdapter}
				to={`/settings/${ settings.id}`}
			>
				<ListItemAvatar>
					<Avatar
						alt={ settings.description }
																		
					/>
				</ListItemAvatar>
				<ListItemText
					classes={{ root: 'm-0', primary: 'font-medium leading-5 truncate' }}
					primary={ settings.description }
					secondary={
						<Typography
							className="inline"
							component="span"
							variant="body2"
							color="text.secondary">
							{ settings.description },{ settings.monthly_cost }										    
						</Typography>
					}
				/>				
			</ListItemButton>
			<Divider />
		</>
	);
}

export default SettingsListItem;