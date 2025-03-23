import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import MainProjectSelection from '@/components/MainProjectSelection';

const Root = styled('div')(({ theme }) => ({
	'& > .logo-icon': {
		transition: theme.transitions.create(['width', 'height'], {
			duration: theme.transitions.duration.shortest,
			easing: theme.transitions.easing.easeInOut
		})
	},
	'& > .badge': {
		transition: theme.transitions.create('opacity', {
			duration: theme.transitions.duration.shortest,
			easing: theme.transitions.easing.easeInOut
		})
	}
}));

/**
 * The logo component.
 */
function Logo() {
	return (
		<Root className="flex flex-1 items-center space-x-3">
			<div className="flex flex-1 items-center space-x-2 px-2.5">
				<img
					className="logo-icon h-8 w-8"
					src="/assets/images/logo/futball_logo_small.png"
					alt="logo"
				/>
				<div className="logo-text flex flex-col flex-auto gap-0.5">
					<Typography className="text-2xl tracking-light font-semibold leading-none">San</Typography>
					<Typography
						className="text-[13.6px] tracking-light font-semibold leading-none"
						color="primary"
						sx={{
							color: '#82d7f7'
						}}
					>
						Ignacio
					</Typography>
				</div>
			</div>
			
		</Root>
	);
}

export default Logo;
