/**
 * Render a vertical stack of six animated chat-bubble loading skeletons with alternating alignment.
 * @returns {JSX.Element} A container element containing six chat-skeleton items (`chat-start` and `chat-end`) that use `animate-pulse`.
 */
function MessagesLoadingSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className={`chat ${index % 2 === 0 ? "chat-start" : "chat-end"} animate-pulse`}
        >
          <div className={`chat-bubble bg-slate-800 text-white w-32`}></div>
        </div>
      ))}
    </div>
  );
}
export default MessagesLoadingSkeleton;