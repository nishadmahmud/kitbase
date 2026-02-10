"use client";

import { useState, useRef, useCallback } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Download, Crop, Image as ImageIcon, RotateCcw } from "lucide-react";
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
    const previewCanvasRef = useRef(null)

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
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px" }}>
            <ToolHeader
                title="Image Cropper"
                description="Crop your images freely or with fixed aspect ratios."
                breadcrumbs={[{ label: "Image Tools", href: "/category/image" }, { label: "Cropper" }]}
            />

            <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
                {!imgSrc ? (
                    <ToolDropzone
                        onFiles={onSelectFile}
                        accept="image/*"
                        multiple={false}
                        label="Upload image to crop"
                    />
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: "32px", alignItems: "start" }}>
                        {/* Controls */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                            <div style={{ backgroundColor: "#171a21", border: "1px solid #2a2f3a", borderRadius: "16px", padding: "20px" }}>
                                <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#9aa0aa", textTransform: "uppercase", marginBottom: "16px" }}>Aspect Ratio</h3>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
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
                                            style={{
                                                padding: "10px", borderRadius: "8px", border: "1px solid",
                                                borderColor: aspect === opt.value ? "#4f8cff" : "#2a2f3a",
                                                backgroundColor: aspect === opt.value ? "rgba(79, 140, 255, 0.1)" : "#0f1115",
                                                color: aspect === opt.value ? "#4f8cff" : "#e6e8ee",
                                                cursor: "pointer", textAlign: "left", fontSize: "14px", fontWeight: 500
                                            }}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <ActionButton onClick={downloadCroppedImage} icon={Download} disabled={!completedCrop}>
                                Download Crop
                            </ActionButton>

                            <ActionButton variant="secondary" onClick={() => { setImgSrc(''); setOriginalFile(null); }}>
                                Change Image
                            </ActionButton>
                        </div>

                        {/* Editor */}
                        <div style={{
                            backgroundColor: "#111", border: "1px solid #2a2f3a", borderRadius: "16px", overflow: "hidden",
                            display: "flex", alignItems: "center", justifyContent: "center", minHeight: "500px", padding: "20px"
                        }}>
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
                                    style={{ maxWidth: "100%", maxHeight: "600px" }}
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
