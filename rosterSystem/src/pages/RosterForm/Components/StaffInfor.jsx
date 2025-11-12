import React from "react";

function StaffInfor({
  staff_profile,
  staff_name,
  staff_position,
  staff_id,
  staff_gender,
}) {
  return (
    <div className="flex gap-3 h-full">
      <div className="user-profile border flex justify-center items-center bg-yellow-50 w-10 h-10 overflow-hidden rounded-full">
        <img
          src={staff_profile}
          className="w-full h-full object-cover"
          alt=""
        />
      </div>
      <div className="staff-infor flex flex-col">
        <p>
          Name : <span className="font-bold ">{staff_name}</span>
        </p>
        <p className="text-[12px] text-gray-700 dark:text-gray-400">
          ID : {staff_id}, Position : {staff_position}, Gender : {staff_gender}
        </p>
      </div>
    </div>
  );
}

export default StaffInfor;
