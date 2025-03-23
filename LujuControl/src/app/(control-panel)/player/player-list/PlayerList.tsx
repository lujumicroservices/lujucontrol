import { motion } from 'motion/react';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import FuseLoading from '@fuse/core/FuseLoading';
import { useAppSelector } from 'src/store/hooks';
import PlayerListItem from './PlayerListItem';
import {
	Player,
	GroupedPlayer,
	selectFilteredPlayerList,
	selectGroupedFilteredPlayer,
	useGetPlayerListQuery
} from '../PlayerApi';

/**
 * The player list.
 */
function PlayerList() {
	const { data, isLoading } = useGetPlayerListQuery();
	const filteredData = useAppSelector(selectFilteredPlayerList(data));
	const groupedFilteredPlayer = useAppSelector(selectGroupedFilteredPlayer(filteredData));

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
					There are no player!
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
			{Object.entries(groupedFilteredPlayer).map(([key, group]: [string, GroupedPlayer]) => {
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
							{group?.children?.map((item: Player) => (
								<PlayerListItem
									key={item.id}
									player={item}
								/>
							))}
						</List>
					</div>
				);
			})}
		</motion.div>
	);
}

export default PlayerList;