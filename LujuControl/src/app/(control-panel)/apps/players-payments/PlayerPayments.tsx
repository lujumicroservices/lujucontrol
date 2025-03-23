'use client';

import GlobalStyles from '@mui/material/GlobalStyles';
import PlayerPaymentsHeader from './PlayerPaymentsHeader';
import PlayerPaymentsTable from './PlayerPaymentsTable';

/**
 * The playerPayments page.
 */
function PlayerPayments() {
	return (
		<>
			<GlobalStyles
				styles={() => ({
					'#root': {
						maxHeight: '100vh'
					}
				})}
			/>
			<div className="w-full h-full flex flex-col px-4">
				<PlayerPaymentsHeader />
				<PlayerPaymentsTable />
			</div>
		</>
	);
}

export default PlayerPayments;
