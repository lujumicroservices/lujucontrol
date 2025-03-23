'use client';

import Button from '@mui/material/Button';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { useParams } from 'next/navigation';
import FuseLoading from '@fuse/core/FuseLoading';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/system/Box';
import _ from 'lodash';
import TextField from '@mui/material/TextField';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { useAppDispatch } from 'src/store/hooks';
import useNavigate from '@fuse/hooks/useNavigate';
import { useGetSettingsItemQuery, useGetSettingsCountriesQuery } from '../../SettingsApi';


/**
 * The settings view.
 */
function SettingsView() {
	

	const routeParams = useParams<{ settingsId: string }>();
	const { settingsId } = routeParams;
	
	const {
		data: settings,
		isLoading,
		isError
	} = useGetSettingsItemQuery(settingsId, {
		skip: !settingsId
	});
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	

	if (isLoading) {
		return <FuseLoading className="min-h-screen" />;
	}

	if (isError) {
		setTimeout(() => {
			navigate('/settings');
			dispatch(showMessage({ message: 'NOT FOUND' }));
		}, 0);

		return null;
	}

	if (!settings) {
		return null;
	}

	return (
		<>
			<Box
				className="relative w-full h-40 sm:h-48 px-8 sm:px-12"
				sx={{
					backgroundColor: 'background.default'
				}}
			>
				<img
					className="absolute inset-0 object-cover w-full h-full"
					src="/assets/images/cards/settings.jpeg"
					alt="user background"
				/>
			</Box>

			<div className="relative flex flex-col flex-auto items-center p-6 pt-0 sm:p-12 sm:pt-0">
				<div className="w-full max-w-5xl">
					<div className="flex flex-auto items-end -mt-16">
						<Avatar
							sx={{
								borderWidth: 4,
								borderStyle: 'solid',
								borderColor: 'background.paper',
								backgroundColor: 'background.default',
								color: 'text.secondary',
							}}
							className="w-32 h-32 text-16 font-bold"
							src={ settings.avatar}
							alt={ settings.name}
						>
							{ settings?.name?.charAt(0)}
						</Avatar>
						<div className="flex items-center ml-auto mb-1">
							<Button
								variant="contained"
								color="secondary"
								component={NavLinkAdapter}
								to={`/settings/${ settingsId}/edit`}
							>
								<FuseSvgIcon size={20}>heroicons-outline:pencil-square</FuseSvgIcon>
								<span className="mx-2">Edit</span>
							</Button>
						</div>
					</div>

					<Typography className="mt-3 text-4xl font-bold truncate">{ settings.name}</Typography>

					<div className="flex flex-wrap items-center mt-2">
						{ settings?.tags?.map((id) => (
							<Chip
								key={id}
								label={_.find(tags, { id })?.title}
								className="mr-3 mb-3"
								size="small"
							/>
						))}
					</div>

					<Divider className="mt-4 mb-6" />

					<div className="flex flex-col space-y-8">

							<div className="field-group">
								<Typography variant="h6" sx={{ 
										fontWeight: 'bold', mb: 2 
									}}
								>
									<FuseSvgIcon size={20} className="mr-2">heroicons-outline:collection</FuseSvgIcon>
									payments
								</Typography>
								<Divider className="mb-4" />
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<TextField
											label="Description"
											value={ settings.description }
											variant="outlined"
											fullWidth
											disabled
											InputProps={{
												readOnly: true,
												startAdornment: (
													<InputAdornment position="start">
														<FuseSvgIcon size={20}></FuseSvgIcon>
													</InputAdornment>
												)
											}}
										/>
										<TextField
											label="Monthly Cost"
											value={ settings.monthly_cost }
											variant="outlined"
											fullWidth
											disabled
											InputProps={{
												readOnly: true,
												startAdornment: (
													<InputAdornment position="start">
														<FuseSvgIcon size={20}>heroicons-solid:currency-dollar</FuseSvgIcon>
													</InputAdornment>
												)
											}}
										/>
										<TextField
											label="Annual Cost"
											value={ settings.annual_cost }
											variant="outlined"
											fullWidth
											disabled
											InputProps={{
												readOnly: true,
												startAdornment: (
													<InputAdornment position="start">
														<FuseSvgIcon size={20}>heroicons-solid:currency-dollar</FuseSvgIcon>
													</InputAdornment>
												)
											}}
										/>
										<TextField
											label="Default Payment Due Day"
											value={ settings.default_payment_due_day }
											variant="outlined"
											fullWidth
											disabled
											InputProps={{
												readOnly: true,
												startAdornment: (
													<InputAdornment position="start">
														<FuseSvgIcon size={20}>heroicons-solid:calendar</FuseSvgIcon>
													</InputAdornment>
												)
											}}
										/>
										<TextField
											label="Max Late Payment Days"
											value={ settings.max_late_days }
											variant="outlined"
											fullWidth
											disabled
											InputProps={{
												readOnly: true,
												startAdornment: (
													<InputAdornment position="start">
														<FuseSvgIcon size={20}>heroicons-solid:clock</FuseSvgIcon>
													</InputAdornment>
												)
											}}
										/>
										<TextField
											label="Late Fee Percentage"
											value={ settings.late_fee_percentage }
											variant="outlined"
											fullWidth
											disabled
											InputProps={{
												readOnly: true,
												startAdornment: (
													<InputAdornment position="start">
														<FuseSvgIcon size={20}>heroicons-solid:percent</FuseSvgIcon>
													</InputAdornment>
												)
											}}
										/>
								</div>
							</div>
							<div className="field-group">
								<Typography variant="h6" sx={{ 
										fontWeight: 'bold', mb: 2 
									}}
								>
									<FuseSvgIcon size={20} className="mr-2">heroicons-outline:collection</FuseSvgIcon>
									general
								</Typography>
								<Divider className="mb-4" />
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								</div>
							</div>
				
					</div>
				</div>
			</div>
		</>
	);
}

export default SettingsView;