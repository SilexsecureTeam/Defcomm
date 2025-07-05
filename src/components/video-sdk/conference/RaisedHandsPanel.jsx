const RaisedHandsPanel = ({ raisedHands, showPanel, onMinimize, onExpand }) => {
  if (!raisedHands.length) return null;

  return (
    <div className="sticky bottom-25 left-4 z-40">
      {!showPanel ? (
        <button
          onClick={onExpand}
          className="font-bold bg-yellow/10 border border-yellow/30 text-olive px-3 py-1 rounded-full shadow hover:bg-yellow/20 transition"
        >
          ✋ {raisedHands.length}
        </button>
      ) : (
        <div className="bg-yellow/10 border border-yellow/30 p-3 rounded-md shadow-lg text-sm max-w-40">
          <div className="flex justify-between items-center mb-2">
            <strong className="text-olive">Raised Hands ✋</strong>
            <button
              onClick={onMinimize}
              className="text-olive text-xs hover:underline"
            >
              Minimize
            </button>
          </div>
          <ul className="space-y-1 text-olive max-h-40 overflow-y-auto">
            {raisedHands.map(({ id, name }) => (
              <li key={id} className="truncate">
                {name || "Participant"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RaisedHandsPanel;
