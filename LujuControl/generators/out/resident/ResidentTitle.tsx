import { useGetResidentItemQuery } from './ResidentApi';

type ResidentTitleProps = {
	residentId?: string;
};

function ResidentTitle(props: ResidentTitleProps) {
	const { residentId } = props;
	const { data: resident } = useGetResidentItemQuery(residentId, {
		skip: !residentId
	});

	return resident?.first_name || 'Resident';
}

export default ResidentTitle;