import ScheduleForm from '../components/ScheduleForm';
import useStore from '../store/useStore';

const Home = () => {
  const { addSchedule, setMonth } = useStore();

  return (
    <div className='flex flex-col items-center justify-center gap-5 py-4'>
      <h2 className='text-[30px] font-semibold'>근무 인원 추가하기</h2>
      <ScheduleForm addSchedule={addSchedule} setMonth={setMonth} />
    </div>
  );
};

export default Home;
