import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';
import { ChangeEvent, MouseEvent, useState } from 'react';
import TableHead from '@mui/material/TableHead';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { darken, lighten } from '@mui/material/styles';
import Box from '@mui/material/Box';
//import { useDeleteECommercePlayerPaymentsMutation } from './PaymentTransactionApi';

/**
 * The row type.
 */
type rowType = {
	id: string;
	align: 'left' | 'center' | 'right';
	disablePadding: boolean;
	label: string;
	sort: boolean;
};

/**
 * The rows.
 */
const rows: rowType[] = [
	{
		id: 'id',
		align: 'left',
		disablePadding: false,
		label: 'ID',
		sort: true
	},
	{
		id: 'reference',
		align: 'left',
		disablePadding: false,
		label: 'Reference',
		sort: true
	},
	{
		id: 'customer',
		align: 'left',
		disablePadding: false,
		label: 'Customer',
		sort: true
	},
	{
		id: 'total',
		align: 'right',
		disablePadding: false,
		label: 'Total',
		sort: true
	},
	{
		id: 'payment',
		align: 'left',
		disablePadding: false,
		label: 'Payment',
		sort: true
	},
	{
		id: 'status',
		align: 'left',
		disablePadding: false,
		label: 'Status',
		sort: true
	},
	{
		id: 'date',
		align: 'left',
		disablePadding: false,
		label: 'Date',
		sort: true
	}
];

type PlayerPaymentsTableHeadProps = {
	onRequestSort: (event: MouseEvent<HTMLSpanElement>, property: string) => void;
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
	tableOrder: {
		direction: 'asc' | 'desc';
		id: string;
	};
	selectedOrderIds: string[];
	rowCount: number;
	onMenuItemClick: () => void;
};

/**
 * The playerPayments table head.
 */
function PlayerPaymentsTableHead(props: PlayerPaymentsTableHeadProps) {
	const { selectedOrderIds, onRequestSort, onSelectAllClick, tableOrder, rowCount, onMenuItemClick } = props;
	const numSelected = selectedOrderIds.length;

	const [selectedPlayerPaymentsMenu, setSelectedPlayerPaymentsMenu] = useState<HTMLButtonElement | null>(null);

	//const [removePlayerPayments] = useDeleteECommercePlayerPaymentsMutation();

	const createSortHandler = (event: MouseEvent<HTMLSpanElement>, property: string) => {
		onRequestSort(event, property);
	};

	function openSelectedPlayerPaymentsMenu(event: MouseEvent<HTMLButtonElement>) {
		setSelectedPlayerPaymentsMenu(event.currentTarget);
	}

	function closeSelectedPlayerPaymentsMenu() {
		setSelectedPlayerPaymentsMenu(null);
	}

	// const {onSelectAllClick, order, orderBy, numSelected, rowCount} = props;

	return (
		<TableHead>
			<TableRow className="h-12 sm:h-16">
				<TableCell
					padding="none"
					className="w-9 md:w-16 text-center z-99"
					sx={{
						backgroundColor: (theme) =>
							darken(theme.palette.background.paper, theme.palette.mode === 'light' ? 0.02 : 0.2)
					}}
				>
					<Checkbox
						indeterminate={numSelected > 0 && numSelected < rowCount}
						checked={rowCount !== 0 && numSelected === rowCount}
						onChange={onSelectAllClick}
					/>
					{numSelected > 0 && (
						<Box
							className="flex items-center justify-center absolute w-16 top-0 ltr:left-0 rtl:right-0 mx-14 h-16 z-10 border-b-1"
							sx={(theme) => ({
								backgroundColor: lighten(theme.palette.background.default, 0.02),
								...theme.applyStyles('light', {
									backgroundColor: lighten(theme.palette.background.default, 0.4)
								})
							})}
						>
							<IconButton
								aria-haspopup="true"
								onClick={openSelectedPlayerPaymentsMenu}
							>
								<FuseSvgIcon>heroicons-outline:ellipsis-horizontal</FuseSvgIcon>
							</IconButton>
							<Menu
								id="selectedPlayerPaymentsMenu"
								anchorEl={selectedPlayerPaymentsMenu}
								open={Boolean(selectedPlayerPaymentsMenu)}
								onClose={closeSelectedPlayerPaymentsMenu}
							>
								<MenuList>
									<MenuItem
										onClick={() => {
											//removePlayerPayments(selectedOrderIds);
											onMenuItemClick();
											closeSelectedPlayerPaymentsMenu();
										}}
									>
										<ListItemIcon className="min-w-9">
											<FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon>
										</ListItemIcon>
										<ListItemText primary="Remove" />
									</MenuItem>
								</MenuList>
							</Menu>
						</Box>
					)}
				</TableCell>
				{rows.map((row) => {
					return (
						<TableCell
							sx={(theme) => ({
								backgroundColor: lighten(theme.palette.background.default, 0.02),
								...theme.applyStyles('light', {
									backgroundColor: lighten(theme.palette.background.default, 0.4)
								})
							})}
							className="p-1 md:p-4"
							key={row.id}
							align={row.align}
							padding={row.disablePadding ? 'none' : 'normal'}
							sortDirection={tableOrder.id === row.id ? tableOrder.direction : false}
						>
							{row.sort && (
								<Tooltip
									title="Sort"
									placement={row.align === 'right' ? 'bottom-end' : 'bottom-start'}
									enterDelay={300}
								>
									<TableSortLabel
										active={tableOrder.id === row.id}
										direction={tableOrder.direction}
										onClick={(ev: MouseEvent<HTMLSpanElement>) => createSortHandler(ev, row.id)}
										className="font-semibold"
									>
										{row.label}
									</TableSortLabel>
								</Tooltip>
							)}
						</TableCell>
					);
				})}
			</TableRow>
		</TableHead>
	);
}

export default PlayerPaymentsTableHead;
