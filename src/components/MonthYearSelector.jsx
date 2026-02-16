// MonthYearSelector.jsx
import { useState, useRef, useEffect } from "react";
import { CalendarDays } from 'lucide-react';

export default function MonthYearSelector() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() + i - 5
  );

  const handleMonthChange = (e) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(parseInt(e.target.value));
    setSelectedDate(newDate);
  };

  const handleYearChange = (e) => {
    const newDate = new Date(selectedDate);
    newDate.setFullYear(parseInt(e.target.value));
    setSelectedDate(newDate);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block w-full sm:w-fit">
      <button
        ref={buttonRef}
        onClick={() => setShowPicker(!showPicker)}
        className="input input-border px-4 py-2 rounded mb-1 flex items-center gap-2 shrink-0 text-text w-full"
      >
        <CalendarDays size={20} />
        {months[selectedDate.getMonth()]} {selectedDate.getFullYear()}
      </button>

      {showPicker && (
        <div 
          ref={dropdownRef}
          className="fixed md:absolute md:top-full md:left-0 mt-2 outline outline-amber-500 text-text border rounded shadow-lg p-4 w-64 bg-background z-[1000]"
        >
          <div className="flex gap-2 mb-4">
            <select
              value={selectedDate.getMonth()}
              onChange={handleMonthChange}
              className="flex-1 p-2 border rounded bg-background"
            >
              {months.map((month, index) => (
                <option key={month} value={index}>{month}</option>
              ))}
            </select>

            <select
              value={selectedDate.getFullYear()}
              onChange={handleYearChange}
              className="flex-1 p-2 border rounded bg-background"
            >
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowPicker(false)}
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}