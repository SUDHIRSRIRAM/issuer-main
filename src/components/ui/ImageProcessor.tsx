import { useState } from 'react';
import { removeBackground } from '@imgly/background-removal';

interface ImageProcessorProps {
	selectedFile: File | null;
	setProcessing: (processing: boolean) => void;
}

const config = {
	model: "isnet" as const,
};

const processImage = async (file: File) => {
	try {
		const result = await removeBackground({
			...config,
			image: file,
		});
		return result;
	} catch (error) {
		console.error('Error processing image:', error);
		throw error;
	}
};

export const ImageProcessor: React.FC<ImageProcessorProps> = ({
	selectedFile,
	setProcessing,
}) => {
	const handleProcess = async () => {
		if (!selectedFile) return;
		
		try {
			setProcessing(true);
			await processImage(selectedFile);
		} catch (error) {
			console.error('Failed to process image:', error);
		} finally {
			setProcessing(false);
		}
	};

	return (
		<div>
			<button 
				onClick={handleProcess}
				disabled={!selectedFile}
			>
				Process Image
			</button>
		</div>
	);
};