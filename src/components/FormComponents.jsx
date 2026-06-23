import React, { useRef, useState } from 'react';
import { Upload, File, CheckCircle, AlertCircle, X, Info, Loader2 } from 'lucide-react';

// Custom Text/Number Input with built-in Tailwind styling
export function Input({ label, type = 'text', name, value, onChange, error, placeholder, required = false, note, maxLength, pattern }) {
  return (
    <div className="space-y-1.5 w-full">
      <label className="block text-sm font-semibold text-nile-dark" htmlFor={name}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative rounded-lg shadow-sm">
        <input
          type={type}
          name={name}
          id={name}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          pattern={pattern}
          className={`block w-full rounded-xl border px-4 py-3 text-sm transition focus:outline-none focus:ring-2 ${
            error
              ? 'border-nile-error focus:border-nile-error focus:ring-red-100'
              : 'border-nile-border focus:border-nile-darkgreen focus:ring-nile-softmint'
          } bg-white text-nile-dark`}
        />
        {error && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-nile-error">
            <AlertCircle size={18} />
          </div>
        )}
      </div>
      {note && <p className="text-xs text-nile-muted flex items-center gap-1"><Info size={12} /> {note}</p>}
      {error && <p className="text-xs text-nile-error font-medium">{error}</p>}
    </div>
  );
}

// Custom Select input
export function Select({ label, name, value, onChange, options, error, required = false, note }) {
  return (
    <div className="space-y-1.5 w-full">
      <label className="block text-sm font-semibold text-nile-dark" htmlFor={name}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        id={name}
        value={value || ''}
        onChange={onChange}
        className={`block w-full rounded-xl border border-nile-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-nile-softmint focus:border-nile-darkgreen bg-white text-nile-dark transition ${
          error ? 'border-nile-error focus:ring-red-100' : ''
        }`}
      >
        <option value="">Select option...</option>
        {options.map((opt) => (
          <option key={opt.value || opt} value={opt.value || opt}>
            {opt.label || opt}
          </option>
        ))}
      </select>
      {note && <p className="text-xs text-nile-muted flex items-center gap-1"><Info size={12} /> {note}</p>}
      {error && <p className="text-xs text-nile-error font-medium">{error}</p>}
    </div>
  );
}

// File Upload Card validating 5MB size limit
export function FileUploadCard({ label, required = false, value, onChange, error, accept = '.pdf,.png,.jpg,.jpeg' }) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndProcessFile(file);
    }
  };

  const validateAndProcessFile = async (file) => {
    // 5MB is 5 * 1024 * 1024 bytes
    const maxSizeBytes = 5 * 1024 * 1024;
    
    // Check file size
    if (file.size > maxSizeBytes) {
      onChange(null, `File "${file.name}" exceeds the 5MB size limit.`);
      return;
    }

    // Check file extension
    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    const acceptedExtensions = accept.split(',');
    if (!acceptedExtensions.some(ext => extension.endsWith(ext.trim()))) {
      onChange(null, `Invalid file type. Please upload a PDF, PNG, or JPG.`);
      return;
    }

    setIsUploading(true);
    try {
      const uploadBody = new FormData();
      uploadBody.append('file', file);
      const response = await fetch('/api/upload', { method: 'POST', body: uploadBody });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Document upload failed.');
      onChange(payload, null);
    } catch (uploadError) {
      onChange(null, uploadError.message || 'Document upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-nile-dark">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {isUploading ? (
        <div className="flex items-center justify-center gap-3 border border-nile-border bg-slate-50 rounded-xl p-6 text-nile-darkgreen">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm font-bold">Uploading securely…</span>
        </div>
      ) : value ? (
        <div className="flex items-center justify-between border border-nile-border bg-nile-softmint/30 rounded-xl p-4 transition duration-200">
          <div className="flex items-center space-x-3 truncate">
            <div className="bg-nile-darkgreen/10 text-nile-darkgreen p-2 rounded-lg">
              <File size={20} />
            </div>
            <div className="truncate text-left">
              <a 
                href={value.url} 
                target="_blank" 
                rel="noreferrer" 
                className="text-sm font-semibold text-nile-darkgreen hover:underline truncate block max-w-[200px]"
                title="Click to view file"
              >
                {value.name}
              </a>
              <p className="text-xs text-nile-muted">{value.size}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-nile-darkgreen bg-nile-brightgreen/20 px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle size={12} /> Ready
            </span>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="text-nile-muted hover:text-red-600 p-1 rounded-full hover:bg-slate-100 transition"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-2 ${
            dragActive
              ? 'border-nile-brightgreen bg-nile-softmint/40'
              : error
              ? 'border-nile-error bg-red-50/30'
              : 'border-nile-border hover:border-nile-darkgreen hover:bg-slate-50'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={accept}
            className="hidden"
          />
          <div className="bg-slate-100 p-3 rounded-full text-nile-darkgreen">
            <Upload size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-nile-dark">Click to upload or drag & drop</p>
            <p className="text-xs text-nile-muted mt-1">PDF, PNG, or JPG (max 5MB)</p>
          </div>
        </div>
      )}
      {error && <p className="text-xs text-nile-error font-medium">{error}</p>}
    </div>
  );
}

