import { motion } from 'motion/react';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import FuseLoading from '@fuse/core/FuseLoading';
import { useAppSelector } from 'src/store/hooks';
import MaintenanceListItem from './MaintenanceListItem';
import {
	Maintenance,
	GroupedMaintenance,
	selectFilteredMaintenanceList,
	selectGroupedFilteredMaintenance,
	useGetMaintenanceListQuery
} from '../MaintenanceApi';

/**
 * The maintenance list.
 */
function MaintenanceList() {
	const { data, isLoading } = useGetMaintenanceListQuery();
	const filteredData = useAppSelector(selectFilteredMaintenanceList(data));
	const groupedFilteredMaintenance = useAppSelector(selectGroupedFilteredMaintenance(filteredData));

	if (isLoading) {
		return <FuseLoading />;
	}

	if (filteredData.length === 0) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<Typography
					color="text.secondary"
					variant="h5"
				>
					There are no maintenance!
				</Typography>
			</div>
		);
	}

	return (
		<motion.div
			initial={{ y: 20, opacity: 0 }}
			animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
			className="flex flex-col flex-auto w-full max-h-full border-x-1"
		>
			{Object.entries(groupedFilteredMaintenance).map(([key, group]: [string, GroupedMaintenance]) => {
				return (
					<div
						key={key}
						className="relative"
					>
						<Typography
							color="text.secondary"
							className="px-8 py-1 text-base font-medium"
						>
							{key}
						</Typography>
						<Divider />
						<List className="w-full m-0 p-0">
							{group?.children?.map((item: Maintenance) => (
								<MaintenanceListItem
									key={item.id}
									maintenance={item}
								/>
							))}
						</List>
					</div>
				);
			})}
		</motion.div>
	);
}

export default MaintenanceList;