import React from "react";
import Table from "../Table/Table";
import { Trash2 } from "lucide-react";
import { Link } from "@inertiajs/react";
import axios from "axios";

const MerchantFileList = ({ data }: any) => {
    const { original_file_name, deleted_at } = data;

    const downloadFile = async (id, fileName) => {
        try {
            // Send a GET request to the Laravel route that handles file downloads
            const response = await axios({
                url: "/merchantFileDownload/" + id, // The download route
                method: "GET",
                responseType: "blob", // Important for downloading files
            });

            // Create a link to download the file
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName); // The name of the file
            document.body.appendChild(link);
            link.click();

            // Clean up the link
            link.remove();
        } catch (error) {
            console.error("Error downloading the file:", error);
        }
    };

    return (
        <div>
            <div className="pt-4">
                {data && (
                    <div>
                        <Table
                            columns={[
                                {
                                    label: "File Name",
                                    name: "filename",
                                    renderCell: (row: any) => (
                                        <>
                                            <>{row.original_file_name}</>
                                            {row.deleted_at && (
                                                <Trash2
                                                    size={16}
                                                    className="ml-2 text-gray-400"
                                                />
                                            )}
                                        </>
                                    ),
                                },
                                {
                                    label: "Type",
                                    name: "type",
                                    renderCell: (row: any) => (
                                        <>
                                            <>{row.file_type}</>
                                            {row.deleted_at && (
                                                <Trash2
                                                    size={16}
                                                    className="ml-2 text-gray-400"
                                                />
                                            )}
                                        </>
                                    ),
                                },
                                {
                                    label: "",
                                    name: "download",
                                    renderCell: (row: any) => (
                                        <>
                                            <>
                                                <button
                                                    className="border text-sm border-black py-2 px-4 rounded-md hover:bg-black hover:text-white"
                                                    onClick={() =>
                                                        downloadFile(
                                                            row.id,
                                                            row.original_file_name
                                                        )
                                                    }
                                                >
                                                    Download
                                                </button>
                                            </>
                                        </>
                                    ),
                                },
                            ]}
                            rows={data}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default MerchantFileList;
