import { motion } from 'motion/react';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import FuseLoading from '@fuse/core/FuseLoading';
import { useAppSelector } from 'src/store/hooks';
import RuleListItem from './RuleListItem';
import {
	Rule,
	GroupedRule,
	selectFilteredRuleList,
	selectGroupedFilteredRule,
	useGetRuleListQuery
} from '../RuleApi';

/**
 * The rule list.
 */
function RuleList() {
	const { data, isLoading } = useGetRuleListQuery();
	const filteredData = useAppSelector(selectFilteredRuleList(data));
	const groupedFilteredRule = useAppSelector(selectGroupedFilteredRule(filteredData));

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
					There are no rule!
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
			{Object.entries(groupedFilteredRule).map(([key, group]: [string, GroupedRule]) => {
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
							{group?.children?.map((item: Rule) => (
								<RuleListItem
									key={item.id}
									rule={item}
								/>
							))}
						</List>
					</div>
				);
			})}
		</motion.div>
	);
}

export default RuleList;