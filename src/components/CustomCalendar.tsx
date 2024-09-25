import { useEffect, useState } from 'react';

interface CustomCalendarProps {
  onSelectDate: (date: Date) => void;
  selectedDates: Date[];
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  onSelectDate,
  selectedDates,
}) => {
  const [calendarDays, setCalendarDays] = useState<(Date | null)[]>([]);
  const [displayMonth, setDisplayMonth] = useState<Date>(new Date());

  useEffect(() => {
    const currentDate = new Date();
    const nextMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );
    setDisplayMonth(nextMonth);

    const year = nextMonth.getFullYear();
    const month = nextMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    for (let d = firstDay; d <= lastDay; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }

    setCalendarDays(days);
  }, []);

  const isDateSelected = (date: Date | null): boolean => {
    return (
      !!date &&
      selectedDates.some(
        (selectedDate) =>
          selectedDate.getDate() === date.getDate() &&
          selectedDate.getMonth() === date.getMonth() &&
          selectedDate.getFullYear() === date.getFullYear()
      )
    );
  };

  return (
    <div className='w-full max-w-md mx-auto'>
      <div className='mb-4 font-bold text-center'>
        {displayMonth.getFullYear()}년 {displayMonth.getMonth() + 1}월
      </div>
      <div className='grid grid-cols-7 gap-1 mb-4'>
        {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
          <div key={day} className='p-2 font-bold text-center'>
            {day}
          </div>
        ))}
        {calendarDays.map((day, index) => (
          <div key={index} className='p-1'>
            {day ? (
              <button
                type='button'
                onClick={() => onSelectDate(day)}
                className={`w-full rounded p-2 text-center ${
                  isDateSelected(day)
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-200'
                }`}
              >
                {day.getDate()}
              </button>
            ) : (
              <span className='p-2'>&nbsp;</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomCalendar;
