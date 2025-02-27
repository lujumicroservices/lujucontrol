import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import ListItemButton from '@mui/material/ListItemButton';
import { Staff } from '../StaffApi';

type StaffListItemPropsType = {
	staff: Staff;
};

/**
 * The staff list item.
 */
function StaffListItem(props: StaffListItemPropsType) {
	const { staff } = props;

	return (
		<>
			<ListItemButton
				className="px-8 py-4"
				sx={{ bgcolor: 'background.paper' }}
				component={NavLinkAdapter}
				to={`/staff/${staff.id}`}
			>
				<ListItemAvatar>
					<Avatar
						alt={staff.first_name}
						src={staff.avatar}
					/>
				</ListItemAvatar>
				<ListItemText
					classes={{ root: 'm-0', primary: 'font-medium leading-5 truncate' }}
					primary={staff.first_name}
					secondary={
						<Typography
							className="inline"
							component="span"
							variant="body2"
							color="text.secondary"
						>
							{staff.staffhip_id}
						</Typography>
					}
				/>
			</ListItemButton>
			<Divider />
		</>
	);
}

export default StaffListItem;
