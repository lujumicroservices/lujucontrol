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
	useCreatePaymentTransactionItemMutation,
	useDeletePaymentTransactionItemMutation,
	useGetPaymentTransactionItemQuery,
	useUpdatePaymentTransactionItemMutation,
	PaymentTransaction
} from '../PaymentTransactionApi';
import PaymentTransactionModel from '../models/PaymentTransactionModel';

function BirthdayIcon() {
	return <FuseSvgIcon size={20}>heroicons-solid:cake</FuseSvgIcon>;
}

function CalendarIcon() {
	return <FuseSvgIcon size={20}>heroicons-solid:calendar-days</FuseSvgIcon>;
}

type FormType = PaymentTransaction;

/**
 * Form Validation Schema
 */
const schema = z.object({
	player_id: z.string().min(1).max(50),
	amount: z.number().min(0),
	billing_period: z.string().regex(/\d{4}-\d{2}/),
	due_date: z.string().regex(/\d{4}-\d{2}-\d{2}/),
	status: z.enum(['pending', 'completed', 'failed']),
	late_fee: z.number().min(0),
});

type PaymentTransactionFormProps = {
	isNew?: boolean;
};

/**
 * The payment_transaction form.
 */
function PaymentTransactionForm(props: PaymentTransactionFormProps) {
	const { isNew } = props;
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const routeParams = useParams<{ payment_transactionId: string }>();
	const { payment_transactionId } = routeParams;

	const { data: payment_transaction, isError } = useGetPaymentTransactionItemQuery(payment_transactionId, {
		skip: !payment_transactionId || payment_transactionId === 'new'
	});

	const [createPaymentTransaction] = useCreatePaymentTransactionItemMutation();
	const [updatePaymentTransaction] = useUpdatePaymentTransactionItemMutation();
	const [deletePaymentTransaction] = useDeletePaymentTransactionItemMutation();

	const { control, watch, reset, handleSubmit, formState } = useForm<FormType>({
		mode: 'all',
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	const form = watch();

	useEffect(() => {
		if (isNew) {
			reset(PaymentTransactionModel({}));
		} else {
			reset({ ...payment_transaction });
		}
		// eslint-disable-next-line
	}, [payment_transaction, reset, routeParams]);

	/**
	 * Form Submit
	 */
	const onSubmit = useCallback(() => {
		if (isNew) {
			createPaymentTransaction({ payment_transaction: form })
				.unwrap()
				.then((action) => {
					navigate(`/payment_transaction/${action.id}`);
				});
		} else {
			updatePaymentTransaction({ id: payment_transaction.id, ...form });
		}
		// eslint-disable-next-line
	}, [form]);

	function handleRemovePaymentTransaction() {
		if (!payment_transaction) {
			return;
		}

		deletePaymentTransaction(payment_transaction.id).then(() => {
			navigate('/payment_transaction');
		});
	}

	const name = watch('name');

	if (isError && !isNew) {
		setTimeout(() => {
			navigate('/payment_transaction');
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
					src="/assets/images/cards/finance.jpeg"
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
						name="player_id"
						render={({ field }) => (
							<TextField
								className="mt-8"
								{...field}
								label="Player ID"
								placeholder="Enter player ID"
								id="player_id"
								error={!!errors.player_id }
								helperText={errors?.player_id?.message}
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
						name="amount"
						render={({ field }) => (
							<TextField
								className="mt-8"
								{...field}
								label="Amount"
								placeholder="Enter transaction amount"
								id="amount"
								error={!!errors.amount }
								helperText={errors?.amount?.message}
								variant="outlined"
								required
								fullWidth							
								InputProps= {{
									startAdornment: (
										<InputAdornment position="start">
											<FuseSvgIcon size={20}>heroicons-solid:currency-dollar</FuseSvgIcon>
										</InputAdornment>
									)
								}}
									onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : "")}
							/>
						)}
					/>
					<Controller
						control={control}
						name="billing_period"
						render={({ field }) => (
							<TextField
								className="mt-8"
								{...field}
								label="Billing Period"
								placeholder="YYYY-MM"
								id="billing_period"
								error={!!errors.billing_period }
								helperText={errors?.billing_period?.message}
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
						name="due_date"
						render={({ field }) => (
							<TextField
								className="mt-8"
								{...field}
								label="Due Date"
								placeholder="YYYY-MM-DD"
								id="due_date"
								error={!!errors.due_date }
								helperText={errors?.due_date?.message}
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
						name="status"
						render={({ field }) => (
							<TextField
								className="mt-8"
								{...field}
								label="Status"
								placeholder="Enter status"
								id="status"
								error={!!errors.status }
								helperText={errors?.status?.message}
								variant="outlined"
								required
								fullWidth							
								InputProps= {{
									startAdornment: (
										<InputAdornment position="start">
											<FuseSvgIcon size={20}>heroicons-solid:check-circle</FuseSvgIcon>
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
					payment
				</Typography>
				<Divider className="mb-4" />
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

					<Controller
						control={control}
						name="late_fee"
						render={({ field }) => (
							<TextField
								className="mt-8"
								{...field}
								label="Late Fee"
								placeholder="Enter late fee amount"
								id="late_fee"
								error={!!errors.late_fee }
								helperText={errors?.late_fee?.message}
								variant="outlined"
								
								fullWidth							
								InputProps= {{
									startAdornment: (
										<InputAdornment position="start">
											<FuseSvgIcon size={20}>heroicons-solid:currency-dollar</FuseSvgIcon>
										</InputAdornment>
									)
								}}
									onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : "")}
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
					timestamps
				</Typography>
				<Divider className="mb-4" />
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

			
								</div>
							</div>


				<Box
					className="flex items-center mt-10 py-3.5 pr-4 pl-1 sm:pr-12 sm:pl-9 border-t"
					sx={{ backgroundColor: 'background.default' }}
				>
					{!isNew && (
						<Button
							color="error"
							onClick={handleRemovePaymentTransaction }
						>
							Delete
						</Button>
					)}
					<Button
						component={Link}
						className="ml-auto"
						to={`/payment_transaction/${ payment_transactionId}`}
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

export default PaymentTransactionForm;