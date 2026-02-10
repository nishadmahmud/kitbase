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

export default function ImageCropperPage() {
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
        <div className="max-w-[1280px] mx-auto px-6 py-10">
            <ToolHeader
                title="Image Cropper"
                description="Crop your images freely or with fixed aspect ratios."
                breadcrumbs={[{ label: "Image Tools", href: "/category/image" }, { label: "Cropper" }]}
            />

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
                            <div className="bg-[#171a21] border border-gray-800 rounded-2xl p-6">
                                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-4 m-0">Aspect Ratio</h3>
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
                                                ? "border-blue-500 bg-blue-500/10 text-blue-500"
                                                : "border-transparent bg-[#1a1e27] text-gray-200 hover:bg-gray-800"
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
                        <div className="flex-1 min-w-0 w-full bg-black border border-gray-800 rounded-2xl overflow-hidden flex items-center justify-center min-h-[500px] p-6">
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
