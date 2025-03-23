import _ from 'lodash';
import clsx from 'clsx';
import orderStatuses from './constants/playerPaymentsStatuses';

/**
 * The playerPayments status properties.
 */
type PlayerPaymentsStatusProps = {
	name: string;
};

/**
 * The playerPayments status component.
 */
function PlayerPaymentsStatus(props: PlayerPaymentsStatusProps) {
	const { name } = props;

	return (
		<div
			className={clsx(
				'inline text-md font-semibold py-1 px-3 rounded-full truncate',
				_.find(orderStatuses, { name })?.color
			)}
		>
			{name}
		</div>
	);
}

export default PlayerPaymentsStatus;
