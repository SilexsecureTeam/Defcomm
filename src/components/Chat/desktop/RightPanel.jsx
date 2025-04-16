import { BiChat } from "react-icons/bi";
import { FaChevronRight, FaFilePdf } from "react-icons/fa";

export default function RightPanel() {
    const files = [
        ["Schedule VCT APAC.pdf", "490kb", "27 Jan 2022"],
        ["IMG_102.jpeg", "2.4 MB", "29 Jan 2022"],
        ["IMG_117.jpeg", "3.5 MB", "31 Jan 2022"],
        ["Video_02-24-22.mp4", "10.9 MB", "02 Feb 2022"],
        ["IMG_247.jpeg", "2.1 MB", "06 Feb 2022"],
        ["VCT Masters.pdf", "320kb", "19 Feb 2022"],
    ];

    return (
        <div className="w-72 p-4 space-y-6 overflow-y-auto">
            <div>
                <div className="flex justify-between gap-2 items-center">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-200"><div className="p-3 bg-black rounded-2xl"><BiChat size={24} /></div>Media <span className="text-sm">38</span></h3>
                    <button className="underline text-sm">View All</button>
                </div>
                <div className="flex space-x-2 mt-2">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-16 h-16 bg-gray-300 rounded-lg" />
                    ))}
                    <div className="w-16 h-16 bg-gray-500 rounded-lg flex items-center justify-center text-sm text-white font-bold">36+</div>
                </div>
            </div>

            <div>
                <div className="flex justify-between gap-2 items-center">
                    <h3 className="text-lg font-semibold mb-4">Link <span className="text-sm text-gray-200 ml-1">14</span></h3>
                    <button className="underline text-sm">View All</button>
                </div>

                <div className="min-h-32 bg-white rounded-lg flex flex-col justify-between">
                    <section className="flex-1 flex gap-2 flex-wrap p-3">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="bg-gray-300 w-14 h-14 rounded-lg mb-2">

                            </div>
                        ))}
                    </section>
                    <button className="text-black font-bold text-xs mt-1 flex justify-between gap-2 p-3 hover:bg-gray-200 rounded-lg">View Messages <FaChevronRight /> </button>

                </div>

            </div>

            <div>
                <div className="flex justify-between gap-2 items-center">
                    <h3 className="text-lg font-semibold mb-4">Files <span className="text-sm text-gray-200 ml-1">10</span></h3>
                    <button className="underline text-sm">View All</button>
                </div>
                <section className="flex-1 flex flex-col gap-2">
                    {files.map(([name, size, date], i) => (
                        <div key={i} className="bg-gray-900/60 flex gap-4 items-center text-sm p-2 rounded mb-1">
                            <p className="p-2 bg-white text-black rounded-lg"><FaFilePdf size={24} /></p>
                            <div>
                                <p className="font-medium">{name}</p>
                                <div className="text-xs text-gray-300 mt-2 flex gap-2 flex-wrap"><span>{size}</span> <span>{date}</span></div>
                            </div>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
}
