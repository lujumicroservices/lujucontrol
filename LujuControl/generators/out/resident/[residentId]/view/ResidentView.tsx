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
import { useGetResidentItemQuery, useGetResidentCountriesQuery } from '../../ResidentApi';
import FieldDisplay from './FieldDisplay'; // Reusable component for displaying fields

/**
 * The resident view.
 */
function ResidentView() {
	const { data: countries } = useGetResidentCountriesQuery({});

	const routeParams = useParams<{ residentId: string }>();
	const { residentId } = routeParams;
	
	const {
		data: resident,
		isLoading,
		isError
	} = useGetResidentItemQuery(residentId, {
		skip: !residentId
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
			navigate('/resident');
			dispatch(showMessage({ message: 'NOT FOUND' }));
		}, 0);

		return null;
	}

	if (!resident) {
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
							src={ resident.avatar}
							alt={ resident.first_name}
						>
							{ resident?.first_name?.charAt(0)}
						</Avatar>
						<div className="flex items-center ml-auto mb-1">
							<Button
								variant="contained"
								color="secondary"
								component={NavLinkAdapter}
								to={`/resident/${ residentId}/edit`}
							>
								<FuseSvgIcon size={20}>heroicons-outline:pencil-square</FuseSvgIcon>
								<span className="mx-2">Edit</span>
							</Button>
						</div>
					</div>

					<Typography className="mt-3 text-4xl font-bold truncate">{ resident.first_name}</Typography>

					<div className="flex flex-wrap items-center mt-2">
						{ resident?.tags?.map((id) => (
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
							icon="heroicons-solid:user-circle"
							value={ .first_name }
							format=""
							isEmail=
							isLink=
							concatenate= 						/>
						<FieldDisplay
							icon="heroicons-solid:user-circle"
							value={ .last_name }
							format=""
							isEmail=
							isLink=
							concatenate= 						/>
						<FieldDisplay
							icon="heroicons-solid:envelope"
							value={ .email }
							format=""
							isEmail=
							isLink=
							concatenate= 						/>
						<FieldDisplay
							icon="heroicons-solid:phone"
							value={ .phone }
							format=""
							isEmail=
							isLink=
							concatenate= 						/>
						<FieldDisplay
							icon="heroicons-solid:home"
							value={ .property_id }
							format=""
							isEmail=
							isLink=
							concatenate= 						/>
						<FieldDisplay
							icon="heroicons-solid:identification"
							value={ .role }
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

export default ResidentView;