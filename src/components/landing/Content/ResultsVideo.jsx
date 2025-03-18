import { FaPlay } from "react-icons/fa6"


function ResultsVideo() {
    return (
        <>
            <div className=' flex flex-col items-center font-[poppins] pb-20 bg-linear-gradient text-white '>
                <h1 className='text-2xl my-2 md:text-4xl  font-bolder text-center w-full'>Trusted Defense Communication Platform</h1>
                <p className='text-sm tracking-wider mb-6 text-center max-w-[800px] w-[90%]'>Get started with the Africa's premier interoperable tactical communication platform, designe for military, government, and defense industry.</p>
                <div className="relative bg-gray-200 w-[90%] max-w-[1000px] h-96 md:h-[400px] rounded-lg flex items-center justify-center p-0">
                    <iframe
                        className="w-full h-full rounded-lg"
                        src="https://www.youtube.com/embed/Cdk2dfkOmWw?rel=0&modestbranding=1&autoplay=1&controls=1"
                        title="YouTube video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                    {/* <figure className="z-[10] w-16 h-16 flex items-center justify-center bg-white text-black rounded-full absolute">
                    <FaPlay size={24} className="w-[70%]" />
                    </figure>
                     <hr className="absolute mx-auto w-1 min-h-full bg-oliveDark top-0 bottom-0" /> */}
                </div>

                <div className="flex items-center gap-6 mt-8 mb-4 border-b-2 border-lime-800 pl-4  ">
                    <p>Defcomm On Device</p>
                    <div className="border-b-2 border-lime-400 py-2 pr-4 rounded-sm">
                        <p>Defcomm Self Hosted</p>
                    </div>
                </div>
                <p className=" max-w-[800px] w-[90%]">Defcomm System delivers unparalleled security, reliability, and operational efficiency.</p>
            </div>
        </>
    )
}

export default ResultsVideo
