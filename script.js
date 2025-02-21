// 获取DOM元素
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const qualitySlider = document.getElementById('quality');
const qualityValue = document.getElementById('qualityValue');
const originalImage = document.getElementById('originalImage');
const compressedImage = document.getElementById('compressedImage');
const originalSize = document.getElementById('originalSize');
const compressedSize = document.getElementById('compressedSize');
const downloadBtn = document.getElementById('downloadBtn');

// 上传区域点击事件
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

// 处理文件拖拽
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#007AFF';
});

uploadArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#c7c7cc';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#c7c7cc';
    const file = e.dataTransfer.files[0];
    if (file && file.type.match('image.*')) {
        processImage(file);
    }
});

// 文件选择处理
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        processImage(file);
    }
});

// 质量滑块事件
qualitySlider.addEventListener('input', (e) => {
    qualityValue.textContent = e.target.value + '%';
    if (originalImage.src) {
        compressImage();
    }
});

// 处理图片函数
function processImage(file) {
    // 显示原始文件大小
    originalSize.textContent = formatFileSize(file.size);
    
    // 读取并显示原图
    const reader = new FileReader();
    reader.onload = (e) => {
        originalImage.src = e.target.result;
        compressImage();
    };
    reader.readAsDataURL(file);
}

// 压缩图片函数
function compressImage() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // 设置canvas尺寸
    canvas.width = originalImage.naturalWidth;
    canvas.height = originalImage.naturalHeight;
    
    // 绘制图片
    ctx.drawImage(originalImage, 0, 0);
    
    // 压缩图片
    const quality = qualitySlider.value / 100;
    const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
    
    // 显示压缩后的图片
    compressedImage.src = compressedDataUrl;
    
    // 计算压缩后文件大小
    const compressedSize = Math.round((compressedDataUrl.length - 22) * 3 / 4);
    document.getElementById('compressedSize').textContent = formatFileSize(compressedSize);
    
    // 启用下载按钮
    downloadBtn.disabled = false;
}

// 下载按钮点击事件
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'compressed-image.jpg';
    link.href = compressedImage.src;
    link.click();
});

// 文件大小格式化函数
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
} 