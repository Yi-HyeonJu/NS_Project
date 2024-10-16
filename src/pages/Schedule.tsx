import WorkCalendar from '../components/WorkCalendar';
import axios from 'axios';
import { useState } from 'react';
import useStore from '../store/useStore';

const weekdayNursesNeeded = 8; // 평일에 필요한 간호사 수
const weekendNursesNeeded = 6; // 주말에 필요한 간호사 수

const Schedule = () => {
  const { month, schedules } = useStore();
  const [offDays, setOffDays] = useState<string>('');
  const [scheduleData, setScheduleData] = useState<[] | null>(null);
  const [isSufficient, setIsSufficient] = useState<boolean>(false);

  // 다음 월의 총 일수를 계산하는 함수
  const getTotalDays = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // 최소 간호사 수를 계산하는 함수
  const calculateMinNurses = (
    totalDays: number,
    totalOffDays: number
  ): number => {
    const totalWorkDays = totalDays - totalOffDays;

    const totalNurseShiftsNeeded =
      totalWorkDays * weekdayNursesNeeded + totalOffDays * weekendNursesNeeded;
    const maxWorkDaysPerNurse = 5 * Math.floor(totalDays / 7);

    return Math.max(Math.ceil(totalNurseShiftsNeeded / maxWorkDaysPerNurse), 1);
  };

  // 오프날과 근무날 수 계산
  const calculateOffAndWorkDays = () => {
    const totalOffDays = Math.max(0, parseInt(offDays, 10));
    const today = new Date();
    const totalDays = getTotalDays(today.getFullYear(), today.getMonth() + 1);
    return { totalWorkDays: totalDays - totalOffDays, totalDays, totalOffDays };
  };

  const handleCheckMinimumStaff = () => {
    const { totalOffDays, totalDays } = calculateOffAndWorkDays();
    const totalNurses = schedules.length; // 전체 간호사 수
    const minNursesNeeded = calculateMinNurses(totalDays, totalOffDays);

    if (totalNurses >= minNursesNeeded) {
      alert('인원이 충분합니다. 근무표를 만들어 주세요.');
      setIsSufficient(true); // 충분할 경우 상태 변경
    } else {
      alert(`인원이 부족합니다. 최소인원 : ${minNursesNeeded}`);
      setIsSufficient(false); // 부족할 경우 상태 변경
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isSufficient) {
      alert('먼저 최소인원을 확인해 주세요.');
      return;
    }

    const { totalOffDays, totalDays } = calculateOffAndWorkDays();
    if (totalOffDays > totalDays) {
      alert('오프날 수가 총 일수를 초과할 수 없습니다.');
      return;
    }

    const today = new Date();
    const start_weekday = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      1
    ).toLocaleDateString('en-US', {
      weekday: 'long',
    });

    const nurses = schedules.map((schedule, index) => ({
      id: index + 1,
      name: schedule.name,
      is_senior: schedule.isSupervisor,
      vacation_days: schedule.selectedDates,
    }));

    const scheduleData = {
      total_off_days: totalOffDays,
      total_work_days: totalDays - totalOffDays,
      start_weekday,
      total_days: totalDays,
      nurses,
    };

    try {
      console.log(scheduleData);

      await axios.delete('https://api.schdule.site/nurses/nurses/delete/');

      const response = await axios.post(
        // 'https://127.0.0.1:8000/nurses/generate_schedule/',
        'https://api.schdule.site/nurses/generate_schedule/',
        scheduleData
      );
      console.log('Data submitted successfully:', response.data);
      setScheduleData(response.data);
    } catch (error) {
      console.error('Error submitting data:', error);
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
          <div className='mt-5'>
            <label>오프날 : </label>
            <input
              type='number'
              min='0'
              value={offDays}
              onChange={(e) => setOffDays(e.target.value)}
              placeholder='숫자만 입력해주세요.'
              className='p-1 border rounded border-main'
            />
          </div>

          <button
            type='button'
            onClick={handleCheckMinimumStaff}
            className='px-2 py-1 bg-orange-200 rounded-lg hover:bg-orange-300'
          >
            최소 근무인원 확인
          </button>

          <button
            type='submit'
            className='px-2 py-1 mt-5 rounded-lg bg-border hover:bg-gray-400'
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
