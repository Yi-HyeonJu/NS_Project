import axios from 'axios';
import { useState } from 'react';
import useStore from '../store/useStore';

const Schedule = () => {
  const { month, schedules } = useStore();
  const [offDays, setOffDays] = useState('');
  const [workDays, setWorkDays] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const scheduleData = {
      month,
      offDays: offDays.split(',').map((day) => day.trim()),
      workDays: workDays.split(',').map((day) => day.trim()),
      nurses: schedules, // 스토어에서 저장된 간호사 정보
    };

    try {
      console.log(scheduleData);
      const response = await axios.post(
        'http://your-server-endpoint.com/schedules',
        scheduleData
      );
      console.log('Data submitted successfully:', response.data);
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center gap-5 py-4'>
      <h2 className='text-[30px] font-semibold'>
        {month ? `${month} 근무표` : '근무표'}
      </h2>
      <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
        <div>
          <label>오프날 : </label>
          <input
            type='text'
            value={offDays}
            onChange={(e) => setOffDays(e.target.value)}
            placeholder='숫자만 입력해주세요.'
            className='p-1 border rounded border-main'
          />
        </div>
        <div>
          <label>근무날 : </label>
          <input
            type='text'
            value={workDays}
            onChange={(e) => setWorkDays(e.target.value)}
            placeholder='숫자만 입력해주세요.'
            className='p-1 border rounded border-main'
          />
        </div>
        <button
          type='submit'
          className='px-2 py-1 rounded-lg bg-border hover:bg-gray-400'
        >
          근무표 만들기
        </button>
      </form>
    </div>
  );
};

export default Schedule;
