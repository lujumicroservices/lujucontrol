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
import { useGet{{moduleName}}ItemQuery, useGet{{moduleName}}CountriesQuery } from '../../{{moduleName}}Api';
import FieldDisplay from './FieldDisplay'; // Reusable component for displaying fields

/**
 * The {{moduleNameLower}} view.
 */
function {{moduleName}}View() {
	const { data: countries } = useGet{{moduleName}}CountriesQuery({});

	const routeParams = useParams<{ {{moduleNameLower}}Id: string }>();
	const { {{moduleNameLower}}Id } = routeParams;
	
	const {
		data: {{moduleNameLower}},
		isLoading,
		isError
	} = useGet{{moduleName}}ItemQuery({{moduleNameLower}}Id, {
		skip: !{{moduleNameLower}}Id
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
			navigate('/{{moduleNameLower}}');
			dispatch(showMessage({ message: 'NOT FOUND' }));
		}, 0);

		return null;
	}

	if (!{{moduleNameLower}}) {
		return null;
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
					src="/assets/images/cards/default-bk.jpg"
					alt="user background"
				/>
			</Box>

			<div className="relative flex flex-col flex-auto items-center p-6 pt-0 sm:p-12 sm:pt-0">
				<div className="w-full max-w-5xl">
					<div className="flex flex-auto items-end -mt-16">
						<Avatar
							sx=\{{
								borderWidth: 4,
								borderStyle: 'solid',
								borderColor: 'background.paper',
								backgroundColor: 'background.default',
								color: 'text.secondary',
							}}
							className="w-32 h-32 text-16 font-bold"
							src={ {{moduleNameLower}}.avatar}
							alt={ {{moduleNameLower}}.first_name}
						>
							{ {{moduleNameLower}}?.first_name?.charAt(0)}
						</Avatar>
						<div className="flex items-center ml-auto mb-1">
							<Button
								variant="contained"
								color="secondary"
								component={NavLinkAdapter}
								to={`/{{moduleNameLower}}/${ {{moduleNameLower}}Id}/edit`}
							>
								<FuseSvgIcon size={20}>heroicons-outline:pencil-square</FuseSvgIcon>
								<span className="mx-2">Edit</span>
							</Button>
						</div>
					</div>

					<Typography className="mt-3 text-4xl font-bold truncate">{ {{moduleNameLower}}.first_name}</Typography>

					<div className="flex flex-wrap items-center mt-2">
						{ {{moduleNameLower}}?.tags?.map((id) => (
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
						{{#fields}}
						<FieldDisplay
							icon="{{icon}}"
							value={ {{moduleNameLower}}.{{name}} }
							format="{{format}}"
							isEmail={{isEmail}}
							isLink={{isLink}}
							concatenate= {{#concatenate}}
							[
								{{#concatenate}}
									{{moduleNameLower}}.{{.}}{{#unless @last}}, {{/unless}}
								{{/concatenate}}
							]
							{{/concatenate}}
						/>
						{{/fields}}
					</div>
				</div>
			</div>
		</>
	);
}

export default {{moduleName}}View;