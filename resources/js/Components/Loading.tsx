import PulseLoader from "react-spinners/PulseLoader";

const Loading = ({ loading }: { loading: boolean }) => {
    return (
        <div className="flex h-screen">
            <div className="m-auto">
                <PulseLoader
                    color={"green"}
                    loading={loading}
                    size={15}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
            </div>
        </div>
    );
};

export default Loading;
