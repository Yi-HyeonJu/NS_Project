export const formatDate = (date: Date): string => {
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
