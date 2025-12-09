
const FlashCard = ({ word }) => {
    return (
        <div className="flex-grow flex items-center justify-center p-4">
            <div className="bg-white rounded-[3rem] shadow-xl w-full max-w-2xl aspect-[4/3] flex items-center justify-center border-4 border-blue-100 transform transition-all hover:scale-[1.02]">
                <h1 className="card-text text-[clamp(4rem,20vw,120px)] break-all px-4">
                    {word}
                </h1>
            </div>
        </div>
    );
};

export default FlashCard;
