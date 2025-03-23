'use client';

import { redirect, useParams } from 'next/navigation';
import MaintenanceForm from '../maintenance-form/MaintenanceForm';

function MaintenancePage() {
	const { maintenanceId } = useParams<{ maintenanceId: string }>();

	if (maintenanceId === 'new') {
		return <MaintenanceForm isNew />;
	}

	redirect(`/maintenance/${ maintenanceId}/view`);

	return null;
}

export default MaintenancePage;
