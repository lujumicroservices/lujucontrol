'use client';

import FusePageCarded from '@fuse/core/FusePageCarded';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import { SyntheticEvent, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from '@fuse/core/Link';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import FuseLoading from '@fuse/core/FuseLoading';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import FuseTabs from 'src/components/tabs/FuseTabs';
import FuseTab from 'src/components/tabs/FuseTab';
//import InvoiceTab from './tabs/invoice/InvoiceTab';
import DetailsTab from './tabs/details/DetailsTab';
//import ProductsTab from './tabs/products/ProductsTab';
//import { useGetPlayerPaymentsListQuery } from '../PaymentTransactionApi';
import { useGetPlayerItemQuery } from '../../../player/PlayerApi';

/**
 * The player.
 */
function Player() {
	const routeParams = useParams<{ playerId: string }>();
	const { playerId } = routeParams;

	const {
		data: player,
		isLoading,
		isError
	} = useGetPlayerItemQuery(playerId );

	const isMobile = useThemeMediaQuery((_theme) => _theme.breakpoints.down('lg'));

	const [tabValue, setTabValue] = useState('details');

	/**
	 * Tab Change
	 */
	function handleTabChange(event: SyntheticEvent, value: string) {
		setTabValue(value);
	}

	if (isLoading) {
		return <FuseLoading />;
	}

	if (isError) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography
					color="text.secondary"
					variant="h5"
				>
					There is no such player!
				</Typography>
				<Button
					className="mt-6"
					component={Link}
					variant="outlined"
					to="/apps/e-commerce/orders"
					color="inherit"
				>
					Go to Players Payments Page
				</Button>
			</motion.div>
		);
	}

	return (
		<FusePageCarded
			header={
				player && (
					<div className="flex flex-1 flex-col py-8">
						<motion.div
							initial={{ x: 20, opacity: 0 }}
							animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
						>
							<PageBreadcrumb className="mb-2" />
						</motion.div>

						<motion.div
							initial={{ x: -20, opacity: 0 }}
							animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
							className="flex flex-col min-w-0"
						>
							<div className="flex justify-between items-center">
								<div>
									<Typography className="text-2xl truncate font-semibold">
										{`Payments`}
									</Typography>
									<Typography variant="caption" className="font-medium">
										{`From ${player.first_name} ${player.last_name}`}
									</Typography>
								</div>

								<div className="text-right">
									{/* Current date */}
									<Typography variant="body2" className="font-medium">
										{new Date().toLocaleDateString()} {/* Format date as required */}
									</Typography>

									{/* Status label */}
									<Typography variant="body2" className="font-medium">
										{player.status} {/* Assuming 'status' is a property of the player object */}
									</Typography>
								</div>
							</div>
						</motion.div>
					</div>

				)
			}
			content={
				<div className="p-4 sm:p-6 w-full">
					<FuseTabs
						className="mb-8"
						value={tabValue}
						onChange={handleTabChange}
					>
						<FuseTab
							value="details"
							label="@@detalle de pagos"
						/>
						<FuseTab
							value="products"
							label="Products"
						/>
						<FuseTab
							value="invoice"
							label="Invoice"
						/>
					</FuseTabs>
					{player && (
						<>
							{tabValue === 'details' && <DetailsTab />}
							{tabValue === 'products' && <ProductsTab />}
							{tabValue === 'invoice' && <InvoiceTab order={player} />}
						</>
					)}
					
				</div>
			}
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}

export default Player;
