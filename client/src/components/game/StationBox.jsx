function StationBox({ label, station }) {
  return (
    <div className="station-box px-3 py-2 text-center">
      <div className="station-box-label">{label}</div>
      <div className="station-box-name">{station.name}</div>
    </div>
  );
}

export default StationBox;
