import { useGetMaintenanceItemQuery } from './MaintenanceApi';

type MaintenanceTitleProps = {
	maintenanceId?: string;
};

function MaintenanceTitle(props: MaintenanceTitleProps) {
	const { maintenanceId } = props;
	const { data: maintenance } = useGetMaintenanceItemQuery(maintenanceId, {
		skip: !maintenanceId
	});

	return maintenance?.first_name || 'Maintenance';
}

export default MaintenanceTitle;