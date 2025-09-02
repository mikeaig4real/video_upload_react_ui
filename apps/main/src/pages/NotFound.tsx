import ErrorDisplay from "@/components/ErrorDisplay";

const NotFound = () => {
  return (
    <ErrorDisplay
      header={
        <>
          Oops, <br /> This page is soo 404...
        </>
      }
      description={"Maybe it was moved, or it never existed..."}
    />
  );
};

export default NotFound;
