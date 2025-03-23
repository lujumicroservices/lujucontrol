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

import {
	useCreate{{moduleName}}ItemMutation,
	useDelete{{moduleName}}ItemMutation,
	useGet{{moduleName}}ItemQuery,
	useUpdate{{moduleName}}ItemMutation,
	{{moduleName}}
} from '../{{moduleName}}Api';
import {{moduleName}}Model from '../models/{{moduleName}}Model';

function BirthdayIcon() {
	return <FuseSvgIcon size={20}>heroicons-solid:cake</FuseSvgIcon>;
}

function CalendarIcon() {
	return <FuseSvgIcon size={20}>heroicons-solid:calendar-days</FuseSvgIcon>;
}

type FormType = {{moduleName}};

/**
 * Form Validation Schema
 */
const schema = z.object({
	{{#fields}}
	{{#if display}}
	{{name}}: {{{validation}}},
	{{/if}}
	{{/fields}}
});

type {{moduleName}}FormProps = {
	isNew?: boolean;
};

/**
 * The {{moduleNameLower}} form.
 */
function {{moduleName}}Form(props: {{moduleName}}FormProps) {
	const { isNew } = props;
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const routeParams = useParams<{ {{moduleNameLower}}Id: string }>();
	const { {{moduleNameLower}}Id } = routeParams;

	const { data: {{moduleNameLower}}, isError } = useGet{{moduleName}}ItemQuery({{moduleNameLower}}Id, {
		skip: !{{moduleNameLower}}Id || {{moduleNameLower}}Id === 'new'
	});

	const [create{{moduleName}}] = useCreate{{moduleName}}ItemMutation();
	const [update{{moduleName}}] = useUpdate{{moduleName}}ItemMutation();
	const [delete{{moduleName}}] = useDelete{{moduleName}}ItemMutation();

	const { control, watch, reset, handleSubmit, formState } = useForm<FormType>({
		mode: 'all',
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	const form = watch();

	useEffect(() => {
		if (isNew) {
			reset({{moduleName}}Model({}));
		} else {
			reset({ ...{{moduleNameLower}} });
		}
		// eslint-disable-next-line
	}, [{{moduleNameLower}}, reset, routeParams]);

	/**
	 * Form Submit
	 */
	const onSubmit = useCallback(() => {
		if (isNew) {
			create{{moduleName}}({ {{moduleNameLower}}: form })
				.unwrap()
				.then((action) => {
					navigate(`/{{moduleNameLower}}/${action.id}`);
				});
		} else {
			update{{moduleName}}({ id: {{moduleNameLower}}.id, ...form });
		}
		// eslint-disable-next-line
	}, [form]);

	function handleRemove{{moduleName}}() {
		if (!{{moduleNameLower}}) {
			return;
		}

		delete{{moduleName}}({{moduleNameLower}}.id).then(() => {
			navigate('/{{moduleNameLower}}');
		});
	}

	const name = watch('name');

	if (isError && !isNew) {
		setTimeout(() => {
			navigate('/{{moduleNameLower}}');
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
				sx=\{{
					backgroundColor: 'background.default'
				}}
			>
				<img
					className="absolute inset-0 object-cover w-full h-full"
					src="/assets/images/cards/{{backgroundImage}}"
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
									sx=\{{
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
										sx=\{{
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

				{{#each (groupFields fields)}}
				<div className="field-group">
				<Typography variant="h6" sx=\{{ 
						fontWeight: 'bold', mb: 2 
					}}
				>
					<FuseSvgIcon size={20} className="mr-2">heroicons-outline:collection</FuseSvgIcon>
					{{@key}}
				</Typography>
				<Divider className="mb-4" />
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

				{{#each this}}
				{{#if display}}
					<Controller
						control={control}
						name="{{name}}"
						render={({ field }) => (
							<TextField
								className="mt-8"
								{...field}
								label="{{label}}"
								placeholder="{{placeholder}}"
								id="{{name}}"
								error={!!errors.{{name}} }
								helperText={errors?.{{name}}?.message}
								variant="outlined"
								{{#required}}required{{/required}}
								fullWidth							
								InputProps= \{{
									startAdornment: (
										<InputAdornment position="start">
											<FuseSvgIcon size={20}>{{icon}}</FuseSvgIcon>
										</InputAdornment>
									)
								}}
								{{#eq-block type "number"}}
									onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : "")}
								{{/eq-block}}
							/>
						)}
					/>
				{{/if}}
			{{/each}}
			
								</div>
							</div>
				{{/each}}


				<Box
					className="flex items-center mt-10 py-3.5 pr-4 pl-1 sm:pr-12 sm:pl-9 border-t"
					sx=\{{ backgroundColor: 'background.default' }}
				>
					{!isNew && (
						<Button
							color="error"
							onClick={handleRemove{{moduleName}} }
						>
							Delete
						</Button>
					)}
					<Button
						component={Link}
						className="ml-auto"
						to={`/{{moduleNameLower}}/${ {{moduleNameLower}}Id}`}
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

export default {{moduleName}}Form;