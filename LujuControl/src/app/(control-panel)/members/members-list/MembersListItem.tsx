import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import ListItemButton from '@mui/material/ListItemButton';
import { Members } from '../MembersApi';

type MembersListItemPropsType = {
	member: Members;
};

/**
 * The member list item.
 */
function MembersListItem(props: MembersListItemPropsType) {
	const { member } = props;

	return (
		<>
			<ListItemButton
				className="px-8 py-4"
				sx={{ bgcolor: 'background.paper' }}
				component={NavLinkAdapter}
				to={`/members/${member.id}`}
			>
				<ListItemAvatar>
					<Avatar
						alt={member.first_name}
						src={member.avatar}
					/>
				</ListItemAvatar>
				<ListItemText
					classes={{ root: 'm-0', primary: 'font-medium leading-5 truncate' }}
					primary={member.first_name}
					secondary={
						<Typography
							className="inline"
							component="span"
							variant="body2"
							color="text.secondary"
						>
							{member.membership_id}
						</Typography>
					}
				/>
			</ListItemButton>
			<Divider />
		</>
	);
}

export default MembersListItem;
