'use client';

import Button from '@mui/material/Button';
import Link from '@fuse/core/Link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import Box from '@mui/system/Box';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { useAppDispatch } from 'src/store/hooks';
import useNavigate from '@fuse/hooks/useNavigate';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import {useTranslation} from 'react-i18next';

import {
	useCreatePlayerItemMutation,
	useDeletePlayerItemMutation,
	useGetPlayerItemQuery,
	useUpdatePlayerItemMutation,
	Player
} from '../PlayerApi';
import PlayerModel from '../models/PlayerModel';

function BirthdayIcon() {
	return <FuseSvgIcon size={20}>heroicons-solid:cake</FuseSvgIcon>;
}

function CalendarIcon() {
	return <FuseSvgIcon size={20}>heroicons-solid:calendar-days</FuseSvgIcon>;
}

type FormType = Player;

/**
 * Form Validation Schema
 */
const schema = z.object({
	first_name: z.string().min(1).max(50),
	last_name: z.string().min(1).max(50),
	birth_date: z.string().regex(/\d{4}-\d{2}-\d{2}/),
	jersey_number: z.number().int().min(0).max(99),
	position: z.enum(['Portero', 'Defensa', 'Mediocampista', 'Delantero']),
	team_name: z.string().min(1).max(100),
	medical_conditions: z.string().max(500).optional(),
});



type PlayerFormProps = {
	isNew?: boolean;
};

/**
 * The player form.
 */
