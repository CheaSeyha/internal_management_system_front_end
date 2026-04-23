import StaffTable from "./components/StaffTable";
import StaffToolbar from "./components/StaffToolbar";
import useStaffHook from "./hooks/useStaffHook";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UpdateStaffDialog } from "./components/UpdateStaffDialog";
import useDepartment from "./hooks/useDepartmenet";
import { useDebouncedCallback } from "use-debounce";
function StaffManage() {
  const [getDeleteStaff, setGetDeleteStaff] = useState(null);
  const [getUpdateStaff, setGetUpdateStaff] = useState(null);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchStaff, setSerachStaff] = useState("");
  const {
    staffs,
    pagination,
    fetchStaffs,
    staffLoading,
    addStaff,
    deleteStaff,
    updateStaff,
  } = useStaffHook();

  const { fetchDepartments, departments, loading } = useDepartment();
  const currentFilters = {
    department: selectedDepartments,
    position: selectedPositions,
  };

  const debouncedFetch = useDebouncedCallback((value) => {
    fetchStaffs(1, {
      department: selectedDepartments,
      position: selectedPositions,
      staff_name: value,
    });
  }, 500);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchStaffs(1, currentFilters);
  }, [selectedDepartments, selectedPositions]);

  const handleDeleteStaff = (staff) => {
    setGetDeleteStaff(staff);
  };

  const confirmDeleteStaff = async () => {
    setDeleteLoading(true);
    try {
      await deleteStaff(getDeleteStaff.staff_id);
      await fetchStaffs(1, currentFilters);
      setGetDeleteStaff(null);
      toast.success("Delete Staff Success");
    } catch (error) {
      toast.error("Delete Staff Failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleUpdateStaff = (staff) => {
    setGetUpdateStaff(staff);
  };

  const handleOpenChange = (open) => {
    if (!open) {
      setGetUpdateStaff(null);
    }
  };

  const renderPageNumbers = () => {
    if (!pagination) return null;

    const { current_page, last_page } = pagination;
    const pages = [];

    const start = Math.max(1, current_page - 2);
    const end = Math.min(last_page, current_page + 2);

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("left-ellipsis");
    }

    for (let i = start; i <= end; i += 1) {
      pages.push(i);
    }

    if (end < last_page) {
      if (end < last_page - 1) pages.push("right-ellipsis");
      pages.push(last_page);
    }

    return pages.map((item, idx) => {
      if (typeof item !== "number") {
        return <PaginationEllipsis key={`${item}-${idx}`} />;
      }

      return (
        <PaginationItem key={item}>
          <PaginationLink
            href="#"
            isActive={item === current_page}
            onClick={(e) => {
              e.preventDefault();
              if (item !== current_page) {
                fetchStaffs(item, currentFilters);
              }
            }}
          >
            {item}
          </PaginationLink>
        </PaginationItem>
      );
    });
  };


  useEffect(() => {
    console.log(searchStaff)
  }, [searchStaff])


  return (
    <>
      <div className="mb-5">
        <StaffToolbar
          onSearchChange={(value) => {
            setSerachStaff(value);
            debouncedFetch(value);
          }}
          departments={departments}
          fetchDepartments={fetchDepartments}
          loading={loading}
          fetchStaffs={fetchStaffs}
          addStaff={addStaff}
          staffLoading={staffLoading}
          selectedDepartments={selectedDepartments}
          setSelectedDepartments={setSelectedDepartments}
          selectedPositions={selectedPositions}
          setSelectedPositions={setSelectedPositions}
        />
      </div>
      {/* Staff table Data  */}
      <div className="h-[85%] flex flex-col justify-between">
        <StaffTable
          staffs={staffs}
          staffLoading={staffLoading}
          deleteStaff={handleDeleteStaff}
          updateStaff={handleUpdateStaff}
        />
        {pagination && pagination.last_page > 1 && (
          <div className="flex items-center justify-between">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    className={
                      pagination.current_page <= 1
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      if (pagination.current_page > 1) {
                        fetchStaffs(pagination.current_page - 1, currentFilters);
                      }
                    }}
                  />
                </PaginationItem>

                {renderPageNumbers()}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    className={
                      pagination.current_page >= pagination.last_page
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      if (pagination.current_page < pagination.last_page) {
                        fetchStaffs(pagination.current_page + 1, currentFilters);
                      }
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>


      {/* Update Staff Dialog  */}
      <UpdateStaffDialog
        open={!!getUpdateStaff}
        staff={getUpdateStaff}
        updateStaff={updateStaff}
        fetchStaffs={fetchStaffs}
        staffLoading={staffLoading}
        handleOpenChange={handleOpenChange}
      />
      {/* Delete Staff Alert  */}
      <AlertDialog
        open={!!getDeleteStaff}
        onOpenChange={(open) =>
          !open && !deleteLoading && setGetDeleteStaff(null)
        }
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Staff?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <strong>
                {getDeleteStaff?.first_name} {getDeleteStaff?.last_name}
              </strong>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {/* prevent closing while deleting */}
            <AlertDialogCancel disabled={deleteLoading}>
              Cancel
            </AlertDialogCancel>
            {/* plain Button so dialog stays open during loading */}
            <Button
              variant="destructive"
              disabled={deleteLoading}
              onClick={confirmDeleteStaff}
            >
              {deleteLoading ? (
                <div className="flex items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Deleting...
                </div>
              ) : (
                "Delete"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default StaffManage;
