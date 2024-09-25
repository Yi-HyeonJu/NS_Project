interface Nurse {
  name: string;
  is_senior: boolean;
}

interface Shift {
  nurse: Nurse;
  shift: string;
}

interface ScheduleDay {
  date: string;
  shifts: Shift[];
}

interface WorkCalendarProps {
  scheduleData: ScheduleDay[];
}

const WorkCalendar: React.FC<WorkCalendarProps> = ({ scheduleData }) => {
  const getStartOfMonth = (date: string): Date => {
    const [year, month] = date.split('-');
    return new Date(parseInt(year), parseInt(month) - 1, 1);
  };

  const renderDays = () => {
    const firstDayOfMonth = getStartOfMonth(scheduleData[0].date);
    const startWeekday = firstDayOfMonth.getDay();

    const emptyDays = Array.from({ length: startWeekday }, (_, index) => (
      <div key={`empty-${index}`} className='p-2'></div>
    ));

    const days = [
      ...emptyDays,
      ...scheduleData.map((day, index) => (
        <div key={index} className='relative p-2 border border-gray-100'>
          <h3 className='mb-2 font-semibold text-center border-b'>
            {new Date(day.date).getDate()}일
          </h3>
          <div className='flex flex-col items-start justify-center'>
            {day.shifts.length > 0 ? (
              day.shifts.map((shift, shiftIndex) => (
                <div key={shiftIndex}>
                  <span
                    className={shift.nurse.is_senior ? 'bg-orange-100' : ''}
                  >
                    {shift.nurse.name} - {shift.shift}
                  </span>
                </div>
              ))
            ) : (
              <span>근무 없음</span>
            )}
          </div>
        </div>
      )),
    ];

    return days;
  };

  return (
    <div>
      <div className='grid grid-cols-7 gap-2 mb-4'>
        {/* 요일 헤더 추가 */}
        {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
          <div
            key={index}
            className='bg-yellow-300 text-center text-[20px] font-bold'
          >
            {day}
          </div>
        ))}
      </div>
      <div className='grid grid-cols-7 gap-4'>{renderDays()}</div>
    </div>
  );
};

export default WorkCalendar;
