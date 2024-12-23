export default function BackgroundOverlay({
  isDarkMode,
}: {
  isDarkMode: boolean;
}) {
  return <div className="overlay" style={{ opacity: isDarkMode ? 0.5 : 0 }} />;
}
