import StaffTable from "./components/StaffTable";
import StaffToolbar from "./components/StaffToolbar";
import useStaffHook from "./hooks/useStaffHook";
import { useEffect, useState } from "react";
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

function StaffManage() {
  const [getDeleteStaff, setGetDeleteStaff] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { staffs, fetchStaffs, staffLoading, addStaff, deleteStaff } =
    useStaffHook();

  useEffect(() => {
    fetchStaffs();
  }, []);

  const handleDeleteStaff = (staff) => {
    setGetDeleteStaff(staff);
  };

  const confirmDeleteStaff = async () => {
    setDeleteLoading(true);
    try {
      await deleteStaff(getDeleteStaff.staff_id);
      await fetchStaffs();
      setGetDeleteStaff(null);
      toast.success("Delete Staff Success");
    } catch (error) {
      toast.error("Delete Staff Failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <div className="mb-5">
        <StaffToolbar
          fetchStaffs={fetchStaffs}
          addStaff={addStaff}
          staffLoading={staffLoading}
        />
      </div>
      <StaffTable
        staffs={staffs}
        fetchStaffs={fetchStaffs}
        staffLoading={staffLoading}
        deleteStaff={handleDeleteStaff}
      />

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
            {/* ✅ prevent closing while deleting */}
            <AlertDialogCancel disabled={deleteLoading}>
              Cancel
            </AlertDialogCancel>
            {/* ✅ plain Button so dialog stays open during loading */}
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
