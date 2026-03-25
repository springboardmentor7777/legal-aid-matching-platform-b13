import { Helmet } from "react-helmet-async";

interface PageTitleProps {
  title?: string; // Making it optional prevents TS errors if it's missing
}

function PageTitle({ title }: PageTitleProps) {
  return (
    <Helmet>
      {/* The "|| ''" ensures that if title is undefined, 
        Helmet receives an empty string instead of crashing.
      */}
      <title>{title || "Legal Aid Matching"}</title>
    </Helmet>
  );
}

export default PageTitle;