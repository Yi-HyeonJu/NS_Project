import ScheduleForm from '../components/ScheduleForm';
import { useState } from 'react';
import useStore from '../store/useStore';

const Home = () => {
  const { addSchedule, setMonth } = useStore();
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  return (
    <div className='flex flex-col items-center justify-center gap-5 py-4'>
      <h2 className='text-[30px] font-semibold'>근무 인원 추가하기</h2>
      <ScheduleForm
        selectedDates={selectedDates}
        setSelectedDates={setSelectedDates}
        addSchedule={addSchedule}
        setMonth={setMonth}
      />
    </div>
  );
};

export default Home;