// Stepper navigation for sidebar / top view
export function ProgressStepper({ steps, currentStep }) {
  return (
    <div className="hidden lg:block w-72 bg-white rounded-2xl border border-nile-border p-6 shadow-sm h-fit sticky top-24">
      <h3 className="text-xs font-bold text-nile-muted uppercase tracking-wider mb-4">Application progress</h3>
      <div className="space-y-4">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isActive = idx === currentStep;
          return (
            <div key={idx} className="flex items-start space-x-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isCompleted
                      ? 'bg-nile-darkgreen text-white ring-2 ring-nile-softmint'
                      : isActive
                      ? 'bg-nile-brightgreen text-nile-darkgreen ring-2 ring-nile-softmint font-extrabold shadow-sm scale-110'
                      : 'bg-slate-100 text-nile-muted border border-nile-border'
                  }`}
                >
                  {isCompleted ? '✓' : idx + 1}
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`w-0.5 h-8 mt-2 transition-all duration-300 ${
                      isCompleted ? 'bg-nile-darkgreen' : 'bg-slate-100'
                    }`}
                  />
                )}
              </div>
              <div className="pt-0.5">
                <p
                  className={`text-sm font-semibold transition-colors duration-200 ${
                    isActive
                      ? 'text-nile-darkgreen font-bold'
                      : isCompleted
                      ? 'text-nile-dark'
                      : 'text-nile-muted'
                  }`}
                >
                  {step}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Section card layout for review pages
export function KYCSectionCard({ title, children, editAction }) {
  return (
    <div className="bg-white rounded-2xl border border-nile-border p-6 shadow-sm space-y-4">
      <div className="flex justify-between items-center border-b border-nile-border pb-3">
        <h3 className="text-base font-bold text-nile-darkgreen">{title}</h3>
        {editAction && (
          <button
            type="button"
            onClick={editAction}
            className="text-xs font-bold text-nile-darkgreen hover:text-nile-brightgreen bg-nile-softmint px-3 py-1.5 rounded-lg transition"
          >
            Edit Section
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
        {children}
      </div>
    </div>
  );
}

// Label-Value row for reviews
export function DetailRow({ label, value, isFile = false }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-nile-muted font-medium">{label}</p>
      {isFile ? (
        value ? (
          <div className="flex items-center gap-1.5 text-nile-darkgreen bg-nile-softmint/40 px-2 py-1 rounded-lg w-fit text-xs font-medium border border-nile-softmint">
            <File size={14} />
            <span>{value.name || value}</span>
          </div>
        ) : (
          <span className="text-slate-400 italic text-xs">No file uploaded</span>
        )
      ) : (
        <p className="text-sm font-semibold text-nile-dark">{value || <span className="text-slate-400 italic font-normal">Not provided</span>}</p>
      )}
    </div>
  );
}
