import { useCallback, useEffect, useRef, useState } from "react";
import axios from "../../../api/axios";

const BASE_URL = import.meta.env.VITE_API_IMAGE_URL;

const joinUrl = (base, path) => {
  if (!path) return null;
  const cleanBase = base?.endsWith("/") ? base.slice(0, -1) : base;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
};

const useStaffHook = () => {
  const [rows, setRows] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // pagination meta
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [perPage, setPerPage] = useState(17);
  const [total, setTotal] = useState(0);

  // cache staff blobs by staffId (staff table id)
  const staffBlobCacheRef = useRef(new Map());
  const createdBlobUrlsRef = useRef([]);

  const getAccessToken = () => localStorage.getItem("access_token");

  const cleanupBlobs = () => {
    createdBlobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    createdBlobUrlsRef.current = [];
    staffBlobCacheRef.current.clear();
  };

  // ✅ staffId is STAFF table id (item.id)
  const downloadStaffBlobById = async (staffId) => {
    if (!staffId) return null;

    if (staffBlobCacheRef.current.has(staffId)) {
      return staffBlobCacheRef.current.get(staffId);
    }

    const token = getAccessToken();
    const res = await axios.get(`/staff/image_profile/${staffId}`, {
      responseType: "blob",
      headers: { Authorization: `Bearer ${token}` },
    });

    const blobUrl = URL.createObjectURL(res.data);
    staffBlobCacheRef.current.set(staffId, blobUrl);
    createdBlobUrlsRef.current.push(blobUrl);

    return blobUrl;
  };

  // ✅ NEW API item is "staff", and item.user is object or null
  const normalizeRow = async (item) => {
    const isLinked = !!item?.user; // ✅ THIS is the correct linked check

    // staff image (protected blob) — always based on staff ID
    let staffPhotoBlob = null;
    if (item?.profile_picture) {
      try {
        staffPhotoBlob = await downloadStaffBlobById(item.id);
      } catch {
        staffPhotoBlob = null;
      }
    }

    // priority: staff blob -> user photo -> null
    const photoSrc = staffPhotoBlob || null;

    return {
      // ✅ IMPORTANT: row id should be staff id (not user id)
      id: item?.id,

      // staff fields
      staff_id: item?.staff_id ?? null,
      label_id: item?.label_id ?? null,
      first_name: item?.first_name ?? "",
      last_name: item?.last_name ?? "",
      name: `${item?.first_name ?? ""} ${item?.last_name ?? ""}`.trim() || "-",
      email: item?.email ?? "-",
      phone_number: item?.phone_number ?? "-",
      staff_status: item?.status ?? "-",
      date_of_joining: item?.date_of_joining ?? "-",
      date_of_birth: item?.date_of_birth ?? "-",

      department_name: item?.department?.department_name ?? "-",
      position_name: item?.position?.position_name ?? "-",

      // linked user fields
      user_id: item?.user?.id ?? null,
      role_name: item?.user?.role?.role_name ?? "-", // will be "-" unless backend includes role
      isLinked, // ✅ use this in table "Linked" column

      photoSrc,
      raw: item,
    };
  };

  const fetchPage = useCallback(async (targetPage = 1) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get("/staff/get_all_staff", {
        params: { page: targetPage },
      });

      // ✅ Based on your API JSON: res.data.message.data is the paginator
      const paginator = res.data?.message?.data || res.data?.data;
      const list = paginator?.data ?? [];

      setPage(paginator?.current_page ?? targetPage);
      setLastPage(paginator?.last_page ?? 1);
      setPerPage(paginator?.per_page ?? 12);
      setTotal(paginator?.total ?? 0);

      const normalized = await Promise.all(list.map(normalizeRow));
      setRows(normalized);
    } catch (err) {
      setError(err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  useEffect(() => {
    return () => cleanupBlobs();
  }, []);

  const handleDeleteStaff = async (staffId) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.delete("staff/delete_staffs", {
        data: { staff_ids: [staffId] },
      });
      console.log(res);
      return res;
    } catch (err) {
      setError(err);
      return err;
    } finally {
      setLoading(false);
    }
  };

  return {
    handleDeleteStaff,

    rows,
    loading,
    error,

    page,
    lastPage,
    perPage,
    total,

    goToPage: fetchPage,
    nextPage: () => fetchPage(Math.min(page + 1, lastPage)),
    prevPage: () => fetchPage(Math.max(page - 1, 1)),
    refetch: () => fetchPage(page),
  };
};

export default useStaffHook;
