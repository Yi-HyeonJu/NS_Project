import axios, { AxiosError } from 'axios';

import WorkCalendar from '../components/WorkCalendar';
import { useState } from 'react';
import useStore from '../store/useStore';

const Schedule = () => {
  const { month, schedules } = useStore();
  const [offDays, setOffDays] = useState<string | undefined>('');
  const [workDays, setWorkDays] = useState<string | undefined>('');
  const [scheduleData, setScheduleData] = useState<[] | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const today = new Date();
    const nextMonthFirstDay = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      1
    );
    const nextMonthLastDay = new Date(
      today.getFullYear(),
      today.getMonth() + 2,
      0
    );

    const start_weekday = nextMonthFirstDay.toLocaleDateString('en-US', {
      weekday: 'long',
    });
    const total_days = nextMonthLastDay.getDate();

    const nurses = schedules.map((schedule, index) => ({
      id: index + 1,
      name: schedule.name,
      is_senior: schedule.isSupervisor,
      vacation_days: schedule.selectedDates,
    }));

    const scheduleData = {
      total_off_days: offDays ? parseInt(offDays, 10) : 0,
      total_work_days: workDays ? parseInt(workDays, 10) : 0,
      start_weekday,
      total_days,
      nurses,
    };

    try {
      console.log(scheduleData);

      await axios.delete('http://api.schdule.site/nurses/nurses/delete/');

      const response = await axios.post(
        // 'http://127.0.0.1:8000/nurses/generate_schedule/',
        'http://api.schdule.site/nurses/generate_schedule/',
        scheduleData
      );
      console.log('Data submitted successfully:', response.data);
      setScheduleData(response.data);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 500) {
        alert('인원수가 부족합니다. 인원을 확인해주세요.');
      } else {
        console.error('Error submitting data:', error);
      }
    }
  };

  return (
    <div className='flex flex-col items-center justify-center gap-5 py-4'>
      <h2 className='text-[30px] font-semibold'>
        {month ? `${month} 근무표` : '근무표'}
      </h2>
      {/* scheduleData가 null인 경우에만 폼을 보여줌 */}
      {scheduleData === null ? (
        <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
          <div>
            <label>오프날 : </label>
            <input
              type='number'
              min='0'
              value={offDays}
              onChange={(e) => setOffDays(e.target.value)}
              placeholder='숫자만 입력해주세요.'
              className='rounded border border-main p-1'
            />
          </div>
          <div>
            <label>근무날 : </label>
            <input
              type='number'
              min='0'
              value={workDays}
              onChange={(e) => setWorkDays(e.target.value)}
              placeholder='숫자만 입력해주세요.'
              className='rounded border border-main p-1'
            />
          </div>
          <button
            type='submit'
            className='rounded-lg bg-border px-2 py-1 hover:bg-gray-400'
          >
            근무표 만들기
          </button>
        </form>
      ) : (
        <WorkCalendar scheduleData={scheduleData} />
      )}
    </div>
  );
};

export default Schedule;
