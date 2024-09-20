import useStore from '../store/useStore';

const List = () => {
  const { schedules } = useStore();

  const handleDelete = (index: number) => {
    useStore.setState((state) => ({
      schedules: state.schedules.filter((_, i) => i !== index),
    }));
  };

  const handleEdit = (index: number) => {
    const scheduleToEdit = schedules[index];
    const newName = prompt('이름을 입력하세요', scheduleToEdit.name);
    const confirmSupervisor = confirm(
      '사수 여부를 수정하시겠습니까? \n확인: 사수, 취소: 부사수'
    );
    const newIsSupervisor = confirmSupervisor
      ? true
      : scheduleToEdit.isSupervisor;

    const daysInput = prompt(
      `연차 사용 날짜를 입력해주세요 \n몇 일 사용하실 건가요? (쉼표로 구분)`,
      scheduleToEdit.selectedDates
        .map((date) => date.getDate()) // 날짜만 추출
        .join(', ') // 쉼표로 구분
    );

    const daysArray = daysInput
      ?.split(/,\s*/g)
      .map((dayStr) => parseInt(dayStr.trim(), 10))
      .filter((day) => !isNaN(day))
      .filter((day, index, self) => self.indexOf(day) === index);

    const currentMonth = new Date().getMonth() + 1;
    const daysInMonth = new Date(
      new Date().getFullYear(),
      currentMonth + 1,
      0
    ).getDate();

    const newDates = daysArray
      ?.map((days) => {
        // 유효한 날짜인지 확인
        if (days > 0 && days <= daysInMonth) {
          const newDate = new Date();
          newDate.setMonth(newDate.getMonth() + 1);
          newDate.setDate(days);
          return newDate;
        }
        return null; // 유효하지 않은 날짜는 null로 처리
      })
      .filter((date) => date !== null); // null 필터링

    const sortedDates = (newDates || []).sort(
      (a, b) => a.getDate() - b.getDate()
    );

    const formattedDates =
      sortedDates?.map((date) => {
        const weekday = date
          .toLocaleDateString('ko-KR', { weekday: 'short' })
          .slice(0, 1);
        return `${date.getMonth() + 1}월 ${date.getDate()}일(${weekday})`;
      }) || [];

    if (newName) {
      useStore.setState((state) => ({
        schedules: state.schedules.map((schedule, i) =>
          i === index
            ? {
                ...schedule,
                name: newName,
                isSupervisor: newIsSupervisor,
                selectedDates: sortedDates,
                formattedDates: formattedDates,
              }
            : schedule
        ),
      }));
    }
  };

  return (
    <div className='p-4'>
      <h2 className='mb-4 text-xl font-semibold'>간호사 목록</h2>
      <ul className='list-disc space-y-2 pl-5'>
        {schedules.map((schedule, index) => (
          <li key={index} className='flex items-center justify-between'>
            <span className='flex gap-2'>
              {`${schedule.name} (${schedule.isSupervisor ? '사수' : '부사수'})`}
              {schedule.selectedDates.length > 0 && (
                <span>: {schedule.formattedDates.join(', ')}</span>
              )}
            </span>
            <div className='flex space-x-2'>
              <button
                onClick={() => handleEdit(index)}
                className='text-blue-500'
              >
                수정
              </button>
              <button
                onClick={() => handleDelete(index)}
                className='text-red-500'
              >
                삭제
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default List;
