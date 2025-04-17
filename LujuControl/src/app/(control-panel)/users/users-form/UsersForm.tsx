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
	useCreateUsersItemMutation,
	useDeleteUsersItemMutation,
	useGetUsersItemQuery,
	useUpdateUsersItemMutation,
	Users
} from '../UsersApi';
import UsersModel from '../models/UsersModel';

function BirthdayIcon() {
	return <FuseSvgIcon size={20}>heroicons-solid:cake</FuseSvgIcon>;
}

function CalendarIcon() {
	return <FuseSvgIcon size={20}>heroicons-solid:calendar-days</FuseSvgIcon>;
}

type FormType = Users;

/**
 * Form Validation Schema
 */
const schema = z.object({
	user_name: z.string().min(1).max(50),
	first_name: z.string().min(1).max(50),
	last_name: z.string().min(1).max(50),
	password: z.string().min(1).max(50),
});

type UsersFormProps = {
	isNew?: boolean;
};

/**
 * The users form.
 */
function UsersForm(props: UsersFormProps) {
	const { isNew } = props;
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
    const {t} = useTranslation('usermodule');
	const routeParams = useParams<{ usersId: string }>();
	const { usersId } = routeParams;

	const { data: users, isError } = useGetUsersItemQuery(usersId, {
		skip: !usersId || usersId === 'new'
	});

	const [createUsers] = useCreateUsersItemMutation();
	const [updateUsers] = useUpdateUsersItemMutation();
	const [deleteUsers] = useDeleteUsersItemMutation();

	const { control, watch, reset, handleSubmit, formState } = useForm<FormType>({
		mode: 'all',
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	const form = watch();

	useEffect(() => {
		if (isNew) {
			reset(UsersModel({}));
		} else {
			reset({ ...users });
		}
		// eslint-disable-next-line
	}, [users, reset, routeParams]);

	/**
	 * Form Submit
	 */
	const onSubmit = useCallback(() => {
		if (isNew) {
			createUsers({ users: form })
				.unwrap()
				.then((action) => {
					navigate(`/users/${action.id}`);
				});
		} else {
			updateUsers({ id: users.id, ...form });
		}
		// eslint-disable-next-line
	}, [form]);

	function handleRemoveUsers() {
		if (!users) {
			return;
		}

		deleteUsers(users.id).then(() => {
			navigate('/users');
		});
	}

	const name = watch('name');

	if (isError && !isNew) {
		setTimeout(() => {
			navigate('/users');
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
						name="user_name"
						render={({ field }) => (
							<TextField
								className="mt-8"
								{...field}
								label={t('USERNAME')}
								placeholder={t('USERNAME')}
								id="user_name"
								error={!!errors.user_name }
								helperText={errors?.user_name?.message}
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
						name="first_name"
						render={({ field }) => (
							<TextField
								className="mt-8"
								{...field}
								label={t('FIRSTNAME')}
								placeholder={t('PLAYERFIRSTNAME')}
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
								label={t('LASTNAME')}
								placeholder={t('PLAYERLASTNAME')}
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
						name="password"
						render={({ field }) => (
							<TextField
								className="mt-8"
								{...field}
								label={t('PASWORD')}
								placeholder={t('ENTERPASWORD')}
								id="password"
								error={!!errors.password }
								helperText={errors?.password?.message}
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
			
								</div>
							</div>


				<Box
					className="flex items-center mt-10 py-3.5 pr-4 pl-1 sm:pr-12 sm:pl-9 border-t"
					sx={{ backgroundColor: 'background.default' }}
				>
					{!isNew && (
						<Button
							color="error"
							onClick={handleRemoveUsers }
						>
							Delete
						</Button>
					)}
					<Button
						component={Link}
						className="ml-auto"
						to={`/users/${ usersId}`}
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

export default UsersForm;