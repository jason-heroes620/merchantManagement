import { useState } from "react";
import { router, Link } from "@inertiajs/react";
import Table from "../Table/Table";
import { Trash2 } from "lucide-react";
import InputLabel from "../InputLabel";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Upload } from "lucide-react";

import axios from "axios";

const MerchantFileList = ({ merchant_id, data }: any) => {
    const [files, setFiles] = useState<File[]>([]);

    const handleFileUpload = (e) => {
        const files: File[] = Array.from(e.target.files || []);
        var canUpload = true;
        files.map((f: File) => {
            f.size > 2097152 ? (canUpload = false) : "";
        });
        if (canUpload) {
            setFiles(files);
        } else {
            alert("1 or more files exceeded the upload limit.");
        }
    };

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

    const handleUpload = (e) => {
        e.preventDefault();
        if (files) {
            router.post(
                `/merchantFileUpload/${merchant_id}`,
                {
                    files: files,
                },
                {
                    forceFormData: true,
                    preserveState: false,
                }
            );
        }
    };

    return (
        <div className="py-4">
            <hr />
            <div className="flex justify-end pt-4">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Upload size={16} /> Add File
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Upload File(s)</DialogTitle>
                        </DialogHeader>
                        <DialogDescription></DialogDescription>
                        <div>
                            <input
                                type="file"
                                multiple
                                accept=".pdf, .jpg, .jped, .png"
                                onChange={(e) => {
                                    handleFileUpload(e);
                                }}
                            />
                            <InputLabel
                                htmlFor="file"
                                value="(supported formats .pdf, .png, .jpg. File(s) should not be more than 2 MB)"
                                className="pt-2"
                            />
                        </div>
                        <div className="flex justify-end py-2">
                            <Button onClick={handleUpload} className="gap-2">
                                <Upload size={16} />
                                Upload
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="pt-2">
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
                                            <>{row.type.file_type_name}</>
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
                                            <div className="flex flex-row gap-2">
                                                <button
                                                    className="border text-sm border-black py-2 px-4 rounded-md hover:bg-black hover:text-white"
                                                    onClick={() =>
                                                        window.open(
                                                            row.link,
                                                            "_blank"
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>
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
                                            </div>
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
