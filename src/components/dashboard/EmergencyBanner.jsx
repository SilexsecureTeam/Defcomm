function EmergencyBanner() {
  return (
    <div className="bg-oliveGreen text-gray-900 p-6 min-h-64 flex flex-col md:flex-row md:flex-wrap justify-between gap-2">
      <div className="flex-1 flex flex-col md:w-1/2 gap-2 justify-between">
        <h2 className="text-xl md:text-2xl font-bold flex items-center space-x-2">
          <span>CDS Emergency Executive Meetings</span>
        </h2>
        <p className="text-sm opacity-60 font-medium max-w-[90%]">
          Enjoy various interesting features that you have never experienced before.
        </p>
        <button className="bg-gray-900 text-white/70 px-4 py-2 mt-4 w-max">
          Explore Now
        </button>
      </div>

      <div className="bg-gray-300 max-w-64 md:w-[40%] min-h-40"></div>
    </div>
  );
}

export default EmergencyBanner;
