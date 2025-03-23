import { useGetViolationItemQuery } from './ViolationApi';

type ViolationTitleProps = {
	violationId?: string;
};

function ViolationTitle(props: ViolationTitleProps) {
	const { violationId } = props;
	const { data: violation } = useGetViolationItemQuery(violationId, {
		skip: !violationId
	});

	return violation?.first_name || 'Violation';
}

export default ViolationTitle;