import { motion } from 'motion/react';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import FuseLoading from '@fuse/core/FuseLoading';
import { useAppSelector } from 'src/store/hooks';
import ResidentListItem from './ResidentListItem';
import {
	Resident,
	GroupedResident,
	selectFilteredResidentList,
	selectGroupedFilteredResident,
	useGetResidentListQuery
} from '../ResidentApi';

/**
 * The resident list.
 */
function ResidentList() {
	const { data, isLoading } = useGetResidentListQuery();
	const filteredData = useAppSelector(selectFilteredResidentList(data));
	const groupedFilteredResident = useAppSelector(selectGroupedFilteredResident(filteredData));

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
					There are no resident!
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
			{Object.entries(groupedFilteredResident).map(([key, group]: [string, GroupedResident]) => {
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
							{group?.children?.map((item: Resident) => (
								<ResidentListItem
									key={item.id}
									resident={item}
								/>
							))}
						</List>
					</div>
				);
			})}
		</motion.div>
	);
}

export default ResidentList;