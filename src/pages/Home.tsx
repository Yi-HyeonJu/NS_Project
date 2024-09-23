import CustomCalendar from '../components/CustomCalendar';
import { useState } from 'react';
import useStore from '../store/useStore';

const Home = () => {
  const { addSchedule } = useStore();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [tempSelectedDates, setTempSelectedDates] = useState<Date[]>([]);
  const [isSelectionComplete, setIsSelectionComplete] = useState(false);
  const [name, setName] = useState('');
  const [isSupervisor, setIsSupervisor] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedDates = selectedDates.map((date) => formatDate(date));

    addSchedule({
      name,
      isSupervisor,
      selectedDates,
      formattedDates,
    });

    setName('');
    setIsSupervisor(false);
    setSelectedDates([]);
    setTempSelectedDates([]);
    setIsSelectionComplete(false);

    console.log({ name, isSupervisor, selectedDates: formattedDates });
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
      <h2 className='text-[30px] font-semibold'>근무 인원 추가하기</h2>
      <form className='flex w-[400px] flex-col gap-7 rounded-md border p-5'>
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
              className='h-6 w-6'
            />
            <span className='text-sm text-main'>(미체크시 부사수)</span>
          </div>
        </div>
        <div className='flex w-[100%] items-center'>
          <span className='w-[30%] pt-2 text-main'>연차 사용 :</span>
          <button
            type='button'
            onClick={handleRestClick}
            className='w-[70%] rounded-md border border-main px-2 py-1 text-left text-main'
          >
            {selectedDates.length > 0 ? '날짜 수정하기' : '날짜를 선택해주세요'}
          </button>
        </div>
        {isCalendarOpen && (
          <div className='flex flex-col items-center justify-center rounded-md border border-border p-3'>
            <CustomCalendar
              onSelectDate={handleDateChange}
              selectedDates={tempSelectedDates}
            />
            <button
              type='button'
              onClick={handleDoneClick}
              className='w-20 rounded bg-green-500 px-2 py-1 text-white'
            >
              완료
            </button>
          </div>
        )}
        {isSelectionComplete && selectedDates.length > 0 && (
          <div className='flex w-[100%]'>
            <h3 className='w-[30%]'>선택한 날짜 :</h3>
            <div className='w-[70%]'>
              {selectedDates.map((date, index) => (
                <div key={index} className='text-sm'>
                  {formatDate(date)}
                </div>
              ))}
            </div>
          </div>
        )}
        <button
          type='submit'
          onClick={handleSubmit}
          className='w-fit self-center rounded-md border bg-border px-2 py-1 hover:bg-gray-400'
        >
          추가하기
        </button>
      </form>
    </div>
  );
};

export default Home;
