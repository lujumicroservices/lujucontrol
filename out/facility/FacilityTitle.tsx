import { useGetFacilityItemQuery } from './FacilityApi';

type FacilityTitleProps = {
	facilityId?: string;
};

function FacilityTitle(props: FacilityTitleProps) {
	const { facilityId } = props;
	const { data: facility } = useGetFacilityItemQuery(facilityId, {
		skip: !facilityId
	});

	return facility?.first_name || 'Facility';
}

export default FacilityTitle;