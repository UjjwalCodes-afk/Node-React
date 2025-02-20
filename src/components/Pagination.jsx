import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export default function PaginationOutlined({ totalItems, itemsPerPage, paginate, currentPage }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <Stack
      spacing={2}
      direction="row"
      justifyContent="center"
      alignItems="center"
      className="mt-8"
    >
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(event, page) => paginate(page)}
        variant="outlined"
        color="primary"
        shape="rounded"
      />
    </Stack>
  );
}
