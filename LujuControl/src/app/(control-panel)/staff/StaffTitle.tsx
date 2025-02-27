import { useGetStaffItemQuery } from './StaffApi';

type StaffTitleProps = {
	staffId?: string;
};

function StaffTitle(props: StaffTitleProps) {
	const { staffId } = props;
	const { data: staff } = useGetStaffItemQuery(staffId, {
		skip: !staffId
	});

	return staff?.first_name || 'Staff';
}

export default StaffTitle;
