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
import Box from '@mui/system/Box';
import _ from 'lodash';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { useAppDispatch } from 'src/store/hooks';
import useNavigate from '@fuse/hooks/useNavigate';
import { useGetMaintenanceItemQuery, useGetMaintenanceCountriesQuery } from '../../MaintenanceApi';
import FieldDisplay from './FieldDisplay'; // Reusable component for displaying fields

/**
 * The maintenance view.
 */
function MaintenanceView() {
	const { data: countries } = useGetMaintenanceCountriesQuery({});

	const routeParams = useParams<{ maintenanceId: string }>();
	const { maintenanceId } = routeParams;
	
	const {
		data: maintenance,
		isLoading,
		isError
	} = useGetMaintenanceItemQuery(maintenanceId, {
		skip: !maintenanceId
	});
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	function getCountryByIso(iso: string) {
		return countries?.find((country) => country.iso === iso);
	}

	if (isLoading) {
		return <FuseLoading className="min-h-screen" />;
	}

	if (isError) {
		setTimeout(() => {
			navigate('/maintenance');
			dispatch(showMessage({ message: 'NOT FOUND' }));
		}, 0);

		return null;
	}

	if (!maintenance) {
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
					src="/assets/images/cards/default-bk.jpg"
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
							src={ maintenance.avatar}
							alt={ maintenance.first_name}
						>
							{ maintenance?.first_name?.charAt(0)}
						</Avatar>
						<div className="flex items-center ml-auto mb-1">
							<Button
								variant="contained"
								color="secondary"
								component={NavLinkAdapter}
								to={`/maintenance/${ maintenanceId}/edit`}
							>
								<FuseSvgIcon size={20}>heroicons-outline:pencil-square</FuseSvgIcon>
								<span className="mx-2">Edit</span>
							</Button>
						</div>
					</div>

					<Typography className="mt-3 text-4xl font-bold truncate">{ maintenance.first_name}</Typography>

					<div className="flex flex-wrap items-center mt-2">
						{ maintenance?.tags?.map((id) => (
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
						<FieldDisplay
							icon="heroicons-solid:home"
							value={ .property_id }
							format=""
							isEmail=
							isLink=
							concatenate= 						/>
						<FieldDisplay
							icon="heroicons-solid:wrench"
							value={ .issue_type }
							format=""
							isEmail=
							isLink=
							concatenate= 						/>
						<FieldDisplay
							icon="heroicons-solid:document-text"
							value={ .description }
							format=""
							isEmail=
							isLink=
							concatenate= 						/>
						<FieldDisplay
							icon="heroicons-solid:check-circle"
							value={ .status }
							format=""
							isEmail=
							isLink=
							concatenate= 						/>
					</div>
				</div>
			</div>
		</>
	);
}

export default MaintenanceView;