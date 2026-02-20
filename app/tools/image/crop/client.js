"use client";

import { useState, useRef } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Download } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolDropzone from "@/components/tool/ToolDropzone";
import ToolActions, { ActionButton } from "@/components/tool/ToolActions";
import { downloadBlob } from "@/lib/utils/download";

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    )
}

export default function ImageCropperClient() {
    const [imgSrc, setImgSrc] = useState('')
    const [crop, setCrop] = useState()
    const [completedCrop, setCompletedCrop] = useState()
    const [aspect, setAspect] = useState(undefined)
    const [originalFile, setOriginalFile] = useState(null)

    const imgRef = useRef(null)

    const onSelectFile = (files) => {
        if (files && files.length > 0) {
            setOriginalFile(files[0])
            setCrop(undefined) // Reset crop
            const reader = new FileReader()
            reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''))
            reader.readAsDataURL(files[0])
        }
    }

    const onImageLoad = (e) => {
        if (aspect) {
            const { width, height } = e.currentTarget
            setCrop(centerAspectCrop(width, height, aspect))
        }
    }

    const downloadCroppedImage = async () => {
        const image = imgRef.current
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!completedCrop || !image) {
            return
        }

        const scaleX = image.naturalWidth / image.width
        const scaleY = image.naturalHeight / image.height

        canvas.width = completedCrop.width * scaleX
        canvas.height = completedCrop.height * scaleY

        ctx.imageSmoothingQuality = 'high'

        ctx.drawImage(
            image,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
        )

        canvas.toBlob((blob) => {
            if (!blob) return
            downloadBlob(blob, `cropped-${originalFile.name}`)
        }, originalFile.type)
    }

    const handleAspectChange = (value) => {
        setAspect(value)
        if (imgRef.current) {
            const { width, height } = imgRef.current
            if (value) {
                setCrop(centerAspectCrop(width, height, value))
            } else {
                setCrop(undefined)
            }
        }
    }

    return (
        <div className="min-h-screen pb-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <ToolHeader
                    title="Image Cropper"
                    description="Crop your images freely or with fixed aspect ratios."
                    breadcrumbs={[{ label: "Image Tools", href: "/category/image" }, { label: "Cropper" }]}
                />
            </div>

            <div className="max-w-7xl mx-auto">
                {!imgSrc ? (
                    <ToolDropzone
                        onFiles={onSelectFile}
                        accept="image/*"
                        multiple={false}
                        label="Upload image to crop"
                    />
                ) : (
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Controls */}
                        <div className="w-full md:w-[280px] flex-shrink-0 flex flex-col gap-6">
                            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm dark:shadow-2xl dark:shadow-black/20 transition-colors">
                                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-4 m-0">Aspect Ratio</h3>
                                <div className="flex flex-col gap-2">
                                    {[
                                        { label: "Free", value: undefined },
                                        { label: "1:1 (Square)", value: 1 },
                                        { label: "16:9 (Landscape)", value: 16 / 9 },
                                        { label: "4:3 (Standard)", value: 4 / 3 },
                                        { label: "9:16 (Story)", value: 9 / 16 },
                                    ].map((opt, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleAspectChange(opt.value)}
                                            className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${aspect === opt.value
                                                ? "border-gray-300 dark:border-gray-500 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                                : "border-transparent bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <ToolActions>
                                <ActionButton onClick={downloadCroppedImage} icon={Download} disabled={!completedCrop} fullWidth>
                                    Download Crop
                                </ActionButton>
                                <ActionButton variant="secondary" onClick={() => { setImgSrc(''); setOriginalFile(null); }} fullWidth>
                                    Change Image
                                </ActionButton>
                            </ToolActions>
                        </div>

                        {/* Editor */}
                        <div className="flex-1 min-w-0 w-full bg-gray-100 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden flex items-center justify-center min-h-[500px] p-6 shadow-sm dark:shadow-2xl dark:shadow-black/20 transition-colors">
                            <ReactCrop
                                crop={crop}
                                onChange={(_, percentCrop) => setCrop(percentCrop)}
                                onComplete={(c) => setCompletedCrop(c)}
                                aspect={aspect}
                            >
                                <img
                                    ref={imgRef}
                                    alt="Crop me"
                                    src={imgSrc}
                                    className="max-w-full max-h-[600px] object-contain block"
                                    onLoad={onImageLoad}
                                />
                            </ReactCrop>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
