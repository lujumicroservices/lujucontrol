import { useGetPropertyItemQuery } from './PropertyApi';

type PropertyTitleProps = {
	propertyId?: string;
};

function PropertyTitle(props: PropertyTitleProps) {
	const { propertyId } = props;
	const { data: property } = useGetPropertyItemQuery(propertyId, {
		skip: !propertyId
	});

	return property?.first_name || 'Property';
}

export default PropertyTitle;