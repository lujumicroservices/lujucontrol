'use client';

import { redirect, useParams } from 'next/navigation';
import MembershipPlanForm from '../membershipPlan-form/MembershipPlanForm';

function MembershipPlanPage() {
	const { membershipPlanId } = useParams<{ membershipPlanId: string }>();

	if (membershipPlanId === 'new') {
		return <MembershipPlanForm isNew />;
	}

	redirect(`/membershipPlan/${membershipPlanId}/view`);

	return null;
}

export default MembershipPlanPage;
