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

    if (!newName) return;

    const confirmSupervisor = confirm(
      '사수 여부를 수정하시겠습니까? \n확인: 사수, 취소: 부사수'
    );
    const newIsSupervisor = confirmSupervisor;

    const daysInput = prompt(
      `연차 사용 날짜를 입력해주세요 \n몇 일 사용하실 건가요? (쉼표로 구분)`,
      scheduleToEdit.selectedDates
        .map((date) => {
          const day = new Date(date).getDate();
          return day;
        })
        .join(', ')
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
        if (days > 0 && days <= daysInMonth) {
          const newDate = new Date();
          newDate.setMonth(newDate.getMonth() + 1);
          newDate.setDate(days);
          return newDate;
        }
        return null;
      })
      .filter((date) => date !== null);

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
                selectedDates:
                  sortedDates?.map(
                    (date) => date.toISOString().split('T')[0]
                  ) || [],
                formattedDates: formattedDates,
              }
            : schedule
        ),
      }));
    }
  };

  return (
    <div className='flex flex-col items-center justify-center gap-5 py-4 w-svw'>
      <h2 className='text-[30px] font-semibold'>근무 인원 목록</h2>
      <ul className='flex w-[80%] list-disc flex-col gap-3'>
        {schedules.map((schedule, index) => (
          <li key={index} className='flex items-start justify-between'>
            <span className='w-[110px]'>
              {`${schedule.name} (${schedule.isSupervisor ? '사수' : '부사수'})`}
            </span>
            {schedule.selectedDates.length > 0 && (
              <div className='w-[50%]'>
                <div className='flex'>
                  <span className='whitespace-nowrap'>연차 :</span>
                  <div className='flex flex-wrap ml-2'>
                    {schedule.formattedDates.map((date, idx) => (
                      <span key={idx} className='mr-2'>
                        {date.split(' ').slice(1).join(' ')}
                        {idx < schedule.formattedDates.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className='flex items-center gap-3'>
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
