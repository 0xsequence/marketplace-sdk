import { Box, Button, Text, Skeleton } from '@0xsequence/design-system';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from './Table';

export interface Column<T> {
  header: string;
  key: string;
  render?: (row: T) => React.ReactNode;
}

export interface ControlledTableProps<T> {
  isLoading?: boolean;
  items?: T[];
  columns: Column<T>[];
  emptyMessage: string;
  pagination?: {
    onNextPage: () => void;
    onPrevPage: () => void;
    isPrevDisabled: boolean;
    isNextDisabled: boolean;
    currentPage: number;
  };
}

export function ControlledTable<T>({
  isLoading,
  items,
  columns,
  emptyMessage,
  pagination,
}: ControlledTableProps<T>) {
  if (isLoading) {
    return (
      <Box background="backgroundMuted" borderRadius="md">
        <Table>
          <TableHeader style={{position: 'sticky', top: 32, width: 'full', backdropFilter: 'blur(10px)'}}>
            <TableRow>
              {columns.map((column: Column<T>) => (
                <TableHead key={column.key}>
                  <Text fontFamily="body" color="text80" fontSize="small">
                    {column.header}
                  </Text>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    <Skeleton height="6" width="full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    );
  }

  if (!items?.length) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        padding="8"
        background="backgroundMuted"
        borderRadius="md"
      >
        <Text variant="medium" fontFamily="body">
          {emptyMessage}
        </Text>
      </Box>
    );
  }

  return (
    <Box background="backgroundMuted" borderRadius="md">
      <Table>
        <TableHeader style={{position: 'sticky', top: 32, width: 'full', backdropFilter: 'blur(10px)'}}>
          <TableRow>
            {columns.map((column: Column<T>) => (
              <TableHead key={column.key}>
                <Text fontFamily="body" color="text80" fontSize="small">
                  {column.header}
                </Text>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index}>
              {columns.map((column: Column<T>) => (
                <TableCell key={column.key}>
                  {column.render ? (
                    column.render(item)
                  ) : (
                    <Text fontFamily="body" color="text100">
                      {(item as any)[column.key]}
                    </Text>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {pagination && (
        <Box
          display="flex"
          gap="4"
          padding="4"
          alignItems="center"
          justifyContent="flex-start"
        >
          <Box background='backgroundPrimary' padding='2' borderRadius='sm'>
            <Text fontFamily="body" color="text100" fontSize="small"> 
            Page   {pagination.currentPage}
            </Text>
          </Box>
          
          <Button
            size="xs"
            label="Previous page"
            onClick={pagination.onPrevPage}
            disabled={pagination.isPrevDisabled}
          />
          <Button
            size="xs"
            label="Next page"
            onClick={pagination.onNextPage}
            disabled={pagination.isNextDisabled}
          />
        </Box>
      )}
    </Box>
  );
} 