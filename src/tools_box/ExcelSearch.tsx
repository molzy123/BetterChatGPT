import { CommonTextInput } from "@src/common/components/CommonTextInput";
import { MainWin } from "@src/window/MainWin";
import { useEffect, useState } from "react";

const ExcelSearch = () => {

    const [files, setFiles] = useState<any[]>([]);
    const [searchText, setSearchText] = useState('');
    useEffect(() => {
        const fetchData = async () => {
            var temp = await MainWin.getExcelFiles('E:\\work_space\\zhenyulin_FCM_Dev_Next\\shared-S4-global\\excel\\PlayerExchange')
            setFiles(temp);
        };
        fetchData();
    }, []);

    const handSearch = async () => {
        var temp = await MainWin.searchSheet(searchText);
        if (temp) {
            setFiles(temp);
        }
    };

    return (
        <>
            <div className="text-gray-900 flex">
                <CommonTextInput hintText="search Text" value={searchText} onChange={setSearchText} /> <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={handSearch} >search</button>
            </div>
            <div className="max-h-screen overflow-y-auto bg-gray-100 shadow-md rounded-lg p-4">
                {files.map((file, index) => (
                    <FileItem key={index} file={file} />
                ))}
            </div>
        </>

    );
};


const FileItem = ({ file }: { file: any }) => {

    const openFile = () => {
        MainWin.openFile(file);
    };

    return (<div className="flex justify-between items-center p-4 border-b">
        <span>{file.filePath}</span>
        {file.sheetName && <span className="text-yellow-700">{file.sheetName}</span>}
        <div className="space-x-2">
            <button onClick={openFile} className="bg-blue-500 text-white px-3 py-1 rounded">View</button>
            <button className="bg-green-500 text-white px-3 py-1 rounded">Edit</button>
            <button className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
        </div>
    </div>)
};

export default ExcelSearch;