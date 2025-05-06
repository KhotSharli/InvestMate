interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
    return (
        <div className="feature-card">
            <div className="icon">{icon}</div>
            <h3 className="title">{title}</h3>
            <p className="description">{description}</p>
        </div>
    );
};

export default FeatureCard;