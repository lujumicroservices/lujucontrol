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
import { useGetMembersItemQuery, useGetMembersCountriesQuery, useGetMembersTagsQuery , getMemberDisplayData } from '../../MembersApi';

/**
 * The member view.
 */
function MembersView() {
	const { data: countries } = useGetMembersCountriesQuery();
	const { data: tags } = useGetMembersTagsQuery();
	const routeParams = useParams<{ memberId: string }>();
	const { memberId } = routeParams;
	const {
		data: member,
		isLoading,
		isError
	} = useGetMembersItemQuery(memberId, {
		skip: !memberId
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
			navigate('/members');
			dispatch(showMessage({ message: 'NOT FOUND' }));
		}, 0);

		return null;
	}

	if (!member) {
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
								color: 'text.secondary'
							}}
							className="w-32 h-32 text-16 font-bold"
							src={member.avatar}
							alt={member.first_name}
						>
							{member?.first_name?.charAt(0)}
						</Avatar>
						<div className="flex items-center ml-auto mb-1">
							<Button
								variant="contained"
								color="secondary"
								component={NavLinkAdapter}
								to={`/members/${memberId}/edit`}
							>
								<FuseSvgIcon size={20}>heroicons-outline:pencil-square</FuseSvgIcon>
								<span className="mx-2">Edit</span>
							</Button>
						</div>
					</div>

					<Typography className="mt-3 text-4xl font-bold truncate">{member.first_name}</Typography>

					<div className="flex flex-wrap items-center mt-2">
						{member?.tags?.map((id) => (
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
						{member.first_name && (
							<div className="flex items-center">
								<FuseSvgIcon>heroicons-outline:briefcase</FuseSvgIcon>
								<div className="ml-6 leading-6">{getMemberDisplayData(member).fullName}</div>
							</div>
						)}

						<div className="flex">
							<FuseSvgIcon>heroicons-outline:envelope</FuseSvgIcon>
							<div className="min-w-0 ml-6 space-y-1">
								<div
									className="flex items-center leading-6"
									key={member.email}
								>
									<a
										className="hover:underline text-primary-500"
										href={`mailto: ${member.email}`}
										target="_blank"
										rel="noreferrer"
									>
										{member.email}
									</a>
									{member.email && (
										<Typography
											className="text-md truncate"
											color="text.secondary"
										>
											<span className="mx-2">&bull;</span>
											<span className="font-medium">Personal</span>
										</Typography>
									)}
								</div>
							</div>
						</div>

						<div className="flex">
							<FuseSvgIcon>heroicons-outline:phone</FuseSvgIcon>
							<div className="min-w-0 ml-6 space-y-1">
								<div
									className="flex items-center leading-6"
									key="1"
								>
									<Box
										className="hidden sm:flex w-6 h-4 overflow-hidden"
										sx={{
											background: "url('/assets/images/members/flags.png') no-repeat 0 0",
											backgroundSize: '24px 3876px',
											backgroundPosition: getCountryByIso(member.country)?.flagImagePos
										}}
									/>

									<div className="sm:ml-3 font-mono">{getCountryByIso(member.country)?.code}</div>

									<div className="ml-2.5 font-mono">{member.phone}</div>

									<Typography
										className="text-md truncate"
										color="text.secondary"
									>
										<span className="mx-2">&bull;</span>
										<span className="font-medium">Personal</span>
									</Typography>
								</div>
							</div>
						</div>

						{member.address_line_1 && (
							<div className="flex items-center">
								<FuseSvgIcon>heroicons-outline:map-pin</FuseSvgIcon>
								<div className="ml-6 leading-6">{getMemberDisplayData(member).fullAddress}</div>
							</div>
						)}

						{member.birthdate && (
							<div className="flex items-center">
								<FuseSvgIcon>heroicons-outline:cake</FuseSvgIcon>
								<div className="ml-6 leading-6">{format(new Date(member.birthdate), 'MMMM d, y')}</div>
							</div>
						)}

						{member.notes && (
							<div className="flex">
								<FuseSvgIcon>heroicons-outline:bars-3-bottom-left</FuseSvgIcon>
								<div
									className="max-w-none ml-6 prose dark:prose-invert"
									dangerouslySetInnerHTML={{ __html: member.notes }}
								/>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
}

export default MembersView;
