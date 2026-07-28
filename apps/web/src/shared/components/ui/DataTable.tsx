import { memo } from "react";
import { Box, Table } from "@chakra-ui/react";
import type { ReactNode } from "react";

export interface DataTableColumn<RowData> {
  key: string;
  header: string;
  render: (row: RowData) => ReactNode;
}

interface DataTableProps<RowData extends { id: string }> {
  data: RowData[];
  columns: Array<DataTableColumn<RowData>>;
}

function DataTableInner<RowData extends { id: string }>({
  data,
  columns,
}: DataTableProps<RowData>) {
  return (
    <Box
      borderWidth="1px"
      borderColor="border.subtle"
      borderRadius="lg"
      bg="bg.surface"
      overflow="hidden"
    >
      <Table.ScrollArea>
        <Table.Root variant="line" size="md" minW="600px">
          <Table.Header>
            <Table.Row>
              {columns.map((column) => (
                <Table.ColumnHeader
                  key={column.key}
                  py={4}
                  color="text.secondary"
                  fontSize="xs"
                  letterSpacing="widest"
                >
                  {column.header}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((row) => (
              <Table.Row key={row.id}>
                {columns.map((column) => (
                  <Table.Cell key={column.key} py={4}>
                    {column.render(row)}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
    </Box>
  );
}

export const DataTable = memo(DataTableInner) as typeof DataTableInner;
