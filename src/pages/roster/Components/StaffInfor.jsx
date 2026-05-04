import React, { useState, useEffect } from "react";
import axios from "../../../api/axios";
function StaffInfor({
  staff_profile,
  staff_name,
  staff_position,
  staff_id,
  staff_gender,
}) {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    // If we have a staff_id, fetch the image as a blob
    if (staff_id) {
      const fetchImage = async () => {
        try {

          const response = await axios.get(`staff/image_profile/${staff_id}`, {
            responseType: 'blob'
          });

          if (response.status === 200) {
            const url = URL.createObjectURL(response.data);
            setImageUrl(url);
          }
        } catch (error) {
          console.error("Error fetching staff profile image:", error);
        }
      };

      fetchImage();

      // Clean up the object URL when component unmounts
      return () => {
        if (imageUrl) URL.revokeObjectURL(imageUrl);
      };
    }
  }, [staff_id]);

  return (
    <div className="flex gap-3 h-full items-center">
      <div className="user-profile border flex justify-center items-center bg-muted w-10 h-10 overflow-hidden rounded-full shrink-0 shadow-sm">
        {imageUrl ? (
          <img
            src={imageUrl}
            className="w-full h-full object-cover"
            alt={staff_name}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-[10px] font-bold uppercase">
            {staff_name?.substring(0, 2)}
          </div>
        )}
      </div>
      <div className="staff-infor flex flex-col min-w-0">
        <p className="font-semibold text-sm truncate" title={staff_name}>
          {staff_name}
        </p>
        <p className="text-[10px] text-muted-foreground uppercase tracking-tight">
          ID: {staff_id} • {staff_position}
        </p>
      </div>
    </div>
  );
}

export default StaffInfor;