function PlayerForm(props: PlayerFormProps) {
	const { isNew } = props;
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
    const {t} = useTranslation('memberspage');
	const routeParams = useParams<{ playerId: string }>();
	const { playerId } = routeParams;

	const { data: player, isError } = useGetPlayerItemQuery(playerId, {
		skip: !playerId || playerId === 'new'
	});

	const [createPlayer] = useCreatePlayerItemMutation();
	const [updatePlayer] = useUpdatePlayerItemMutation();
	const [deletePlayer] = useDeletePlayerItemMutation();

	const { control, watch, reset, handleSubmit, formState } = useForm<FormType>({
		mode: 'all',
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	const form = watch();

	useEffect(() => {
		if (isNew) {
			reset(PlayerModel({}));
		} else {
			reset({ ...player });
		}
		// eslint-disable-next-line
	}, [player, reset, routeParams]);

	/**
	 * Form Submit
	 */
	const onSubmit = useCallback(() => {
		if (isNew) {
			createPlayer({ player: form })
				.unwrap()
				.then((action) => {
					navigate(`/player/${action.id}`);
				});
		} else {
			updatePlayer({ id: player.id, ...form });
		}
		// eslint-disable-next-line
	}, [form]);

	function handleRemovePlayer() {
		if (!player) {
			return;
		}

		deletePlayer(player.id).then(() => {
			navigate('/player');
		});
	}

	const name = watch('name');

	if (isError && !isNew) {
		setTimeout(() => {
			navigate('/player');
			dispatch(showMessage({ message: 'NOT FOUND' }));
		}, 0);

		return null;
	}

	if (_.isEmpty(form)) {
		return <FuseLoading className="min-h-screen" />;
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
					src="/assets/images/cards/soccer.jpeg"
					alt="user background"
				/>
			</Box>

			<div className="relative flex flex-col flex-auto items-center px-6 sm:px-12">
				<div className="w-full">
					<div className="flex flex-auto items-end -mt-16">
						<Controller
							control={control}
							name="avatar"
							render={({ field: { onChange, value } }) => (
								<Box
									sx={{
										borderWidth: 4,
										borderStyle: 'solid',
										borderColor: 'background.paper'
									}}
									className="relative flex items-center justify-center w-32 h-32 rounded-full overflow-hidden"
								>
									<div className="absolute inset-0 bg-black/50 z-10" />
									<div className="absolute inset-0 flex items-center justify-center z-20">
										<div>
											<label
												htmlFor="button-avatar"
												className="flex p-2 cursor-pointer"
											>
												<input
													accept="image/*"
													className="hidden"
													id="button-avatar"
													type="file"
													onChange={async (e) => {
														function readFileAsync() {
															return new Promise((resolve, reject) => {
																const file = e?.target?.files?.[0];

																if (!file) {
																	return;
																}

																const reader: FileReader = new FileReader();
																reader.onload = () => {
																	if (typeof reader.result === 'string') {
																		resolve(
																			`data:${file.type};base64,${btoa(
																				reader.result
																			)}`
																		);
																	} else {
																		reject(
																			new Error(
																				'File reading did not result in a string.'
																			)
																		);
																	}
																};
																reader.onerror = reject;
																reader.readAsBinaryString(file);
															});
														}

														const newImage = await readFileAsync();
														onChange(newImage);
													}}
												/>
												<FuseSvgIcon className="text-white">
													heroicons-outline:camera
												</FuseSvgIcon>
											</label>
										</div>
										<div>
											<IconButton
												onClick={() => {
													onChange('');
												}}
											>
												<FuseSvgIcon className="text-white">heroicons-solid:trash</FuseSvgIcon>
											</IconButton>
										</div>
									</div>
									<Avatar
										sx={{
											backgroundColor: 'background.default',
											color: 'text.secondary'
										}}
										className="object-cover w-full h-full text-16 font-bold"
										src={value}
										alt={name}
									>
										{name?.charAt(0)}
									</Avatar>
								</Box>
							)}
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

					<Controller
						control={control}
						name="first_name"
						render={({ field }) => (
							<TextField
								className="mt-8"
								{...field}
								label={t('FN')}
								placeholder={t('PFN')}
								id="first_name"
								error={!!errors.first_name }
								helperText={errors?.first_name?.message}
								variant="outlined"
								required
								fullWidth							
								InputProps= {{
									startAdornment: (
										<InputAdornment position="start">
											<FuseSvgIcon size={20}>heroicons-solid:user</FuseSvgIcon>
										</InputAdornment>
									)
								}}
							/>
						)}
					/>
					<Controller
						control={control}
						name="last_name"
						render={({ field }) => (
							<TextField
								className="mt-8"
								{...field}
								label={t('LN')}
								placeholder={t('PLN')}
								id="last_name"
								error={!!errors.last_name }
								helperText={errors?.last_name?.message}
								variant="outlined"
								required
								fullWidth							
								InputProps= {{
									startAdornment: (
										<InputAdornment position="start">
											<FuseSvgIcon size={20}>heroicons-solid:user</FuseSvgIcon>
										</InputAdornment>
									)
								}}
							/>
						)}
					/>
					<Controller
						control={control}
						name="birth_date"
						render={({ field }) => (
							<TextField
								className="mt-8"
								{...field}
								label={t('DOB')}
								placeholder={t('YMA')}
								id="birth_date"
								error={!!errors.birth_date }
								helperText={errors?.birth_date?.message}
								variant="outlined"
								required
								fullWidth							
								InputProps= {{
									startAdornment: (
										<InputAdornment position="start">
											<FuseSvgIcon size={20}>heroicons-solid:calendar</FuseSvgIcon>
										</InputAdornment>
									)
								}}
							/>
						)}
					/>
					<Controller
						control={control}
						name="jersey_number"
						render={({ field }) => (
							<TextField
								className="mt-8"
								{...field}
								label={t('JN')}
								placeholder={t('EJN')}
								id="jersey_number"
								error={!!errors.jersey_number }
								helperText={errors?.jersey_number?.message}
								variant="outlined"
								required
								fullWidth							
								InputProps= {{
									startAdornment: (
										<InputAdornment position="start">
											<FuseSvgIcon size={20}>heroicons-solid:hashtag</FuseSvgIcon>
										</InputAdornment>
									)
								}}
									onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : "")}
							/>
						)}
					/>
					<Controller
						control={control}
						name="position"
						render={({ field }) => (
							<TextField
								className="mt-8"
								{...field}
								label={t('P')}
								placeholder={t('SP')}
								id="position"
								error={!!errors.position }
								helperText={errors?.position?.message}
								variant="outlined"
								required
								fullWidth							
								InputProps= {{
									startAdornment: (
										<InputAdornment position="start">
											<FuseSvgIcon size={20}>heroicons-solid:view-grid</FuseSvgIcon>
										</InputAdornment>
									)
								}}
							/>
						)}
					/>
					<Controller
						control={control}
						name="team_name"
						render={({ field }) => (
							<TextField
								className="mt-8"
								{...field}
								label={t('TN')}
								placeholder={t('ETN')}
								id="team_name"
								error={!!errors.team_name }
								helperText={errors?.team_name?.message}
								variant="outlined"
								required
								fullWidth							
								InputProps= {{
									startAdornment: (
										<InputAdornment position="start">
											<FuseSvgIcon size={20}>heroicons-solid:flag</FuseSvgIcon>
										</InputAdornment>
									)
								}}
							/>
						)}
					/>
			
								</div>
							</div>
				<div className="field-group">
				<Typography variant="h6" sx={{ 
						fontWeight: 'bold', mb: 2 
					}}
				>
					<FuseSvgIcon size={20} className="mr-2">heroicons-outline:collection</FuseSvgIcon>
					medical
				</Typography>
				<Divider className="mb-4" />
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

					<Controller
						control={control}
						name="medical_conditions"
						render={({ field }) => (
							<TextField
								className="mt-8"
								{...field}
								label={t('MC')}
								placeholder={t('LMC')}
								id="medical_conditions"
								error={!!errors.medical_conditions }
								helperText={errors?.medical_conditions?.message}
								variant="outlined"
								
								fullWidth							
								InputProps= {{
									startAdornment: (
										<InputAdornment position="start">
											<FuseSvgIcon size={20}>heroicons-solid:heart</FuseSvgIcon>
										</InputAdornment>
									)
								}}
							/>
						)}
					/>
			
								</div>
							</div>


				<Box
					className="flex items-center mt-10 py-3.5 pr-4 pl-1 sm:pr-12 sm:pl-9 border-t"
					sx={{ backgroundColor: 'background.default' }}
				>
					{!isNew && (
						<Button
							color="error"
							onClick={handleRemovePlayer }
						>
							Delete
						</Button>
					)}
					<Button
						component={Link}
						className="ml-auto"
						to={`/player/${ playerId}`}
					>
						Cancel
					</Button>
					<Button
						className="ml-2"
						variant="contained"
						color="secondary"
						disabled={_.isEmpty(dirtyFields) || !isValid}
						onClick={handleSubmit(onSubmit)}
					>
						Save
					</Button>
				</Box>
			</div>
		</>
	);
}

export default PlayerForm;