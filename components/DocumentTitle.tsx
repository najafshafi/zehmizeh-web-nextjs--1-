import { Helmet } from 'react-helmet';

function DocumentTitle({
  title,
  metaDescription,
}: {
  title: string;
  metaDescription?: string;
}) {
  return (
    <Helmet>
      <title>{title}</title>
      {metaDescription && <meta name="description" content={metaDescription} />}
    </Helmet>
  );
}

export default DocumentTitle;
