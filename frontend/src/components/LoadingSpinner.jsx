import { PulseLoader } from "react-spinners";

const LoadingSpinner = ({
  text = "Loading...",
  size = 14,
  color = "#f97316",
  fullHeight = false,
  compact = false,
  className = "",
}) => {
  return (
    <div
      className={`loading-state ${fullHeight ? "loading-state-full" : ""} ${compact ? "loading-state-compact" : ""} ${className}`.trim()}
    >
      <PulseLoader color={color} size={size} />
      {text ? <p className="loading-state__text">{text}</p> : null}
    </div>
  );
};

export default LoadingSpinner;
