import Avatar from '@mui/material/Avatar';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import { useState, MouseEvent } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import ToolbarMenu from './ToolbarMenu';
import { useGetScrumboardMembersQuery } from '../../../../../ScrumboardApi';

type MembersMenuProps = {
	memberIds: string[];
	onToggleMember: (memberId: string) => void;
};

/**
 * The members menu component.
 */
function MembersMenu(props: MembersMenuProps) {
	const { memberIds, onToggleMember } = props;

	const [anchorEl, setAnchorEl] = useState<null | HTMLButtonElement>(null);

	const { data: members } = useGetScrumboardMembersQuery();

	function handleMenuOpen(event: MouseEvent<HTMLButtonElement>) {
		setAnchorEl(event.currentTarget);
	}

	function handleMenuClose() {
		setAnchorEl(null);
	}

	return (
		<div>
			<IconButton
				className="rounded-none"
				onClick={handleMenuOpen}
				size="large"
			>
				<FuseSvgIcon>heroicons-outline:user-circle</FuseSvgIcon>
			</IconButton>
			<ToolbarMenu
				state={anchorEl}
				onClose={handleMenuClose}
			>
				<div>
					{members.map((member) => {
						return (
							<MenuItem
								className="px-2"
								key={member.id}
								onClick={() => {
									onToggleMember(member.id);
								}}
							>
								<Checkbox checked={memberIds.includes(member.id)} />
								<Avatar
									className="w-8 h-8"
									src={member.avatar}
								/>
								<ListItemText className="mx-2">{member.name}</ListItemText>
							</MenuItem>
						);
					})}
				</div>
			</ToolbarMenu>
		</div>
	);
}

export default MembersMenu;
