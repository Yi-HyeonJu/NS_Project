import CustomCalendar from './CustomCalendar';
import { formatDate } from '../utils/dateUtils';
import { useState } from 'react';

interface ScheduleFormProps {
  addSchedule: (schedule: any) => void;
  setMonth: (monthString: string) => void;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({
  addSchedule,
  setMonth,
}) => {
  const [name, setName] = useState('');
  const [isSupervisor, setIsSupervisor] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [tempSelectedDates, setTempSelectedDates] = useState<Date[]>([]);
  const [isSelectionComplete, setIsSelectionComplete] = useState(false);

  const handleDateChange = (date: Date) => {
    const localDate = new Date(date);
    localDate.setHours(0, 0, 0, 0);

    setTempSelectedDates((prevDates) => {
      const dateExists = prevDates.find(
        (d) => d.getTime() === localDate.getTime()
      );
      if (dateExists) {
        return prevDates.filter((d) => d !== dateExists);
      } else {
        return [...prevDates.concat(localDate)].sort(
          (a, b) => a.getTime() - b.getTime()
        );
      }
    });
  };

  const handleRestClick = () => {
    setIsCalendarOpen(true);
    setIsSelectionComplete(false);
    setTempSelectedDates([...tempSelectedDates]);
  };

  const handleDoneClick = () => {
    setIsCalendarOpen(false);
    setIsSelectionComplete(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedDates =
      tempSelectedDates.length > 0
        ? tempSelectedDates.map((date) => formatDate(date))
        : [];

    const today = new Date();
    const nextMonthDate = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      1
    );
    const year = nextMonthDate.getFullYear();
    const month = nextMonthDate.getMonth() + 1;
    const monthString = `${year}년 ${month}월`;

    addSchedule({
      name,
      isSupervisor,
      formattedDates,
    });

    setMonth(monthString);

    setName('');
    setIsSupervisor(false);
    setTempSelectedDates([]);
    setIsSelectionComplete(false);
  };

  return (
    <form
      className='flex w-[400px] flex-col gap-7 rounded-md border p-5'
      onSubmit={handleSubmit}
    >
      <div className='flex w-[100%] items-center'>
        <span className='w-[30%] text-main'>이름 :</span>
        <input
          id='name'
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='w-[70%] rounded-md border border-main px-2 py-1'
        />
      </div>
      <div className='flex w-[100%] items-center'>
        <span className='w-[30%] text-main'>사수 여부 :</span>
        <div className='flex w-[70%] items-center gap-3'>
          <input
            id='check'
            type='checkbox'
            checked={isSupervisor}
            onChange={() => setIsSupervisor((prev) => !prev)}
            className='w-6 h-6'
          />
          <span className='text-sm text-main'>(미체크시 부사수)</span>
        </div>
      </div>
      <div className='flex w-[100%] items-center'>
        <span className='w-[30%] text-main'>연차 사용 :</span>
        <button
          type='button'
          onClick={handleRestClick}
          className='w-[70%] rounded-md border border-main px-2 py-1 text-left text-main'
        >
          {tempSelectedDates.length > 0
            ? '날짜 수정하기'
            : '날짜를 선택해주세요'}
        </button>
      </div>
      {isCalendarOpen && (
        <div className='flex flex-col items-center justify-center p-3 border rounded-md border-border'>
          <CustomCalendar
            onSelectDate={handleDateChange}
            selectedDates={tempSelectedDates}
          />
          <button
            type='button'
            onClick={handleDoneClick}
            className='w-20 px-2 py-1 text-white bg-green-500 rounded'
          >
            완료
          </button>
        </div>
      )}
      {isSelectionComplete && tempSelectedDates.length > 0 && (
        <div className='flex w-[100%]'>
          <h3 className='w-[30%]'>선택한 날짜 :</h3>
          <div className='w-[70%]'>
            {tempSelectedDates.map((date, index) => (
              <div key={index} className='text-sm'>
                {formatDate(date)}
              </div>
            ))}
          </div>
        </div>
      )}
      <button
        type='submit'
        className='self-center px-2 py-1 border rounded-md w-fit bg-border hover:bg-gray-400'
      >
        추가하기
      </button>
    </form>
  );
};

export default ScheduleForm;
