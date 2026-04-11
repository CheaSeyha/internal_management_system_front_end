import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";

/**
 * DataTable — Reusable dynamic table component
 *
 * @param {object[]} data        - Array of row objects
 * @param {object[]} columns     - Column definitions (see below)
 * @param {object[]} actions     - Row action definitions (see below)
 * @param {object[]} bulkActions - Bulk action buttons shown when 2+ rows selected
 * @param {boolean}  loading     - Show skeleton rows while loading
 * @param {number}   skeletonRows - Number of skeleton rows to show (default: 10)
 *
 * --- Column definition ---
 * {
 *   key: "name",              // key in your data object
 *   label: "Full Name",       // column header label
 *   width: "w-[200px]",       // optional tailwind width class
 *   align: "text-center",     // optional tailwind alignment class
 *   render: (value, row) => { // optional custom cell renderer
 *     return <Badge>{value}</Badge>
 *   }
 * }
 *
 * --- Action definition ---
 * {
 *   label: "Print",
 *   icon: <Printer className="h-4 w-4" />,
 *   onClick: (row) => handlePrint(row),
 *   disabled: (row) => isLoading,        // optional: fn or boolean
 *   className: "text-red-500",           // optional
 *   separator: true,                     // optional: adds a separator before this item
 * }
 *
 * --- Bulk action definition ---
 * {
 *   label: "Print All",
 *   icon: <Printer className="h-4 w-4" />,
 *   onClick: (selectedRows) => handleBulkPrint(selectedRows),
 *   disabled: false,
 *   className: "bg-blue-500 ...",
 * }
 *
 * --- Usage example ---
 * <DataTable
 *   data={cards}
 *   loading={loading}
 *   columns={[
 *     { key: "id", label: "Unique ID" },
 *     { key: "card_name", label: "Name" },
 *     { key: "card_type", label: "Card Type" },
 *     {
 *       key: "status",
 *       label: "Status",
 *       render: (value) => <Badge>{value}</Badge>,
 *     },
 *   ]}
 *   actions={[
 *     {
 *       label: "Print",
 *       icon: <Printer className="h-4 w-4" />,
 *       onClick: (row) => printCard(row),
 *     },
 *     {
 *       label: "Delete",
 *       icon: <Trash className="h-4 w-4" />,
 *       onClick: (row) => deleteCard(row),
 *       className: "text-red-500",
 *       separator: true,
 *     },
 *   ]}
 *   bulkActions={[
 *     {
 *       label: "Print Selected",
 *       icon: <Printer className="h-4 w-4" />,
 *       onClick: (rows) => multiplePrint(rows),
 *       className: "bg-blue-500 text-white hover:bg-blue-600",
 *     },
 *     {
 *       label: "Delete Selected",
 *       icon: <Trash className="h-4 w-4" />,
 *       onClick: (rows) => bulkDelete(rows),
 *       className: "bg-red-500 text-white hover:bg-red-600",
 *     },
 *   ]}
 * />
 */

export default function DataTable({
  data = [],
  columns = [],
  actions = [],
  bulkActions = [],
  loading = false,
  skeletonRows = 10,
}) {
  const [selectedRows, setSelectedRows] = useState([]);

  const allSelected = data.length > 0 && selectedRows.length === data.length;

  const toggleSelectAll = () => {
    setSelectedRows(allSelected ? [] : [...data]);
  };

  const toggleSelect = (row) => {
    setSelectedRows((prev) =>
      prev.some((r) => r.id === row.id)
        ? prev.filter((r) => r.id !== row.id)
        : [...prev, row],
    );
  };

  const hasSelection = selectedRows.length >= 2;
  const showActions = actions.length > 0;
  const showBulkActions = bulkActions.length > 0 && hasSelection;

  return (
    <main className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader className="bg-accent rounded-md">
          <TableRow>
            {/* Checkbox column */}
            <TableHead className="w-[50px]">
              <Checkbox
                checked={allSelected}
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>

            {/* Dynamic column headers */}
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={[col.width, col.align].filter(Boolean).join(" ")}
              >
                {col.label}
              </TableHead>
            ))}

            {/* Actions column */}
            {showActions && (
              <TableHead className="w-[100px] text-center">
                {showBulkActions ? (
                  <div className="flex gap-1 justify-center">
                    {bulkActions.map((action, idx) => (
                      <Button
                        key={idx}
                        size="sm"
                        className={action.className}
                        disabled={
                          typeof action.disabled === "function"
                            ? action.disabled(selectedRows)
                            : action.disabled
                        }
                        onClick={() => action.onClick(selectedRows)}
                      >
                        {action.icon}
                        {action.label && (
                          <span className="sr-only">{action.label}</span>
                        )}
                      </Button>
                    ))}
                  </div>
                ) : (
                  "Actions"
                )}
              </TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {/* Loading skeleton */}
          {loading ? (
            [...Array(skeletonRows)].map((_, idx) => (
              <TableRow key={`skeleton-${idx}`}>
                <TableCell>
                  <div className="w-5 h-5 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                </TableCell>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    <div className="w-24 h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  </TableCell>
                ))}
                {showActions && (
                  <TableCell>
                    <div className="w-8 h-4 mx-auto rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : data.length === 0 ? (
            // Empty state
            <TableRow>
              <TableCell
                colSpan={columns.length + (showActions ? 2 : 1)}
                className="text-center py-10 text-muted-foreground"
              >
                No data found
              </TableCell>
            </TableRow>
          ) : (
            // Data rows
            data.map((row, rowIdx) => (
              <TableRow
                key={row.id ?? rowIdx}
                data-state={
                  selectedRows.some((r) => r.id === row.id) ? "selected" : ""
                }
              >
                {/* Checkbox */}
                <TableCell className="w-[50px]">
                  <Checkbox
                    checked={selectedRows.some((r) => r.id === row.id)}
                    onCheckedChange={() => toggleSelect(row)}
                  />
                </TableCell>

                {/* Dynamic cells */}
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    className={[col.width, col.align].filter(Boolean).join(" ")}
                  >
                    {col.render
                      ? col.render(row[col.key], row)
                      : (row[col.key] ?? "-")}
                  </TableCell>
                ))}

                {/* Row actions dropdown */}
                {showActions && (
                  <TableCell className="w-[100px] text-center">
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger
                        asChild
                        className={hasSelection ? "hidden" : ""}
                      >
                        <Button variant="ghost" size="icon">
                          <Ellipsis className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {actions.map((action, idx) => (
                          <div key={idx}>
                            {action.separator && <DropdownMenuSeparator />}
                            <DropdownMenuItem
                              className={action.className}
                              disabled={
                                typeof action.disabled === "function"
                                  ? action.disabled(row)
                                  : action.disabled
                              }
                              onClick={() => action.onClick(row)}
                            >
                              {action.icon}
                              {action.label}
                            </DropdownMenuItem>
                          </div>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </main>
  );
}
