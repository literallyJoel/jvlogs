import {
  Pagination as ShadPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface props {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}

const Pagination = ({
  page,
  setPage,
  totalPages,
}: props): JSX.Element => {
  const PaginationMiddle = () => {
    if (totalPages <= 6) {
      return (
        <>
          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={`pag${i}`}>
              <PaginationLink
                className={page === i ? "text-red-500" : ""}
                onClick={() => {
                  setPage(i);
                }}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
        </>
      );
    } else {
      return (
        <>
          {Array.from({ length: 3 }, (_, i) => (
            <PaginationItem key={`pag${i}`}>
              <PaginationLink
                className={i === page ? "text-red-500" : ""}
                onClick={() => setPage(i)}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            {page < 3 || page > totalPages - 4 ? (
              <PaginationEllipsis />
            ) : (
              <PaginationItem>
                <PaginationLink className="text-red-500">
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
            )}
          </PaginationItem>

          {Array.from({ length: 3 }, (_, i) => (
            <PaginationItem key={`pag${totalPages - 1 - i}`}>
              <PaginationLink
                className={page === totalPages - 1 - i ? "text-red-500" : ""}
                onClick={() => setPage(totalPages - 1 - i)}
              >
                {totalPages - i}
              </PaginationLink>
            </PaginationItem>
          )).reverse()}
        </>
      );
    }
  };
  return (
    <ShadPagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={page === 0 ? "cursor-not-allowed" : ""}
            aria-disabled={page === 0}
            onClick={() => setPage(page - 1)}
          />
        </PaginationItem>
        <PaginationMiddle />
        <PaginationItem>
          <PaginationNext
            className={page + 1 > totalPages - 1 ? "cursor-not-allowed" : ""}
            aria-disabled={page + 1 > totalPages - 1}
            onClick={() => setPage(page + 1 > totalPages - 1 ? page : page + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </ShadPagination>
  );
};

export default Pagination;