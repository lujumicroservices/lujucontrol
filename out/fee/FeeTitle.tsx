import { useGetFeeItemQuery } from './FeeApi';

type FeeTitleProps = {
	feeId?: string;
};

function FeeTitle(props: FeeTitleProps) {
	const { feeId } = props;
	const { data: fee } = useGetFeeItemQuery(feeId, {
		skip: !feeId
	});

	return fee?.first_name || 'Fee';
}

export default FeeTitle;