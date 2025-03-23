import { useMemo } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import DataTable from 'src/components/data-table/DataTable';
import { ListItemIcon, MenuItem, Paper } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '@fuse/core/Link';
import FuseLoading from '@fuse/core/FuseLoading';
import { Payments, useGetPaymentTransactionListQuery } from './PaymentTransactionApi';
import OrdersStatus from './PlayerPaymentsStatus';

function PlayerPaymentsTable() {
	const { data: orders, isLoading } = useGetPaymentTransactionListQuery();
	
	const columns = useMemo<MRT_ColumnDef<Payments>[]>(
		() => [
			{
				accessorKey: 'name',
				header: 'Name',
				size: 64,
				Cell: ({ row }) => (
					<Typography
						component={Link}
						to={`/apps/players-payments/${row.original.player_id}`}
						role="button"
					>
						<u>{row.original.player_name}</u>
					</Typography>
				)
			},
			{
				id: 'last_billing_period',
				accessorFn: (row) => `${row.last_billing_period}`,
				header: 'Last billing period'
			},
			{
				id: 'last_payment_date',
				accessorFn: (row) => `${row.last_payment_date}`,
				header: 'Last payment date',
				size: 64
			},
			{
				id: 'status',
				accessorFn: (row) => <OrdersStatus name={row.payment_status} />,
				accessorKey: 'status',
				header: 'Status'
			},
			{
				accessorKey: 'actions',
				header: 'Actions',
				accessorFn: (row) => (
					<div className="flex space-x-2">
						{/* Action Icons (for example: Edit and Delete) */}
						<FuseSvgIcon
							className="text-blue-500 cursor-pointer"
							size={20}
							onClick={() => handleEdit(row)} // your edit action here
						>
							heroicons-solid:credit-card
						</FuseSvgIcon>
						<FuseSvgIcon
							className="text-yellow-500 cursor-pointer"
							size={20}
							onClick={() => handleDelete(row)} // your delete action here
						>
							heroicons-solid:printer
						</FuseSvgIcon>
					</div>
				),
			}
		],
		[]
	);

	if (isLoading) {
		return <FuseLoading />;
	}

	return (
		<Paper
			className="flex flex-col flex-auto shadow-1 rounded-t-lg overflow-hidden rounded-b-none w-full h-full"
			elevation={0}
		>
			<DataTable
				initialState={{
					density: 'spacious',
					showColumnFilters: false,
					showGlobalFilter: true,
					columnPinning: {
						left: ['mrt-row-expand', 'mrt-row-select'],
						right: ['mrt-row-actions']
					},
					pagination: {
						pageIndex: 0,
						pageSize: 20
					}
				}}
				data={orders}
				columns={columns}
				renderRowActionMenuItems={({ closeMenu, row, table }) => [
					<MenuItem
						key={0}
						onClick={() => {
							console.log("test");
							closeMenu();
							table.resetRowSelection();
						}}
					>
						<ListItemIcon>
							<FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon>
						</ListItemIcon>
						Delete
					</MenuItem>
				]}
				renderTopToolbarCustomActions={({ table }) => {
					const { rowSelection } = table.getState();

					if (Object.keys(rowSelection).length === 0) {
						return null;
					}

					return (
						<Button
							variant="contained"
							size="small"
							onClick={() => {
								const selectedRows = table.getSelectedRowModel().rows;
								//removeOrders(selectedRows.map((row) => row.original.id));
								table.resetRowSelection();
							}}
							className="flex shrink min-w-9 ltr:mr-2 rtl:ml-2"
							color="secondary"
						>
							<FuseSvgIcon size={16}>heroicons-outline:trash</FuseSvgIcon>
							<span className="hidden sm:flex mx-2">Delete selected items</span>
						</Button>
					);
				}}
			/>
		</Paper>
	);
}

export default PlayerPaymentsTable;
