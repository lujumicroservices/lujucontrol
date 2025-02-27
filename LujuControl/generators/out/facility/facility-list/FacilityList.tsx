import { motion } from 'motion/react';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import FuseLoading from '@fuse/core/FuseLoading';
import { useAppSelector } from 'src/store/hooks';
import FacilityListItem from './FacilityListItem';
import {
	Facility,
	GroupedFacility,
	selectFilteredFacilityList,
	selectGroupedFilteredFacility,
	useGetFacilityListQuery
} from '../FacilityApi';

/**
 * The facility list.
 */
function FacilityList() {
	const { data, isLoading } = useGetFacilityListQuery();
	const filteredData = useAppSelector(selectFilteredFacilityList(data));
	const groupedFilteredFacility = useAppSelector(selectGroupedFilteredFacility(filteredData));

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
					There are no facility!
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
			{Object.entries(groupedFilteredFacility).map(([key, group]: [string, GroupedFacility]) => {
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
							{group?.children?.map((item: Facility) => (
								<FacilityListItem
									key={item.id}
									facility={item}
								/>
							))}
						</List>
					</div>
				);
			})}
		</motion.div>
	);
}

export default FacilityList;