const StatCard = ({ icon: Icon, iconClass, label, value, badge }) => (
    <div className={`stat-card ${iconClass}`}>
        <div className="stat-card-header">
            <div className={`stat-card-icon ${iconClass}`}>
                <Icon size={20} />
            </div>
            {badge && (
                <span className={`stat-badge ${badge.type}`}>{badge.label}</span>
            )}
        </div>
        <div className="stat-amount">{value}</div>
        <div className="stat-label">{label}</div>
    </div>
);

export default StatCard;
