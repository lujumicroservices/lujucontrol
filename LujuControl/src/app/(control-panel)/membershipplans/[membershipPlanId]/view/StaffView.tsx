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
import { format } from 'date-fns/format';
import _ from 'lodash';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { useAppDispatch } from 'src/store/hooks';
import useNavigate from '@fuse/hooks/useNavigate';
import { useGetMembershipPlanItemQuery, useGetMembershipPlanCountriesQuery , getMembershipPlanDisplayData } from '../../MembershipPlanApi';

/**
 * The membershipPlan view.
 */
function MembershipPlanView() {
	const { data: countries } = useGetMembershipPlanCountriesQuery({});

	const routeParams = useParams<{ membershipPlanId: string }>();
	const { membershipPlanId } = routeParams;
	
	const {
		data: membershipPlan,
		isLoading,
		isError
	} = useGetMembershipPlanItemQuery(membershipPlanId, {
		skip: !membershipPlanId
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
			navigate('/membershipPlan');
			dispatch(showMessage({ message: 'NOT FOUND' }));
		}, 0);

		return null;
	}

	if (!membershipPlan) {
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
							src={membershipPlan.avatar}
							alt={membershipPlan.first_name}
						>
							{membershipPlan?.first_name?.charAt(0)}
						</Avatar>
						<div className="flex items-center ml-auto mb-1">
							<Button
								variant="contained"
								color="secondary"
								component={NavLinkAdapter}
								to={`/membershipPlan/${membershipPlanId}/edit`}
							>
								<FuseSvgIcon size={20}>heroicons-outline:pencil-square</FuseSvgIcon>
								<span className="mx-2">Edit</span>
							</Button>
						</div>
					</div>

					<Typography className="mt-3 text-4xl font-bold truncate">{membershipPlan.first_name}</Typography>

					<div className="flex flex-wrap items-center mt-2">
						{membershipPlan?.tags?.map((id) => (
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
						<div className="flex items-center">
							<FuseSvgIcon>heroicons-outline:briefcase</FuseSvgIcon>
							<div className="ml-6 leading-6">{`${membershipPlan.first_name} ${membershipPlan.last_name}`}</div>
						</div>

						<div className="flex">
							<FuseSvgIcon>heroicons-outline:envelope</FuseSvgIcon>
							<div className="ml-6">
								<a
									className="hover:underline text-primary-500"
									href={`mailto:${membershipPlan.email}`}
								>
									{membershipPlan.email}
								</a>
							</div>
						</div>

						<div className="flex">
							<FuseSvgIcon>heroicons-outline:phone</FuseSvgIcon>
							<div className="ml-6">{membershipPlan.phone || 'Not provided'}</div>
						</div>

						<div className="flex">
							<FuseSvgIcon>heroicons-outline:map-pin</FuseSvgIcon>
							<div className="ml-6">
								{membershipPlan.address_line_1}
								{membershipPlan.address_line_2 && `, ${membershipPlan.address_line_2}`}
								{`, ${membershipPlan.city}, ${membershipPlan.state}, ${membershipPlan.postal_code}, ${membershipPlan.country}`}
							</div>
						</div>

						<div className="flex">
							<FuseSvgIcon>heroicons-outline:cake</FuseSvgIcon>
							<div className="ml-6">
								{membershipPlan.birthdate
									? format(new Date(membershipPlan.birthdate), 'MMMM d, y')
									: 'Not provided'}
							</div>
						</div>

						<div className="flex">
							<FuseSvgIcon>heroicons-outline:clock</FuseSvgIcon>
							<div className="ml-6">
								<strong>Created At:</strong>{' '}
								{membershipPlan.created_at
									? format(new Date(membershipPlan.created_at), 'MMMM d, y, h:mm a')
									: 'Unknown'}{' '}
								<br />
								<strong>Updated At:</strong>{' '}
								{membershipPlan.updated_at
									? format(new Date(membershipPlan.updated_at), 'MMMM d, y, h:mm a')
									: 'Not updated'}
							</div>
						</div>

						{membershipPlan.notes && (
							<div className="flex">
								<FuseSvgIcon>heroicons-outline:bars-3-bottom-left</FuseSvgIcon>
								<div
									className="max-w-none ml-6 prose dark:prose-invert"
									dangerouslySetInnerHTML={{ __html: membershipPlan.notes }}
								/>
							</div>
						)}
					</div>
				</div>
			</div>

		</>
	);
}

export default MembershipPlanView;
