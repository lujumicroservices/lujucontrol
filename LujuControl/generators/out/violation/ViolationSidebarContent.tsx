import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

type ViolationSidebarContentProps = {
	children?: React.ReactNode;
};

/**
 * The violation sidebar content.
 */
function ViolationSidebarContent({ children }: ViolationSidebarContentProps) {
	return (
		<div className="flex flex-col flex-auto max-w-full w-xl">
			<IconButton
				className="absolute top-0 right-0 my-4 mx-8 z-10"
				sx={{
					backgroundColor: 'primary.light',
					color: 'primary.contrastText',
					'&:hover': {
						backgroundColor: 'primary.main',
						color: 'primary.contrastText'
					}
				}}
				component={NavLinkAdapter}
				to="/violation"
			>
				<FuseSvgIcon>heroicons-outline:x-mark</FuseSvgIcon>
			</IconButton>

			{children}
		</div>
	);
}

export default ViolationSidebarContent;