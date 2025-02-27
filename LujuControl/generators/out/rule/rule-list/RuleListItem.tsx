import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import ListItemButton from '@mui/material/ListItemButton';
import { Rule } from '../RuleApi';

type RuleListItemPropsType = {
	rule: Rule;
};

/**
 * The rule list item.
 */
function RuleListItem(props: RuleListItemPropsType) {
	const { rule } = props;

	return (
		<>
			<ListItemButton
				className="px-8 py-4"
				sx={{ bgcolor: 'background.paper' }}
				component={NavLinkAdapter}
				to={`/rule/${ rule.id}`}
			>
				<ListItemAvatar>
					<Avatar
						alt={ rule.first_name}
						src={ rule.avatar}
					/>
				</ListItemAvatar>
				<ListItemText
					classes={{ root: 'm-0', primary: 'font-medium leading-5 truncate' }}
					primary={ rule.first_name}
					secondary={
						<Typography
							className="inline"
							component="span"
							variant="body2"
							color="text.secondary"
						>
							{ rule.membership_id}
						</Typography>
					}
				/>
			</ListItemButton>
			<Divider />
		</>
	);
}

export default RuleListItem;