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
    const days = [];

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

  const monthNames = [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ];

  return (
    <div className='mx-auto w-full max-w-md'>
      <div className='mb-4 text-center font-bold'>
        {displayMonth.getFullYear()}년 {monthNames[displayMonth.getMonth()]}
      </div>
      <div className='grid grid-cols-7 gap-1'>
        {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
          <div key={day} className='p-2 text-center font-bold'>
            {day}
          </div>
        ))}
        {calendarDays.map((day, index) => (
          <div key={index} className='p-2'>
            {day ? (
              <button
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

const Home = () => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [tempSelectedDates, setTempSelectedDates] = useState<Date[]>([]);
  const [isSelectionComplete, setIsSelectionComplete] = useState(false);

  // 날짜 선택 시 임시 상태 업데이트
  const handleDateChange = (date: Date) => {
    setTempSelectedDates((prevDates) => {
      const dateExists = prevDates.find(
        (d) =>
          d.getDate() === date.getDate() &&
          d.getMonth() === date.getMonth() &&
          d.getFullYear() === date.getFullYear()
      );
      if (dateExists) {
        return prevDates.filter((d) => d !== dateExists);
      } else {
        return [...prevDates.concat(date)].sort(
          (a, b) => a.getTime() - b.getTime()
        );
      }
    });
  };

  const handleRestClick = () => {
    setIsCalendarOpen(true);
    setIsSelectionComplete(false);
    setTempSelectedDates(selectedDates);
  };

  const handleDoneClick = () => {
    setIsCalendarOpen(false);
    setIsSelectionComplete(true);
    setSelectedDates(tempSelectedDates);
  };

  const handleEditClick = () => {
    setIsCalendarOpen(true);
    setTempSelectedDates(selectedDates);
  };

  const formatDate = (date: Date): string => {
    const monthNames = [
      '1월',
      '2월',
      '3월',
      '4월',
      '5월',
      '6월',
      '7월',
      '8월',
      '9월',
      '10월',
      '11월',
      '12월',
    ];
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    return `${monthNames[date.getMonth()]} ${date.getDate()}일(${dayNames[date.getDay()]})`;
  };

  return (
    <div className='flex flex-col items-center justify-center gap-5 py-4'>
      <p className='text-[30px] font-semibold'>간호사 스케줄표</p>
      <form className='flex w-[400px] flex-col gap-7 rounded-md border p-5'>
        <div className='flex w-[100%] items-center'>
          <span className='w-[30%]'>이름 :</span>
          <input
            id='name'
            type='text'
            className='w-[70%] rounded-md border border-main px-2 py-1'
          />
        </div>
        <div className='flex w-[100%] items-center'>
          <span className='w-[30%]'>사수 여부 :</span>
          <div className='flex w-[70%] items-center gap-3'>
            <input id='check' type='checkbox' className='h-6 w-6' />
            <span className='text-sm'>(미체크시 부사수)</span>
          </div>
        </div>
        <div className='flex w-[100%] items-start'>
          <span className='w-[30%] pt-2'>연차 사용 :</span>
          <div className='w-[70%]'>
            {!isSelectionComplete ? (
              <button
                type='button'
                onClick={handleRestClick}
                className='w-full rounded-md border border-main px-2 py-1 text-left text-main'
              >
                {selectedDates.length > 0
                  ? '선택된 날짜'
                  : '날짜를 선택해주세요'}
              </button>
            ) : (
              <div className='mt-2'>
                {selectedDates.map((date, index) => (
                  <div key={index} className='text-sm'>
                    {formatDate(date)}
                  </div>
                ))}
                <button
                  type='button'
                  onClick={handleEditClick}
                  className='mt-2 rounded-md border bg-blue-500 px-2 py-1 text-white'
                >
                  날짜 수정
                </button>
              </div>
            )}
          </div>
        </div>
        <button
          type='submit'
          className='w-fit self-center rounded-md border bg-border px-2 py-1'
        >
          추가하기
        </button>
      </form>
      {isCalendarOpen && (
        <div className='calendar-container flex flex-col items-center justify-center'>
          <CustomCalendar
            onSelectDate={handleDateChange}
            selectedDates={tempSelectedDates}
          />
          <button
            type='button'
            onClick={handleDoneClick}
            className='mt-2 w-20 rounded bg-green-500 px-2 py-1 text-white'
          >
            완료
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
