import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import ListItemButton from '@mui/material/ListItemButton';
import { {{moduleName}} } from '../{{moduleName}}Api';

type {{moduleName}}ListItemPropsType = {
	{{moduleNameLower}}: {{moduleName}};
};

/**
 * The {{moduleNameLower}} list item.
 */
function {{moduleName}}ListItem(props: {{moduleName}}ListItemPropsType) {
	const { {{moduleNameLower}} } = props;

	return (
		<>
			<ListItemButton
				className="px-8 py-4"
				sx=\{{ bgcolor: 'background.paper' }}
				component={NavLinkAdapter}
				to={`/{{moduleNameLower}}/${ {{moduleNameLower}}.id}`}
			>
				<ListItemAvatar>
					<Avatar
						alt={ {{moduleNameLower}}.{{groupField}} }
						{{#if avatarField}} src={ {{moduleNameLower}}.{{avatarField}} } {{/if}}												
					/>
				</ListItemAvatar>
				<ListItemText
					classes=\{{ root: 'm-0', primary: 'font-medium leading-5 truncate' }}
					primary={ {{moduleNameLower}}.{{groupField}} }
					secondary={
						<Typography
							className="inline"
							component="span"
							variant="body2"
							color="text.secondary">
							{{#each listdisplayFields}}{{#if @index}},{{/if}}{ {{../moduleNameLower}}.{{this}} }{{/each}}										    
						</Typography>
					}
				/>				
			</ListItemButton>
			<Divider />
		</>
	);
}

export default {{moduleName}}ListItem;