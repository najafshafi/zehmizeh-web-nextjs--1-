import Head from "next/head";

const DocumentTitle = ({
  title,
  metaDescription,
}: {
  title: string;
  metaDescription?: string;
}) => {
  return (
    <Head>
      <title>{title}</title>
      {metaDescription && <meta name="description" content={metaDescription} />}
    </Head>
  );
};

export default DocumentTitle;
