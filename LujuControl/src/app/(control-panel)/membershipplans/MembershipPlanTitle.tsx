import { useGetMembershipPlanItemQuery } from './MembershipPlanApi';

type MembershipPlanTitleProps = {
	membershipPlanId?: string;
};

function MembershipPlanTitle(props: MembershipPlanTitleProps) {
	const { membershipPlanId } = props;
	const { data: membershipPlan } = useGetMembershipPlanItemQuery(membershipPlanId, {
		skip: !membershipPlanId
	});

	return membershipPlan?.first_name || 'MembershipPlan';
}

export default MembershipPlanTitle;
