interface PageTitleProps {
    title: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
    return <h2 className="w-fit mx-auto bg-slate-500 text-white rounded-xl py-2 px-8 font-semibold text-2xl my-8 shadow-2xl shadow-slate-700/70">{title}</h2>;
};

export default PageTitle;