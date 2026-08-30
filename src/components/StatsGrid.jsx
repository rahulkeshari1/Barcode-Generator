const stats = [
  {
    title: "100K+",
    sub: "Generated",
  },
  {
    title: "99%",
    sub: "Accuracy",
  },
  {
    title: "50K+",
    sub: "Users",
  },
  {
    title: "24/7",
    sub: "Online",
  },
];

export default function StatsGrid() {
  return (
    <div className="stats-grid">

      {stats.map((item) => (
        <div
          key={item.title}
          className="stat-card"
        >
          <h3>{item.title}</h3>
          <p>{item.sub}</p>
        </div>
      ))}

    </div>
  );
}