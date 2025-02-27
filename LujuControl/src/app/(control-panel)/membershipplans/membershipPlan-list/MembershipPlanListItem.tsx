import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import ListItemButton from '@mui/material/ListItemButton';
import { MembershipPlan } from '../MembershipPlanApi';

type MembershipPlanListItemPropsType = {
	membershipPlan: MembershipPlan;
};

/**
 * The membershipPlan list item.
 */
function MembershipPlanListItem(props: MembershipPlanListItemPropsType) {
	const { membershipPlan } = props;

	return (
		<>
			<ListItemButton
				className="px-8 py-4"
				sx={{ bgcolor: 'background.paper' }}
				component={NavLinkAdapter}
				to={`/membershipPlan/${membershipPlan.id}`}
			>
				<ListItemAvatar>
					<Avatar
						alt={membershipPlan.name}
						src={membershipPlan.avatar}
					/>
				</ListItemAvatar>
				<ListItemText
					classes={{ root: 'm-0', primary: 'font-medium leading-5 truncate' }}
					primary={membershipPlan.name}
					secondary={
						<Typography
							className="inline"
							component="span"
							variant="body2"
							color="text.secondary"
						>
							{membershipPlan.membershipPlanhip_id}
						</Typography>
					}
				/>
			</ListItemButton>
			<Divider />
		</>
	);
}

export default MembershipPlanListItem;
