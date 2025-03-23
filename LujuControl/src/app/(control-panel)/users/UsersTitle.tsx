import { useGetUsersItemQuery } from './UsersApi';

type UsersTitleProps = {
	usersId?: string;
};

function UsersTitle(props: UsersTitleProps) {
	const { usersId } = props;
	const { data: users } = useGetUsersItemQuery(usersId, {
		skip: !usersId
	});

	return users?.first_name || 'Users';
}

export default UsersTitle;