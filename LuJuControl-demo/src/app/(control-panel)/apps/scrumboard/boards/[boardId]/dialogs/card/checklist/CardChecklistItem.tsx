import { Controller, useForm } from 'react-hook-form';
import { useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import _ from 'lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { ScrumboardCheckListItem } from '../../../../../ScrumboardApi';

type CardChecklistItemProps = {
	item: ScrumboardCheckListItem;
	onListItemChange: (item: ScrumboardCheckListItem, index: number) => void;
	index: number;
	onListItemRemove: () => void;
};

/**
 * The card checklist item component.
 */
function CardChecklistItem(props: CardChecklistItemProps) {
	const { item, onListItemChange, index, onListItemRemove } = props;

	const { control, watch } = useForm({ mode: 'onChange', defaultValues: item });
	const form = watch();

	useEffect(() => {
		if (!_.isEqual(item, form)) {
			onListItemChange(form, index);
		}
	}, [form, index, onListItemChange, item]);

	return (
		<ListItem
			className="px-0"
			key={item.id}
			dense
		>
			<Controller
				name="checked"
				control={control}
				defaultValue={false}
				render={({ field: { onChange, value } }) => (
					<Checkbox
						tabIndex={-1}
						checked={value}
						onChange={(ev) => onChange(ev.target.checked)}
						disableRipple
					/>
				)}
			/>

			<Controller
				name="name"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="flex flex-1 mx-2"
						variant="outlined"
					/>
				)}
			/>

			<IconButton
				aria-label="Delete"
				onClick={onListItemRemove}
				size="large"
			>
				<FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon>
			</IconButton>
		</ListItem>
	);
}

export default CardChecklistItem;
