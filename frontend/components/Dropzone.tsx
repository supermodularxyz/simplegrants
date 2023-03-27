import clsx from "clsx";
import React, { useCallback } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import Upload from "./icons/Upload";
import { toast } from "react-toastify";
import { UseFormRegister } from "react-hook-form";

interface IDropzoneProps {
  className?: string;
  onChange?: any;
}

export default function Dropzone({ className, onChange }: IDropzoneProps) {
  const [file, setFile] = React.useState<any>();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Set file for form
    onChange(acceptedFiles[0]);

    // Set file for preview
    setFile(
      Object.assign(acceptedFiles[0], {
        preview: URL.createObjectURL(acceptedFiles[0]),
      })
    );
  }, []);

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: {
        "image/png": [],
        "image/jpeg": [],
        "image/jpg": [],
      },
      maxFiles: 1,
    });

  React.useEffect(() => {
    if (fileRejections && fileRejections.length > 0) {
      toast.error(fileRejections[0].errors[0].message, {
        toastId: "file-rejections",
      });
    }
  }, [fileRejections]);

  return (
    <>
      <div
        {...getRootProps()}
        className={clsx(
          className,
          "flex items-center justify-center cursor-pointer border rounded-lg overflow-hidden"
        )}
      >
        <input {...getInputProps()} />
        <div
          className={clsx(
            "w-full h-full relative",
            file ? "bg-black" : "bg-transparent"
          )}
        >
          <div
            className={clsx(
              "flex flex-col items-center justify-center w-full h-full absolute z-20 bg-transparent group hover:bg-sg-secondary/10 transition-all duration-200",
              file ? "text-white" : "text-sg-secondary"
            )}
          >
            {isDragActive ? (
              <p>Drop the image here</p>
            ) : file ? (
              <button className="bg-sg-error rounded-full px-12 py-4 text-black font-bold group-hover:opacity-100 opacity-80">
                Change image
              </button>
            ) : (
              <>
                <Upload className="w-8 h-8 mb-2 fill-sg-secondary" />
                <p>Drag & drop your thumbnail, or click to select image</p>
                <p className="text-sm">
                  Only .jpg, .jpeg, or .png files are supported
                </p>
              </>
            )}
          </div>
          {file && (
            <Image
              src={file.preview}
              alt="Preview"
              className="z-10 object-contain"
              fill
            />
          )}
        </div>
      </div>
    </>
  );
}
