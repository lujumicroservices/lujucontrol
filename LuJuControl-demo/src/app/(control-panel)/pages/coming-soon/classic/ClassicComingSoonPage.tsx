'use client';

import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import _ from 'lodash';
import Paper from '@mui/material/Paper';
import FuseCountdown from '@fuse/core/FuseCountdown';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

/**
 * Form Validation Schema
 */
const schema = z.object({
	email: z.string().email('You must enter a valid email').nonempty('You must enter an email')
});

const defaultValues = {
	email: ''
};

/**
 * The classic coming soon page.
 */
function ClassicComingSoonPage() {
	const { control, formState, handleSubmit, reset } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	function onSubmit() {
		reset(defaultValues);
	}

	return (
		<div className="flex min-w-0 flex-auto flex-col items-center sm:justify-center">
			<Paper className="min-h-full w-full rounded-none px-4 py-8 sm:min-h-auto sm:w-auto sm:rounded-xl sm:p-12 sm:shadow-sm">
				<div className="mx-auto w-full max-w-80 sm:mx-0 sm:w-80">
					<img
						className="w-12"
						src="/assets/images/logo/logo.svg"
						alt="logo"
					/>

					<Typography className="mt-8 text-4xl font-extrabold leading-[1.25] tracking-tight">
						Almost there!
					</Typography>
					<Typography className="mt-0.5">
						Do you want to be notified when we are ready? Register below so we can notify you about the
						launch!
					</Typography>

					<div className="flex flex-col items-center py-12">
						<FuseCountdown endDate="2071-07-28" />
					</div>

					<form
						name="comingSoonForm"
						noValidate
						className="flex w-full flex-col justify-center"
						onSubmit={handleSubmit(onSubmit)}
					>
						<Controller
							name="email"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-6"
									label="Email address"
									type="email"
									error={!!errors.email}
									helperText={errors?.email?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>

						<Button
							variant="contained"
							color="secondary"
							className=" mt-1 w-full"
							aria-label="Register"
							disabled={_.isEmpty(dirtyFields) || !isValid}
							type="submit"
							size="large"
						>
							Notify me when you launch
						</Button>

						<Typography
							className="mt-8 text-md font-medium"
							color="text.secondary"
						>
							This isn't a newsletter subscription. We will send one email to you when we launch and then
							you will be removed from the list.
						</Typography>
					</form>
				</div>
			</Paper>
		</div>
	);
}

export default ClassicComingSoonPage;
