const Schedule = () => {
  return (
    <div className='flex flex-col items-center justify-center gap-5 py-4'>
      <h2 className='text-[30px] font-semibold'>근무표</h2>
      <form>
        <button
          type='submit'
          className='px-2 py-1 bg-red-400 rounded-lg hover:bg-red-500'
        >
          근무표 만들기
        </button>
      </form>
    </div>
  );
};

export default Schedule;
