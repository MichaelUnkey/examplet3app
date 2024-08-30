interface PageTitleProps {
	title: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
	return <div className="flex flex-row w-full shadow-lg  shadow-slate-700 items-start justify-center py-4 bg-gradient-to-tr from-slate-800 to-indigo-600 text-white rounded-lg mx-4 mt-4">
			<h2 className="text-center font-semibold text-2xl">{title}</h2>
	</div>;
};

export default PageTitle;
