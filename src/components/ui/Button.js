export default function Button({ children, ...props }) {
    return (
        <button
            className="w-full py-3 px-4 rounded-md font-bold text-gradient-blue bg-black shadow-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 mt-4"
            {...props}
        >
            {children}
        </button>
    );
}
