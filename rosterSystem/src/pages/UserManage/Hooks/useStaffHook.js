import { useCallback, useEffect, useRef, useState } from "react";
import axios from "../../../api/axios";

const BASE_URL = import.meta.env.VITE_API_IMAGE_URL; // http://127.0.0.1:8000

const joinUrl = (base, path) => {
    if (!path) return null;
    const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
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

    // cache staff blobs by staff_id
    const staffBlobCacheRef = useRef(new Map());
    const createdBlobUrlsRef = useRef([]);

    const getAccessToken = () => localStorage.getItem("access_token");

    const cleanupBlobs = () => {
        createdBlobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
        createdBlobUrlsRef.current = [];
        staffBlobCacheRef.current.clear();
    };

    const downloadStaffBlobById = async (staffId) => {
        if (staffBlobCacheRef.current.has(staffId)) {
            return staffBlobCacheRef.current.get(staffId);
        }

        const token = getAccessToken();
        const url = `${BASE_URL}/api/staff/image_profile/${staffId}`;

        const res = await axios.get(url, {
            responseType: "blob",
            headers: { Authorization: `Bearer ${token}` },
        });

        const blobUrl = URL.createObjectURL(res.data);
        staffBlobCacheRef.current.set(staffId, blobUrl);
        createdBlobUrlsRef.current.push(blobUrl);

        return blobUrl;
    };

    const normalizeRow = async (item) => {
        const staff = item?.staff ?? null;
        const isLinkedStaff = !!item?.staff_id;

        // public user image
        const userPhotoUrl = item?.profile_image
            ? joinUrl(BASE_URL, item.profile_image)
            : null;

        // protected staff image (blob)
        let staffPhotoBlob = null;
        if (isLinkedStaff) {
            try {
                staffPhotoBlob = await downloadStaffBlobById(item.staff_id);
            } catch {
                staffPhotoBlob = null;
            }
        }

        // priority: staff blob (if linked) -> user public -> null
        const photoSrc = staffPhotoBlob || userPhotoUrl || null;

        return {
            user_id: item?.id,
            staff_id: item?.staff_id ?? null,

            name: item?.name ?? "-",
            email: item?.email ?? "-",
            role_name: item?.role?.role_name ?? "-",

            department_name: staff?.department?.department_name ?? "-",
            position_name: staff?.position?.position_name ?? "-",
            phone_number: staff?.phone_number ?? "-",
            staff_status: staff?.status ?? "-",

            photoSrc,
            raw: item,
        };
    };

    const fetchPage = useCallback(
        async (targetPage = 1) => {
            try {
                setLoading(true);
                setError(null);

                const res = await axios.get("/staff/get_all_staff", {
                    params: { page: targetPage },
                });

                // ✅ new api shape: res.data.data is paginator object
                const paginator = res.data?.data;

                const list = paginator?.data ?? [];

                // set pagination meta
                setPage(paginator?.current_page ?? targetPage);
                setLastPage(paginator?.last_page ?? 1);
                setPerPage(paginator?.per_page ?? 17);
                setTotal(paginator?.total ?? 0);

                // normalize + load staff images for linked staff
                const normalized = await Promise.all(list.map(normalizeRow));
                setRows(normalized);
            } catch (err) {
                setError(err);
                setRows([]);
            } finally {
                setLoading(false);
            }
        },
        [] // refs are stable; axios instance stable
    );

    // load first page
    useEffect(() => {
        fetchPage(1);
    }, [fetchPage]);

    // cleanup blobs on unmount
    useEffect(() => {
        return () => cleanupBlobs();
    }, []);

    return {
        rows,
        loading,
        error,

        // pagination
        page,
        lastPage,
        perPage,
        total,

        // actions
        goToPage: fetchPage,
        nextPage: () => fetchPage(Math.min(page + 1, lastPage)),
        prevPage: () => fetchPage(Math.max(page - 1, 1)),
        refetch: () => fetchPage(page),
    };
};

export default useStaffHook;
