interface Nurse {
  name: string;
  is_senior: boolean; // 추가적인 정보가 필요하면 여기에 추가하세요
}

interface Shift {
  nurse: Nurse;
  shift: string;
}

interface ScheduleDay {
  date: string; // YYYY-MM-DD 형식으로 가정
  shifts: Shift[];
}

interface WorkCalendarProps {
  scheduleData: ScheduleDay[];
}

const WorkCalendar: React.FC<WorkCalendarProps> = ({ scheduleData }) => {
  const renderDays = () => {
    return scheduleData.map((day, index) => (
      <div key={index} className='p-2 border'>
        <h3 className='font-semibold'>{day.date}</h3>
        <div>
          {day.shifts.length > 0 ? (
            day.shifts.map((shift, shiftIndex) => (
              <div key={shiftIndex}>
                <span>
                  {shift.nurse.name} - {shift.shift}
                </span>
              </div>
            ))
          ) : (
            <span>근무 없음</span>
          )}
        </div>
      </div>
    ));
  };

  return <div className='grid grid-cols-7 gap-4'>{renderDays()}</div>;
};

export default WorkCalendar;
