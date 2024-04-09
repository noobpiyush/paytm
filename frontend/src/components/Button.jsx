export const Button = ({label, onClick}) => {
    return <button onClick={onClick} type="button" className="w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none" >
        {label}
    </button>
}