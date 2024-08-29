interface CreatedByProps {
    created_by: string;
}

const CreatedBy: React.FC<CreatedByProps> = ({ created_by }) => {
    return <div className='flex mt-8 gap-4'><p>{created_by ?? "Unknown"}</p></div>;
};

export default CreatedBy;