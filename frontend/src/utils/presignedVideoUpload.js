/** PUT file to presigned S3 URL (XHR avoids axios headers that break SigV4). */
function putFileToPresignedUrl(
  uploadUrl,
  file,
  contentType,
  { onUploadProgress, onSocketProgress, putStart, totalMB },
) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", contentType);

    xhr.upload.onprogress = (ev) => {
      if (onUploadProgress) onUploadProgress(ev);
      if (!onSocketProgress || !ev.lengthComputable) return;
      const loadedMB = ev.loaded / (1024 * 1024);
      const totalMBEv = ev.total / (1024 * 1024);
      const pct = Math.round((ev.loaded / ev.total) * 100);
      const elapsed = (Date.now() - putStart) / 1000;
      onSocketProgress({
        percentage: pct,
        loadedMB,
        totalMB: totalMBEv,
        speed: loadedMB / (elapsed || 1),
        time: elapsed,
      });
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
        return;
      }
      const detail = (xhr.responseText || "").slice(0, 200);
      reject(
        new Error(
          `Video upload to storage failed (${xhr.status})${detail ? `: ${detail}` : ""}`,
        ),
      );
    };

    xhr.onerror = () => {
      reject(
        new Error(
          "Video upload to storage failed (network/CORS). Ensure the S3 bucket allows PUT from your origin.",
        ),
      );
    };

    xhr.send(file);
  });
}

/**
 * Upload a video file via presigned S3 PUT, then return the public URL.
 *
 * @param {import('axios').AxiosInstance} api - axios instance (e.g. axiosApi)
 * @param {File} file
 * @param {object} options
 * @param {string} options.purpose - see backend ALLOWED_PRESIGNED_VIDEO_PURPOSES
 * @param {object} [options.headers] - extra request headers for presign GET
 * @param {object} [options.params] - song_id, page_name, ophid, etc.
 * @param {(ev: ProgressEvent) => void} [options.onUploadProgress]
 * @param {(payload: object) => void} [options.onSocketProgress] - e.g. socket.emit
 */
export async function uploadVideoViaPresignedPut(api, file, options = {}) {
  const {
    purpose,
    headers = {},
    params = {},
    onUploadProgress,
    onSocketProgress,
  } = options;

  if (!file || !(file instanceof File)) {
    throw new Error("A video File is required");
  }
  if (!purpose) {
    throw new Error("presigned upload purpose is required");
  }

  const pres = await api.get("/presigned-upload/video", {
    headers,
    params: {
      purpose,
      filename: file.name,
      content_type: file.type || "application/octet-stream",
      ...params,
    },
  });

  if (!pres.data?.success || !pres.data.uploadUrl || !pres.data.publicUrl) {
    throw new Error(pres.data?.message || "Could not prepare video upload");
  }

  const contentType =
    pres.data.contentType || file.type || "application/octet-stream";
  const putStart = Date.now();
  const totalMB = file.size / (1024 * 1024);

  if (onSocketProgress) {
    onSocketProgress({
      percentage: 0,
      loadedMB: 0,
      totalMB,
      speed: 0,
      time: 0,
    });
  }

  await putFileToPresignedUrl(pres.data.uploadUrl, file, contentType, {
    onUploadProgress,
    onSocketProgress,
    putStart,
    totalMB,
  });

  return pres.data.publicUrl;
}

/**
 * @param {File|string|null|undefined} fileOrUrl
 * @param {string} purpose
 * @param {object} rest - passed to uploadVideoViaPresignedPut
 */
export async function resolveVideoUrlForUpload(api, fileOrUrl, purpose, rest = {}) {
  if (!fileOrUrl) return null;
  if (typeof fileOrUrl === "string") {
    if (fileOrUrl.startsWith("blob:") || fileOrUrl.startsWith("http")) {
      return fileOrUrl.startsWith("http") ? fileOrUrl : null;
    }
    return fileOrUrl;
  }
  if (fileOrUrl instanceof File) {
    return uploadVideoViaPresignedPut(api, fileOrUrl, { purpose, ...rest });
  }
  return null;
}
