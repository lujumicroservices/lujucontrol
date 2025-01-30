import { useGetMembersItemQuery } from './MembersApi';

type MembersTitleProps = {
	contactId?: string;
};

function MembersTitle(props: MembersTitleProps) {
	const { contactId } = props;
	const { data: contact } = useGetMembersItemQuery(contactId, {
		skip: !contactId
	});

	return contact?.name || 'Members';
}

export default MembersTitle;
