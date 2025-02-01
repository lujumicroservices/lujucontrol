import { useGetMembersItemQuery } from './MembersApi';

type MembersTitleProps = {
	memberId?: string;
};

function MembersTitle(props: MembersTitleProps) {
	const { memberId } = props;
	const { data: member } = useGetMembersItemQuery(memberId, {
		skip: !memberId
	});

	return member?.first_name || 'Members';
}

export default MembersTitle;
