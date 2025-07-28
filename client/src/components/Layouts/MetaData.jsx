import { Helmet } from "react-helmet";

const MetaData = ({ title, description }) => { // Add 'description' to the destructured props
    return (
        <Helmet>
            <title>{title}</title>
            {description && <meta name="description" content={description} />} {/* Conditionally render meta description */}
        </Helmet>
    );
};

export default MetaData;